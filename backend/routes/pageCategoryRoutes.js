import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    getAllPageCategories,
    createPageCategory,
    updatePageCategory,
    deletePageCategory
} from '../controllers/pageCategoryController.js';
import multer from 'multer';

const router = express.Router();

// ছবি আপলোড হ্যান্ডেল করার জন্য Multer কনফিগারেশন
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// পাবলিক রুট: যে কেউ ক্যাটাগরি দেখতে পারবে
router.route('/').get(getAllPageCategories);

// অ্যাডমিন রুট: শুধুমাত্র অ্যাডমিন ক্যাটাগরি তৈরি করতে পারবে
router.route('/').post(protect, admin, upload.single('image'), createPageCategory);

// অ্যাডমিন রুট: শুধুমাত্র অ্যাডমিন ক্যাটাগরি আপডেট বা ডিলিট করতে পারবে
router.route('/:id')
    .put(protect, admin, upload.single('image'), updatePageCategory)
    .delete(protect, admin, deletePageCategory);

export default router;