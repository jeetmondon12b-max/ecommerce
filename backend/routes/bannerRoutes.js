import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
    getAllBanners, 
    createBanner, 
    deleteBanner 
} from '../controllers/bannerController.js';
import multer from 'multer';

const router = express.Router();

// ছবি আপলোড হ্যান্ডেল করার জন্য Multer কনফিগারেশন
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET /api/banners -> সব ব্যানার দেখাবে
// POST /api/banners -> নতুন ব্যানার তৈরি করবে (শুধুমাত্র অ্যাডমিন)
router.route('/')
    .get(getAllBanners)
    .post(protect, admin, upload.single('image'), createBanner);

// DELETE /api/banners/:id -> নির্দিষ্ট ব্যানার ডিলেট করবে (শুধুমাত্র অ্যাডমিন)
router.route('/:id')
    .delete(protect, admin, deleteBanner);

export default router;