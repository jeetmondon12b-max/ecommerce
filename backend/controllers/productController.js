import Product from '../models/Product.js';
import Category from '../models/CategoryModel.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import asyncHandler from 'express-async-handler';

// Helper to safely delete an uploaded file
const safeUnlink = async (storedPath) => {
    if (!storedPath) return;
    const relativePath = storedPath.startsWith('/') ? storedPath.substring(1) : storedPath;
    const fullPath = path.join(process.cwd(), relativePath);
    try {
        await fs.unlink(fullPath);
    } catch (err) {
        console.warn(`safeUnlink: could not delete file at ${fullPath}`, err.message);
    }
};

// Helper to ensure uploads directory exists
const getUploadsDir = async () => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    return uploadsDir;
};

// Helper function to process and save images
const processImage = async (fileBuffer, prefix) => {
    const uploadsDir = await getUploadsDir();
    const newFilename = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}.webp`;
    const outputPath = path.join(uploadsDir, newFilename);
    await sharp(fileBuffer)
        .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
        .toFormat("webp", { quality: 85 })
        .toFile(outputPath);
    return `/uploads/${newFilename}`;
};

// @desc    Create a new product (Admin only)
export const createProduct = asyncHandler(async (req, res) => {
    if (!req.files || !req.files['image']) {
        res.status(400);
        throw new Error('Main product image is required.');
    }
    const mainImage = await processImage(req.files['image'][0].buffer, 'product');
    let galleryImages = [];
    if (req.files['productImages']) {
        galleryImages = await Promise.all(
            req.files['productImages'].map((file) => processImage(file.buffer, 'gallery'))
        );
    }
    const { 
        name, brand, description, regularPrice, discountPrice, countInStock, 
        pageCategory, categories, tags: tagsJson, sizes: sizesJson, rating, numReviews 
    } = req.body;
    const categoryIds = categories ? categories.split(',').filter(id => id) : [];
    let discountPercentage = 0;
    if (regularPrice && discountPrice) {
        discountPercentage = Math.round(((Number(regularPrice) - Number(discountPrice)) / Number(regularPrice)) * 100);
    }
    const newProduct = new Product({
        user: req.user._id,
        name, brand, description,
        regularPrice: Number(regularPrice),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        discountPercentage,
        countInStock: Number(countInStock),
        image: mainImage,
        productImages: galleryImages,
        categories: categoryIds,
        pageCategory,
        tags: tagsJson ? JSON.parse(tagsJson) : { topSelling: false, newProduct: false },
        sizes: sizesJson ? JSON.parse(sizesJson) : undefined,
        rating: rating ? Number(rating) : 0,
        numReviews: numReviews ? Number(numReviews) : 0,
    });
    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product (Admin only)
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    const { 
        name, brand, description, regularPrice, discountPrice, countInStock, 
        pageCategory, categories, tags: tagsJson, sizes: sizesJson, rating, numReviews
    } = req.body;
    if (req.files && req.files['image']) {
        await safeUnlink(product.image);
        product.image = await processImage(req.files['image'][0].buffer, 'product');
    }
    if (req.files && req.files['productImages']) {
        for (const imgPath of product.productImages) {
            await safeUnlink(imgPath);
        }
        product.productImages = await Promise.all(
            req.files['productImages'].map((file) => processImage(file.buffer, 'gallery'))
        );
    }
    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.regularPrice = regularPrice ?? product.regularPrice;
    product.countInStock = countInStock ?? product.countInStock;
    product.pageCategory = pageCategory || product.pageCategory;
    product.rating = rating ?? product.rating;
    product.numReviews = numReviews ?? product.numReviews;
    if (discountPrice !== undefined) {
        const newDiscountPrice = Number(discountPrice);
        if (!isNaN(newDiscountPrice) && newDiscountPrice >= 0) {
            product.discountPrice = newDiscountPrice;
            const newRegularPrice = Number(regularPrice) || product.regularPrice;
            product.discountPercentage = Math.round(((newRegularPrice - newDiscountPrice) / newRegularPrice) * 100);
        } else {
            product.discountPrice = undefined;
            product.discountPercentage = 0;
        }
    }
    if (categories) product.categories = categories.split(',').filter(id => id);
    if (sizesJson) product.sizes = JSON.parse(sizesJson);
    if (tagsJson) product.tags = JSON.parse(tagsJson);
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
});

// @desc    Delete a product (Admin only)
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        const imagesToDelete = [product.image, ...product.productImages].filter(Boolean);
        for (const imgPath of imagesToDelete) {
            await safeUnlink(imgPath);
        }
        await product.deleteOne();
        res.status(200).json({ message: 'Product and associated images removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// ✅✅✅ FIXED: getProducts function with proper filtering
// @desc    Fetch all products with filtering and pagination
export const getProducts = asyncHandler(async (req, res) => {
    // পেজিনেশনের জন্য limit এবং page ভ্যারিয়েবল
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;

    // URL থেকে পাওয়া কোয়েরি প্যারামিটার
    const { category: categorySlug, pageCategory } = req.query;
    
    // ডাটাবেসে খোঁজার জন্য ফিল্টার অবজেক্ট
    const filter = {};

    // ✅ FIX 1: categorySlug দিয়ে ফিল্টারিং উন্নত করা
    if (categorySlug) {
        const category = await Category.findOne({ slug: categorySlug });
        if (category) {
            // প্রোডাক্টের categories অ্যারেতে এই ক্যাটাগরির আইডি আছে কিনা তা চেক করা হচ্ছে
            filter.categories = { $in: [category._id] };
        } else {
            // যদি slug দিয়ে কোনো ক্যাটাগরি না পাওয়া যায়, তবে খালি ফলাফল পাঠানো হবে
            return res.json({ 
                products: [], 
                page: 1, 
                pages: 0, 
                total: 0,
                message: 'Category not found'
            });
        }
    }

    // ✅ FIX 2: pageCategory ফিল্টারিং উন্নত করা (case-insensitive)
    if (pageCategory) {
        filter.pageCategory = { 
            $regex: new RegExp(`^${pageCategory}$`, 'i') 
        };
    }

    console.log('Filter being applied:', filter); // ডিবাগিং জন্য

    // ফিল্টার অনুযায়ী মোট প্রোডাক্ট সংখ্যা গণনা
    const count = await Product.countDocuments(filter);

    // ফিল্টার এবং পেজিনেশন অনুযায়ী প্রোডাক্ট খোঁজা
    const products = await Product.find(filter)
        .populate('categories', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(limit * (page - 1));

    // চূড়ান্ত ফলাফল পাঠানো
    res.json({
        products,
        page,
        pages: Math.ceil(count / limit),
        total: count,
        filters: { categorySlug, pageCategory } // ডিবাগিং জন্য
    });
});

// @desc    Fetch single product by ID
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('categories', 'name slug')
        .populate('reviews.user', 'name');
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Search products by name
export const searchProducts = asyncHandler(async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json({ products: [] });
    const queryFilter = { name: { $regex: q, $options: 'i' } };
    const products = await Product.find(queryFilter);
    res.json({ products });
});

// @desc    Get product name suggestions for search
export const getProductSuggestions = asyncHandler(async (req, res) => {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json([]);
    const suggestions = await Product.find({ name: { $regex: q, $options: 'i' } }).limit(7).select('name');
    res.json(suggestions);
});

// @desc    Create a new review
export const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) {
            res.status(400);
            throw new Error('You have already reviewed this product');
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        await product.save();
        res.status(201).json({ message: 'Review added successfully' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});