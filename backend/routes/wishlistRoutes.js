import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    addToWishlist,
    getMyWishlist,
    removeFromWishlist,
    getWishlistSummary
} from '../controllers/wishlistController.js';

const router = express.Router();

// ইউজার তার নিজের Wishlist-এ প্রোডাক্ট যোগ করবে
router.route('/')
    .post(protect, addToWishlist);

// ইউজার তার নিজের Wishlist দেখবে
router.route('/mywishlist')
    .get(protect, getMyWishlist);

// অ্যাডমিন Wishlist-এর সারাংশ দেখবে
router.route('/summary')
    .get(protect, admin, getWishlistSummary);

// ইউজার তার Wishlist থেকে একটি প্রোডাক্ট বাদ দেবে
router.route('/:productId')
    .delete(protect, removeFromWishlist);

export default router;