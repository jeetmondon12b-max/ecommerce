// import mongoose from 'mongoose';

// const pageCategorySchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: [true, 'Category name is required.'],
//             unique: true,
//             trim: true,
//         },
//         image: {
//             type: String,
//             required: [true, 'Category image is required.'],
//         },
//     },
//     { timestamps: true }
// );

// const PageCategory = mongoose.models.PageCategory || mongoose.model('PageCategory', pageCategorySchema);

// export default PageCategory;

import mongoose from 'mongoose';

const pageCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required.'],
            unique: true,
            trim: true,
        },
        // ✅ সমাধান: 'image' এর পরিবর্তে 'imagePublicId' ব্যবহার করা হচ্ছে
        imagePublicId: {
            type: String,
            required: [true, 'Category image is required.'],
        },
    },
    { timestamps: true }
);

const PageCategory = mongoose.models.PageCategory || mongoose.model('PageCategory', pageCategorySchema);

export default PageCategory;