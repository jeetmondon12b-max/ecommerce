// import mongoose from "mongoose";

// const reviewSchema = mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
//     name: { type: String, required: true },
//     rating: { type: Number, required: true },
//     comment: { type: String, required: true },
// }, { timestamps: true });

// const productSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
//     name: { type: String, required: true, trim: true },
//     image: { type: String, required: true },
//     productImages: [{ type: String }],
//     brand: { type: String },
//     description: { type: String, required: true },
//     reviews: [reviewSchema],
//     rating: { type: Number, required: true, default: 0 },
//     numReviews: { type: Number, required: true, default: 0 },
//     regularPrice: { type: Number, required: true, default: 0 },
//     discountPrice: { type: Number },
//     discountPercentage: { type: Number, default: 0 },
//     countInStock: { type: Number, required: true, default: 0 },

//     // ✅✅✅ এই ফিল্ডটি আবার যোগ করা হয়েছে ✅✅✅
//     // এটি 'Men', 'Women', 'Shoes' ইত্যাদি সেভ করার জন্য জরুরি
//     pageCategory: {
//         type: String,
//         required: true,
//     },

//     // 'Hot Deals', 'big offer' ইত্যাদি সেভ করার জন্য এই ফিল্ডটি ঠিক আছে
//     categories: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Category'
//     }],
    
//     sizes: {
//         standard: {
//             type: [String],
//             default: [],
//         },
//         custom: [
//             {
//                 _id: false,
//                 type: { type: String, required: true },
//                 values: { type: [String], required: true },
//             }
//         ]
//     },
// }, { timestamps: true });

// const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// export default Product;

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

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;