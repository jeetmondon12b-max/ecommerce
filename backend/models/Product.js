
import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true, trim: true },
    
    // Cloudinary fields for the main image
    image: { type: String, required: true },
    imagePublicId: { type: String }, 
    
    // Cloudinary fields for gallery images
    productImages: [{ type: String }],
    productImagesPublicIds: [{ type: String }], 
    
    brand: { type: String },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    regularPrice: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number },
    discountPercentage: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    pageCategory: {
        type: String,
        required: true,
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    sizes: {
        standard: {
            type: [String],
            default: [],
        },
        custom: [
            {
                _id: false,
                type: { type: String, required: true },
                values: { type: [String], required: true },
            }
        ]
    },
}, { timestamps: true });

// ✅✅✅ ডাটাবেস ক্যোয়ারি দ্রুত করার জন্য ইনডেক্স যোগ করা হয়েছে ✅✅✅
// এই ইনডেক্সগুলো সার্চ এবং ফিল্টারিং অপারেশনকে অনেক দ্রুত করে তুলবে।
productSchema.index({ name: 'text' }); // নাম দিয়ে সার্চ করার জন্য।
productSchema.index({ pageCategory: 1 }); // পেজ ক্যাটাগরি দিয়ে ফিল্টার করার জন্য।
productSchema.index({ categories: 1 }); // প্রোডাক্ট ক্যাটাগরি দিয়ে ফিল্টার করার জন্য।
productSchema.index({ createdAt: -1 }); // নতুন প্রোডাক্টগুলো দ্রুত আনার জন্য।


const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;