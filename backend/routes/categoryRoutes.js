import express from 'express';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Public Route ---
// যে কেউ সব ক্যাটাগরি দেখতে পারবে
router.route('/')
    .get(getAllCategories)
    // --- Admin Only Route ---
    // শুধুমাত্র অ্যাডমিন নতুন ক্যাটাগরি তৈরি করতে পারবে
    .post(protect, admin, createCategory);


// --- Admin Only Routes ---
// শুধুমাত্র অ্যাডমিন ক্যাটাগরি আপডেট বা ডিলিট করতে পারবে
router.route('/:id')
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);

export default router;