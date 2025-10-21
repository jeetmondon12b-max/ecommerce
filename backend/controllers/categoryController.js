import asyncHandler from 'express-async-handler';
import Category from '../models/CategoryModel.js';
import Product from '../models/Product.js';

/**
 * @desc    Fetch all categories with their product count
 * @route   GET /api/categories
 * @access  Public
 */
export const getAllCategories = asyncHandler(async (req, res) => {
    // ✅ পরিবর্তন: প্রতিটি ক্যাটাগরির সাথে প্রোডাক্ট সংখ্যা যুক্ত করার জন্য অ্যাগ্রিগেশন পাইপলাইন
    const categoriesWithCount = await Category.aggregate([
        {
            // 'products' collection এর সাথে join করা হচ্ছে
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'categories',
                as: 'products'
            }
        },
        {
            // প্রয়োজনীয় ফিল্ডগুলো সিলেক্ট করা হচ্ছে এবং প্রোডাক্ট সংখ্যা গণনা করা হচ্ছে
            $project: {
                _id: 1,
                name: 1,
                slug: 1,
                productCount: { $size: '$products' }
            }
        },
        {
            // নাম অনুযায়ী সাজানো হচ্ছে
            $sort: { name: 1 }
        }
    ]);

    res.status(200).json(categoriesWithCount);
});


/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        res.status(400);
        throw new Error('Category name is required.');
    }

    const categoryExists = await Category.findOne({ name: new RegExp('^' + name + '$', 'i') });

    if (categoryExists) {
        res.status(400);
        throw new Error('A category with this name already exists.');
    }

    const category = await Category.create({ name });

    res.status(201).json(category);
});

/**
 * @desc    Update a category by ID
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
        category.name = name;
        const updatedCategory = await category.save();
        res.status(200).json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Category not found.');
    }
});

/**
 * @desc    Delete a category by ID
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        // ডিলিট করার আগে, সব প্রোডাক্ট থেকে এই ক্যাটাগরির ref काढून ফেলা হচ্ছে
        await Product.updateMany(
            { categories: category._id },
            { $pull: { categories: category._id } }
        );

        await category.deleteOne();
        res.status(200).json({ message: 'Category removed successfully.' });
    } else {
        res.status(404);
        throw new Error('Category not found.');
    }
});