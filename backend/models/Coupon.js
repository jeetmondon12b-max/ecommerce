import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    discount: { type: Number, required: true },
    minimumAmount: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    usageLimit: { type: Number, required: true },
    timesUsed: { type: Number, default: 0 },
}, { timestamps: true });

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;