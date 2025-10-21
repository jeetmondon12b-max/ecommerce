import express from "express";
// ✅ deleteCoupon ইম্পোর্ট করুন
import { createCoupon, validateCoupon, getCoupons, deleteCoupon } from "../controllers/couponController.js";
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/coupons - সকল কুপনের তালিকা পাওয়ার রুট
router.get("/", protect, admin, getCoupons);

// POST /api/coupons - নতুন কুপন তৈরির রুট
router.post("/", protect, admin, createCoupon);

// POST /api/coupons/validate - কুপন যাচাই করার রুট
router.post("/validate", validateCoupon);

// ✅ DELETE /api/coupons/:id - একটি কুপন ডিলেট করার রুট
router.delete("/:id", protect, admin, deleteCoupon);

export default router;