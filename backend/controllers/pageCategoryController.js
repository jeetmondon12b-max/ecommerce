import PageCategory from '../models/pageCategoryModel.js';
import asyncHandler from 'express-async-handler';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import safeUnlink from '../utils/safeUnlink.js'; // Ensure you have created this helper file

// ✅ Helper to ensure uploads directory exists and returns a consistent path
const getUploadsDir = async () => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    return uploadsDir;
};

// Image processing helper function
const processImage = async (fileBuffer) => {
    const uploadsDir = await getUploadsDir();
    const newFilename = `page-cat-${Date.now()}-${Math.floor(Math.random() * 1000)}.webp`;
    const outputPath = path.join(uploadsDir, newFilename);

    await sharp(fileBuffer)
        .resize({ width: 400, height: 400, fit: 'cover' })
        .toFormat("webp", { quality: 90 })
        .toFile(outputPath);
        
    return `/uploads/${newFilename}`;
};

// @desc    Get all page categories
// @route   GET /api/page-categories
export const getAllPageCategories = asyncHandler(async (req, res) => {
    const categories = await PageCategory.find({}).sort({ name: 1 });
    res.status(200).json({ pageCategories: categories });
});

// @desc    Create a new page category
// @route   POST /api/page-categories
export const createPageCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400);
        throw new Error('Name is required.');
    }
    if (!req.file) {
        res.status(400);
        throw new Error('Image is required.');
    }

    const imagePath = await processImage(req.file.buffer);

    const category = await PageCategory.create({ name, image: imagePath });
    res.status(201).json(category);
});

// @desc    Update a page category
// @route   PUT /api/page-categories/:id
export const updatePageCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await PageCategory.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found.');
    }

    category.name = name || category.name;

    if (req.file) {
        // ✅ Use the safeUnlink helper to delete the old image
        await safeUnlink(category.image);
        category.image = await processImage(req.file.buffer);
    }

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
});

// @desc    Delete a page category
// @route   DELETE /api/page-categories/:id
export const deletePageCategory = asyncHandler(async (req, res) => {
    const category = await PageCategory.findById(req.params.id);

    if (category) {
        // ✅ Use the safeUnlink helper to delete the image
        await safeUnlink(category.image);
        
        await category.deleteOne();
        res.status(200).json({ message: 'Category removed successfully.' });
    } else {
        res.status(404);
        throw new Error('Category not found.');
    }
});