// import express from 'express';
// import { protect, admin } from '../middleware/authMiddleware.js';
// import { 
//     getAllBanners, 
//     createBanner, 
//     deleteBanner 
// } from '../controllers/bannerController.js';
// import multer from 'multer';

// const router = express.Router();

// // ছবি আপলোড হ্যান্ডেল করার জন্য Multer কনফিগারেশন
// const upload = multer({ 
//     storage: multer.memoryStorage(),
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// // GET /api/banners -> যে কেউ ব্যানার দেখতে পারবে
// // POST /api/banners -> শুধুমাত্র অ্যাডমিন নতুন ব্যানার তৈরি করতে পারবে
// router.route('/')
//     .get(getAllBanners)
//     .post(protect, admin, upload.single('image'), createBanner);

// // DELETE /api/banners/:id -> শুধুমাত্র অ্যাডমিন ব্যানার ডিলিট করতে পারবে
// router.route('/:id')
//     .delete(protect, admin, deleteBanner);

// export default router;



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

// GET /api/banners -> যে কেউ ব্যানার দেখতে পারবে
// POST /api/banners -> শুধুমাত্র অ্যাডমিন নতুন ব্যানার তৈরি করতে পারবে
router.route('/')
    .get(getAllBanners)
    .post(protect, admin, upload.single('image'), createBanner);

// DELETE /api/banners/:id -> শুধুমাত্র অ্যাডমিন ব্যানার ডিলিট করতে পারবে
router.route('/:id')
    .delete(protect, admin, deleteBanner);

export default router;