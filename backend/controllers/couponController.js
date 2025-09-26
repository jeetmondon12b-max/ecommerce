import Coupon from "../models/Coupon.js";
import asyncHandler from 'express-async-handler';

// @desc    Create a new coupon (Admin only)
// ... আপনার createCoupon ফাংশন অপরিবর্তিত থাকবে ...
export const createCoupon = asyncHandler(async (req, res) => {
    const { code, discount, minimumAmount, expiresAt, usageLimit } = req.body;
    
    if (!code || !discount || !minimumAmount || !expiresAt || !usageLimit) {
        res.status(400);
        throw new Error("Please fill all required fields.");
    }
    
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
        res.status(400);
        throw new Error('This coupon code already exists.');
    }
    
    const newCoupon = new Coupon({ code, discount, minimumAmount, expiresAt, usageLimit });
    await newCoupon.save();
    res.status(201).json({ message: "✅ Coupon created successfully!", coupon: newCoupon });
});

// @desc    Get all active coupons (Admin only)
// ... আপনার getCoupons ফাংশন অপরিবর্তিত থাকবে ...
export const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({ expiresAt: { $gte: new Date() } })
                                  .sort({ createdAt: -1 });
    res.status(200).json(coupons);
});

// ✅ নতুন ফাংশন: একটি কুপন ডিলেট করার জন্য
// @desc    Delete a coupon (Admin only)
// @route   DELETE /api/coupons/:id
export const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await coupon.deleteOne();
        res.json({ message: 'Coupon removed successfully' });
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

// @desc    Validate a coupon (Public)
// ... আপনার validateCoupon ফাংশন অপরিবর্তিত থাকবে ...
export const validateCoupon = asyncHandler(async (req, res) => {
    const { code, cartTotal } = req.body;

    if (!code || cartTotal === undefined) {
        res.status(400);
        throw new Error("Coupon code and cart total are required.");
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
        res.status(404);
        throw new Error('Invalid coupon code.');
    }
    if (coupon.expiresAt < new Date()) {
        res.status(400);
        throw new Error('This coupon has expired.');
    }
    if (coupon.timesUsed >= coupon.usageLimit) {
        res.status(400);
        throw new Error('This coupon has reached its usage limit.');
    }
    if (cartTotal < coupon.minimumAmount) {
        res.status(400);
        throw new Error(`Minimum purchase of ৳${coupon.minimumAmount} is required.`);
    }

    res.status(200).json({ valid: true, message: "Coupon applied!", discount: coupon.discount });
});