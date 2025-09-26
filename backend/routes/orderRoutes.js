import express from 'express';
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById, // ✅ নতুন কন্ট্রোলার ফাংশন ইম্পোর্ট করুন
    updateOrderStatus,
    cancelMyOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/*--- User-specific Routes ---*/
// একজন ইউজার নতুন অর্ডার তৈরি করবে
router.post('/', protect, createOrder);

// একজন ইউজার তার নিজের সব অর্ডার দেখবে
router.get('/myorders', protect, getMyOrders);

// একজন ইউজার তার নিজের 'Pending' অর্ডার বাতিল করবে
router.put('/:id/cancel', protect, cancelMyOrder);


/*--- Admin-only Routes ---*/
// অ্যাডমিন সব ইউজারের অর্ডার দেখবে
router.get('/', protect, admin, getAllOrders);

// ✅ অ্যাডমিন একটি নির্দিষ্ট অর্ডারের বিস্তারিত তথ্য দেখবে
router.get('/:id', protect, admin, getOrderById);

// অ্যাডমিন যেকোনো অর্ডারের স্ট্যাটাস পরিবর্তন করবে
router.put('/:id/status', protect, admin, updateOrderStatus);


export default router;