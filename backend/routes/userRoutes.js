import express from 'express';
const router = express.Router();
import { 
    getUserProfile, 
    updateUserProfile, 
    getAllUsers, 
    updateUserByAdmin,
    unbanAllUsers,
    deleteUserByAdmin // ✅ ডিলিট কন্ট্রোলার ইম্পোর্ট করুন
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// GET all users (admin)
router.route('/').get(protect, admin, getAllUsers);

// PUT unban all users (admin)
router.route('/unban-all').put(protect, admin, unbanAllUsers);

// GET/PUT user profile (user's own)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// PUT and DELETE user by ID (admin)
router.route('/:id')
    .put(protect, admin, updateUserByAdmin)
    .delete(protect, admin, deleteUserByAdmin); // ✅ নতুন ডিলিট রুট যোগ করুন

export default router;