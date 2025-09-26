import express from 'express';
const router = express.Router();
import { 
    getUsers, 
    deleteUser, 
    getAllOrders, 
    updateUserByAdmin,
    unbanAllUsers,
    updateOrderStatus,
    getAdminStats // ✅ ড্যাশবোর্ডের জন্য নতুন ফাংশন ইম্পোর্ট করা হয়েছে
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// --- Dashboard Route ---
// GET /api/admin/stats -> ড্যাশবোর্ডের পরিসংখ্যান দেখুন
router.route('/stats')
    .get(protect, admin, getAdminStats);

// --- User Management Routes ---
// GET /api/admin/users -> সব ইউজারদের তালিকা দেখুন
router.route('/users')
    .get(protect, admin, getUsers);

// PUT /api/admin/users/unban-all -> সকল ব্যানড ইউজারকে আনব্যান করুন
router.route('/users/unban-all')
    .put(protect, admin, unbanAllUsers);

// Routes for a specific user by ID
router.route('/users/:id')
    // PUT /api/admin/users/:id -> নির্দিষ্ট ইউজারকে আপডেট করুন (ban/unban)
    .put(protect, admin, updateUserByAdmin)
    // DELETE /api/admin/users/:id -> নির্দিষ্ট ইউজারকে ডিলিট করুন
    .delete(protect, admin, deleteUser);

// --- Order Management Routes ---
// GET /api/admin/orders -> সব অর্ডারের তালিকা দেখুন
router.route('/orders')
    .get(protect, admin, getAllOrders);

// PUT /api/admin/orders/:id/status -> নির্দিষ্ট অর্ডারের স্ট্যাটাস পরিবর্তন করুন
router.route('/orders/:id/status')
    .put(protect, admin, updateOrderStatus);

export default router;