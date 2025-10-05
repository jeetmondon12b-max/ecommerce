// import Product from '../models/Product.js';
// import Category from '../models/CategoryModel.js';
// import Banner from '../models/bannerModel.js'; // ✅ নতুন Banner মডেল import করা হয়েছে
// import PageCategory from '../models/pageCategoryModel.js'; // ✅ নতুন PageCategory মডেল import করা হয়েছে
// import sharp from 'sharp';
// import asyncHandler from 'express-async-handler';
// import cloudinary from '../config/cloudinaryConfig.js';

// // Helper function to upload image buffer to Cloudinary
// const uploadToCloudinary = (buffer, folder, prefix) => {
//     return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//             {
//                 folder: `e-commerce/${folder}`,
//                 public_id: `${prefix}-${Date.now()}`,
//                 format: 'webp',
//                 transformation: [
//                     { width: 800, height: 800, crop: 'limit' }
//                 ]
//             },
//             (error, result) => {
//                 if (error) {
//                     reject(error);
//                 } else {
//                     resolve({
//                         url: result.secure_url,
//                         public_id: result.public_id,
//                     });
//                 }
//             }
//         );

//         sharp(buffer).resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true }).toFormat("webp", { quality: 85 }).pipe(uploadStream);
//     });
// };

// // Helper function to delete image from Cloudinary
// const deleteFromCloudinary = async (public_id) => {
//     try {
//         await cloudinary.uploader.destroy(public_id);
//     } catch (error) {
//         console.error(`Cloudinary: Could not delete file at ${public_id}`, error.message);
//     }
// };

// // @desc    Create a new product (Admin only)
// export const createProduct = asyncHandler(async (req, res) => {
//     if (!req.files || !req.files['image']) {
//         res.status(400);
//         throw new Error('Main product image is required.');
//     }

//     const mainImageUpload = await uploadToCloudinary(req.files['image'][0].buffer, 'products', 'product');

//     let galleryImagesUploads = [];
//     if (req.files['productImages']) {
//         galleryImagesUploads = await Promise.all(
//             req.files['productImages'].map((file) => uploadToCloudinary(file.buffer, 'products', 'gallery'))
//         );
//     }

//     const {
//         name, brand, description, regularPrice, discountPrice, countInStock,
//         pageCategory, categories, tags: tagsJson, sizes: sizesJson, rating, numReviews
//     } = req.body;

//     const categoryIds = categories ? categories.split(',').filter(id => id) : [];
//     let discountPercentage = 0;
//     if (regularPrice && discountPrice) {
//         discountPercentage = Math.round(((Number(regularPrice) - Number(discountPrice)) / Number(regularPrice)) * 100);
//     }

//     const newProduct = new Product({
//         user: req.user._id,
//         name, brand, description,
//         regularPrice: Number(regularPrice),
//         discountPrice: discountPrice ? Number(discountPrice) : undefined,
//         discountPercentage,
//         countInStock: Number(countInStock),
//         image: mainImageUpload.url,
//         imagePublicId: mainImageUpload.public_id,
//         productImages: galleryImagesUploads.map(img => img.url),
//         productImagesPublicIds: galleryImagesUploads.map(img => img.public_id),
//         categories: categoryIds,
//         pageCategory,
//         tags: tagsJson ? JSON.parse(tagsJson) : { topSelling: false, newProduct: false },
//         sizes: sizesJson ? JSON.parse(sizesJson) : undefined,
//         rating: rating ? Number(rating) : 0,
//         numReviews: numReviews ? Number(numReviews) : 0,
//     });

//     const createdProduct = await newProduct.save();
//     res.status(201).json(createdProduct);
// });

// // @desc    Update a product (Admin only)
// export const updateProduct = asyncHandler(async (req, res) => {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//         res.status(404);
//         throw new Error('Product not found');
//     }

//     if (req.files && req.files['image']) {
//         if (product.imagePublicId) {
//             await deleteFromCloudinary(product.imagePublicId);
//         }
//         const mainImageUpload = await uploadToCloudinary(req.files['image'][0].buffer, 'products', 'product');
//         product.image = mainImageUpload.url;
//         product.imagePublicId = mainImageUpload.public_id;
//     }

//     if (req.files && req.files['productImages']) {
//         if (product.productImagesPublicIds && product.productImagesPublicIds.length > 0) {
//             await cloudinary.api.delete_resources(product.productImagesPublicIds);
//         }
//         const galleryImagesUploads = await Promise.all(
//             req.files['productImages'].map((file) => uploadToCloudinary(file.buffer, 'products', 'gallery'))
//         );
//         product.productImages = galleryImagesUploads.map(img => img.url);
//         product.productImagesPublicIds = galleryImagesUploads.map(img => img.public_id);
//     }

//     const {
//         name, brand, description, regularPrice, discountPrice, countInStock,
//         pageCategory, categories, tags: tagsJson, sizes: sizesJson, rating, numReviews
//     } = req.body;
    
//     product.name = name || product.name;
//     product.brand = brand || product.brand;
//     product.description = description || product.description;
//     product.regularPrice = regularPrice ?? product.regularPrice;
//     product.countInStock = countInStock ?? product.countInStock;
//     product.pageCategory = pageCategory || product.pageCategory;
//     product.rating = rating ?? product.rating;
//     product.numReviews = numReviews ?? product.numReviews;

//     if (discountPrice !== undefined) {
//         const newDiscountPrice = Number(discountPrice);
//         if (!isNaN(newDiscountPrice) && newDiscountPrice >= 0) {
//             product.discountPrice = newDiscountPrice;
//             const newRegularPrice = Number(regularPrice) || product.regularPrice;
//             product.discountPercentage = Math.round(((newRegularPrice - newDiscountPrice) / newRegularPrice) * 100);
//         } else {
//             product.discountPrice = undefined;
//             product.discountPercentage = 0;
//         }
//     }

//     if (categories) product.categories = categories.split(',').filter(id => id);
//     if (sizesJson) product.sizes = JSON.parse(sizesJson);
//     if (tagsJson) product.tags = JSON.parse(tagsJson);

//     const updatedProduct = await product.save();
//     res.status(200).json(updatedProduct);
// });

// // @desc    Delete a product (Admin only)
// export const deleteProduct = asyncHandler(async (req, res) => {
//     const product = await Product.findById(req.params.id);

//     if (product) {
//         if (product.imagePublicId) {
//             await deleteFromCloudinary(product.imagePublicId);
//         }
//         if (product.productImagesPublicIds && product.productImagesPublicIds.length > 0) {
//             await cloudinary.api.delete_resources(product.productImagesPublicIds);
//         }

//         await product.deleteOne();
//         res.status(200).json({ message: 'Product and associated images removed' });
//     } else {
//         res.status(404);
//         throw new Error('Product not found');
//     }
// });

// // @desc    Fetch all products with filtering and pagination
// export const getProducts = asyncHandler(async (req, res) => {
//     const limit = parseInt(req.query.limit) || 12;
//     const page = parseInt(req.query.page) || 1;
//     const { category: categorySlug, pageCategory, search } = req.query;
    
//     const filter = {};

//     if (search) {
//         filter.name = { $regex: search, $options: 'i' };
//     }

//     if (categorySlug) {
//         const category = await Category.findOne({ slug: categorySlug });
//         if (category) {
//             filter.categories = { $in: [category._id] };
//         } else {
//             return res.json({ 
//                 products: [], 
//                 page: 1, 
//                 pages: 0, 
//                 total: 0,
//             });
//         }
//     }

//     if (pageCategory && pageCategory.toLowerCase() !== 'all-products') {
//         filter.pageCategory = {
//             $regex: new RegExp(`^${pageCategory}$`, 'i')
//         };
//     }

//     const count = await Product.countDocuments(filter);
//     const products = await Product.find(filter)
//         .populate('categories', 'name slug')
//         .sort({ createdAt: -1 })
//         .limit(limit)
//         .skip(limit * (page - 1));

//     res.json({
//         products,
//         page,
//         pages: Math.ceil(count / limit),
//         total: count,
//     });
// });

// // @desc    Fetch single product by ID
// export const getProductById = asyncHandler(async (req, res) => {
//     const product = await Product.findById(req.params.id)
//         .populate('categories', 'name slug')
//         .populate('reviews.user', 'name');
//     if (product) {
//         res.json(product);
//     } else {
//         res.status(404);
//         throw new Error('Product not found');
//     }
// });

// // @desc    Search products by name
// export const searchProducts = asyncHandler(async (req, res) => {
//     const { q } = req.query;
//     if (!q) return res.json({ products: [] });
//     const queryFilter = { name: { $regex: q, $options: 'i' } };
//     const products = await Product.find(queryFilter);
//     res.json({ products });
// });

// // @desc    Get product name suggestions for search
// export const getProductSuggestions = asyncHandler(async (req, res) => {
//     const { q } = req.query;
//     if (!q || q.trim().length < 2) return res.json([]);
//     const suggestions = await Product.find({ name: { $regex: q, $options: 'i' } }).limit(7).select('name');
//     res.json(suggestions);
// });

// // @desc    Create a new review
// export const createProductReview = asyncHandler(async (req, res) => {
//     const { rating, comment } = req.body;
//     const product = await Product.findById(req.params.id);
//     if (product) {
//         const alreadyReviewed = product.reviews.find(
//             (r) => r.user.toString() === req.user._id.toString()
//         );
//         if (alreadyReviewed) {
//             res.status(400);
//             throw new Error('You have already reviewed this product');
//         }
//         const review = {
//             name: req.user.name,
//             rating: Number(rating),
//             comment,
//             user: req.user._id,
//         };
//         product.reviews.push(review);
//         product.numReviews = product.reviews.length;
//         product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
//         await product.save();
//         res.status(201).json({ message: 'Review added successfully' });
//     } else {
//         res.status(404);
//         throw new Error('Product not found');
//     }
// });

// // ✅✅✅ নতুন ফাংশনটি এখানে যোগ করা হয়েছে ✅✅✅
// // @desc    Get all data needed for the homepage in a single request
// // @route   GET /api/products/homepage-data
// // @access  Public
// export const getHomepageData = asyncHandler(async (req, res) => {
//     try {
//         // ১. ব্যানার এবং পেজ ক্যাটাগরি আনুন
//         const [banners, pageCategories, productCategories] = await Promise.all([
//             Banner.find({}).sort({ createdAt: -1 }),
//             PageCategory.find({}).sort({ name: 1 }),
//             Category.aggregate([
//                 { $lookup: { from: 'products', localField: '_id', foreignField: 'categories', as: 'products' } },
//                 { $project: { _id: 1, name: 1, slug: 1, productCount: { $size: '$products' } } },
//                 { $match: { productCount: { $gt: 0 } } }, // শুধু যে ক্যাটাগরিতে প্রোডাক্ট আছে সেগুলোই আনবে
//                 { $sort: { name: 1 } }
//             ])
//         ]);

//         // ২. ক্যাটাগরি অনুযায়ী প্রোডাক্ট সেকশন তৈরি করুন (এখানে উদাহরণস্বরূপ ৩টি ক্যাটাগরি দেখানো হলো)
//         const topCategorySlugs = productCategories.slice(0, 3).map(c => c.slug);
//         const productSectionsPromises = topCategorySlugs.map(slug =>
//             Product.find({ categories: { $in: [productCategories.find(c => c.slug === slug)._id] } })
//                 .limit(10)
//                 .sort({ createdAt: -1 })
//         );

//         // "All Products" সেকশন যোগ করুন
//         productSectionsPromises.push(
//             Product.find({}).limit(10).sort({ createdAt: -1 })
//         );

//         const productSectionsResults = await Promise.all(productSectionsPromises);

//         const productSections = topCategorySlugs.map((slug, index) => ({
//             title: productCategories.find(c => c.slug === slug).name,
//             slug: slug,
//             products: productSectionsResults[index]
//         }));
        
//         // "All Products" সেকশনটি শেষে যোগ করুন
//         productSections.push({
//             title: "All Products",
//             slug: "all-products",
//             products: productSectionsResults[productSectionsResults.length - 1]
//         });

//         res.status(200).json({
//             banners,
//             pageCategories,
//             productSections
//         });

//     } catch (error) {
//         res.status(500);
//         throw new Error('Could not fetch homepage data');
//     }
// });



import Product from '../models/Product.js';
import Category from '../models/CategoryModel.js';
import Banner from '../models/bannerModel.js';
import PageCategory from '../models/pageCategoryModel.js';
import sharp from 'sharp';
import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinaryConfig.js';

// Helper function to upload image buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, prefix) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `e-commerce/${folder}`,
                public_id: `${prefix}-${Date.now()}`,
                format: 'webp',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' }
                ]
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id,
                    });
                }
            }
        );

        sharp(buffer).resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true }).toFormat("webp", { quality: 85 }).pipe(uploadStream);
    });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.error(`Cloudinary: Could not delete file at ${public_id}`, error.message);
    }
};

// @desc    Create a new product (Admin only)
export const createProduct = asyncHandler(async (req, res) => {
    if (!req.files || !req.files['image']) {
        res.status(400);
        throw new Error('Main product image is required.');
    }

    const mainImageUpload = await uploadToCloudinary(req.files['image'][0].buffer, 'products', 'product');

    let galleryImagesUploads = [];
    if (req.files['productImages']) {
        galleryImagesUploads = await Promise.all(
            req.files['productImages'].map((file) => uploadToCloudinary(file.buffer, 'products', 'gallery'))
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
        image: mainImageUpload.url,
        imagePublicId: mainImageUpload.public_id,
        productImages: galleryImagesUploads.map(img => img.url),
        productImagesPublicIds: galleryImagesUploads.map(img => img.public_id),
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

    if (req.files && req.files['image']) {
        if (product.imagePublicId) {
            await deleteFromCloudinary(product.imagePublicId);
        }
        const mainImageUpload = await uploadToCloudinary(req.files['image'][0].buffer, 'products', 'product');
        product.image = mainImageUpload.url;
        product.imagePublicId = mainImageUpload.public_id;
    }

    if (req.files && req.files['productImages']) {
        if (product.productImagesPublicIds && product.productImagesPublicIds.length > 0) {
            await cloudinary.api.delete_resources(product.productImagesPublicIds);
        }
        const galleryImagesUploads = await Promise.all(
            req.files['productImages'].map((file) => uploadToCloudinary(file.buffer, 'products', 'gallery'))
        );
        product.productImages = galleryImagesUploads.map(img => img.url);
        product.productImagesPublicIds = galleryImagesUploads.map(img => img.public_id);
    }

    const {
        name, brand, description, regularPrice, discountPrice, countInStock,
        pageCategory, categories, tags: tagsJson, sizes: sizesJson, rating, numReviews
    } = req.body;
    
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
        if (product.imagePublicId) {
            await deleteFromCloudinary(product.imagePublicId);
        }
        if (product.productImagesPublicIds && product.productImagesPublicIds.length > 0) {
            await cloudinary.api.delete_resources(product.productImagesPublicIds);
        }

        await product.deleteOne();
        res.status(200).json({ message: 'Product and associated images removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Fetch all products with filtering and pagination
export const getProducts = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const { category: categorySlug, pageCategory, search } = req.query;
    
    const filter = {};

    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }

    if (categorySlug) {
        const category = await Category.findOne({ slug: categorySlug });
        if (category) {
            filter.categories = { $in: [category._id] };
        } else {
            return res.json({ 
                products: [], 
                page: 1, 
                pages: 0, 
                total: 0,
            });
        }
    }

    if (pageCategory && pageCategory.toLowerCase() !== 'all-products') {
        filter.pageCategory = {
            $regex: new RegExp(`^${pageCategory}$`, 'i')
        };
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .populate('categories', 'name slug')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(limit * (page - 1));

    res.json({
        products,
        page,
        pages: Math.ceil(count / limit),
        total: count,
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

// @desc    Get all data needed for the homepage in a single request
// @route   GET /api/products/homepage-data
// @access  Public
export const getHomepageData = asyncHandler(async (req, res) => {
    try {
        const [rawBanners, pageCategories, productCategories] = await Promise.all([
            Banner.find({}).sort({ createdAt: -1 }),
            PageCategory.find({}).sort({ name: 1 }),
            Category.aggregate([
                { $lookup: { from: 'products', localField: '_id', foreignField: 'categories', as: 'products' } },
                { $project: { _id: 1, name: 1, slug: 1, productCount: { $size: '$products' } } },
                { $match: { productCount: { $gt: 0 } } },
                { $sort: { name: 1 } }
            ])
        ]);

        // প্রতিটি ব্যানারের জন্য ছবির সম্পূর্ণ URL তৈরি করা হচ্ছে
        const banners = rawBanners.map(banner => ({
            ...banner.toObject(),
            image: cloudinary.url(banner.imagePublicId, {
                fetch_format: "auto",
                quality: "auto"
            })
        }));

        const topCategorySlugs = productCategories.slice(0, 3).map(c => c.slug);
        const productSectionsPromises = topCategorySlugs.map(slug => {
            const categoryForSlug = productCategories.find(c => c.slug === slug);
            return Product.find({ categories: { $in: [categoryForSlug._id] } })
                .limit(10).sort({ createdAt: -1 });
        });
        productSectionsPromises.push(Product.find({}).limit(10).sort({ createdAt: -1 }));
        
        const productSectionsResults = await Promise.all(productSectionsPromises);
        
        const productSections = topCategorySlugs.map((slug, index) => {
            const categoryForSlug = productCategories.find(c => c.slug === slug);
            return {
                title: categoryForSlug.name,
                slug: slug,
                products: productSectionsResults[index]
            };
        });
        productSections.push({
            title: "All Products",
            slug: "all-products",
            products: productSectionsResults[productSectionsResults.length - 1]
        });

        res.status(200).json({
            banners,
            pageCategories,
            productSections
        });

    } catch (error) {
        res.status(500);
        throw new Error('Could not fetch homepage data');
    }
});