// import Banner from '../models/bannerModel.js';
// import asyncHandler from 'express-async-handler';
// import cloudinary from '../config/cloudinaryConfig.js';

// // ✅ এই ফাংশনটি ঠিক আছে, কোনো পরিবর্তনের প্রয়োজন নেই
// const uploadBannerToCloudinary = (buffer) => {
//     return new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//             {
//                 folder: 'e-commerce/banners',
//                 responsive_breakpoints: {
//                     create_derived: true,
//                     breakpoints: [480, 800, 1200, 1600],
//                     format: "webp",
//                     transformation: { quality: 'auto' }
//                 }
//             },
//             (error, result) => {
//                 if (error) return reject(error);
//                 resolve({ public_id: result.public_id });
//             }
//         );
//         uploadStream.end(buffer);
//     });
// };


// // ✅ পরিবর্তন শুরু: এই ফাংশনটি আপডেট করা হয়েছে
// // @desc    Get all banners
// // @route   GET /api/banners
// export const getAllBanners = asyncHandler(async (req, res) => {
//     // 1. ডাটাবেজ থেকে ব্যানারগুলো আনা হচ্ছে
//     const bannersFromDB = await Banner.find({}).sort({ createdAt: -1 });

//     // 2. প্রতিটি ব্যানারের জন্য সম্পূর্ণ ইমেজ URL তৈরি করা হচ্ছে
//     const banners = bannersFromDB.map(banner => {
//         // Cloudinary URL তৈরি করা হচ্ছে f_auto, q_auto দিয়ে, যা সবচেয়ে অপটিমাইজড ইমেজ দেবে
//         const imageUrl = cloudinary.url(banner.imagePublicId, {
//             fetch_format: 'auto',
//             quality: 'auto'
//         });

//         // Mongoose ডকুমেন্টকে সাধারণ অবজেক্টে রূপান্তর করে নতুন 'image' প্রপার্টি যোগ করা হচ্ছে
//         return {
//             ...banner.toObject(),
//             image: imageUrl, 
//         };
//     });
    
//     // 3. নতুন 'image' URL সহ ব্যানারগুলো ফ্রন্টএন্ডে পাঠানো হচ্ছে
//     res.status(200).json({ banners });
// });
// // ✅ পরিবর্তন শেষ


// // @desc    Create a new banner
// // @route   POST /api/banners
// // ✅ এই ফাংশনটি ঠিক আছে, কোনো পরিবর্তনের প্রয়োজন নেই
// export const createBanner = asyncHandler(async (req, res) => {
//     const { title, subtitle, link } = req.body;

//     if (!req.file) {
//         res.status(400);
//         throw new Error('Banner image is required.');
//     }

//     const uploadResult = await uploadBannerToCloudinary(req.file.buffer);

//     const banner = await Banner.create({
//         title,
//         subtitle,
//         link,
//         imagePublicId: uploadResult.public_id,
//     });

//     res.status(201).json(banner);
// });

// // @desc    Delete a banner
// // @route   DELETE /api/banners/:id
// // ✅ এই ফাংশনটি ঠিক আছে, কোনো পরিবর্তনের প্রয়োজন নেই
// export const deleteBanner = asyncHandler(async (req, res) => {
//     const banner = await Banner.findById(req.params.id);
//     if (!banner) {
//         res.status(404);
//         throw new Error('Banner not found.');
//     }

//     try {
//         await cloudinary.uploader.destroy(banner.imagePublicId);
//     } catch (err) {
//         console.warn("Cloudinary delete error (non-critical):", err.message);
//     }

//     await banner.deleteOne();
//     res.status(200).json({ message: 'Banner removed successfully.' });
// });

import Banner from '../models/bannerModel.js';
import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinaryConfig.js';

// ✅ পরিবর্তন শুরু: Cloudinary আপলোড ফাংশনটি আপডেট করা হয়েছে
const uploadBannerToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'e-commerce/banners',
                // ✅ স্মার্ট ক্রপিং এবং রিসাইজিং-এর জন্য নতুন Transformation যোগ করা হয়েছে
                transformation: [
                    {
                        width: 1600,         // ছবির প্রস্থ ১৬০০ পিক্সেলে সীমাবদ্ধ করা হবে
                        aspect_ratio: '16:7', // ছবির অনুপাত ১৬:৭ এ সেট করা হবে
                        crop: 'fill',         // অতিরিক্ত অংশ ক্রপ করে কন্টেইনার ফিল করা হবে
                        gravity: 'auto'       // ছবির সবচেয়ে গুরুত্বপূর্ণ অংশ (যেমন মুখ) নিজে থেকেই খুঁজে নেওয়া হবে
                    }
                ]
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({ public_id: result.public_id });
            }
        );
        uploadStream.end(buffer);
    });
};
// ✅ পরিবর্তন শেষ


// @desc    Get all banners
// @route   GET /api/banners
export const getAllBanners = asyncHandler(async (req, res) => {
    // 1. ডাটাবেজ থেকে ব্যানারগুলো আনা হচ্ছে
    const bannersFromDB = await Banner.find({}).sort({ createdAt: -1 });

    // 2. প্রতিটি ব্যানারের জন্য সম্পূর্ণ ইমেজ URL তৈরি করা হচ্ছে
    const banners = bannersFromDB.map(banner => {
        // Cloudinary URL তৈরি করা হচ্ছে f_auto, q_auto দিয়ে, যা সবচেয়ে অপটিমাইজড ইমেজ দেবে
        const imageUrl = cloudinary.url(banner.imagePublicId, {
            fetch_format: 'auto',
            quality: 'auto'
        });

        // Mongoose ডকুমেন্টকে সাধারণ অবজেক্টে রূপান্তর করে নতুন 'image' প্রপার্টি যোগ করা হচ্ছে
        return {
            ...banner.toObject(),
            image: imageUrl, 
        };
    });
    
    // 3. নতুন 'image' URL সহ ব্যানারগুলো ফ্রন্টএন্ডে পাঠানো হচ্ছে
    res.status(200).json({ banners });
});


// @desc    Create a new banner
// @route   POST /api/banners
export const createBanner = asyncHandler(async (req, res) => {
    const { title, subtitle, link } = req.body;

    if (!req.file) {
        res.status(400);
        throw new Error('Banner image is required.');
    }

    const uploadResult = await uploadBannerToCloudinary(req.file.buffer);

    const banner = await Banner.create({
        title,
        subtitle,
        link,
        imagePublicId: uploadResult.public_id,
    });

    res.status(201).json(banner);
});

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
export const deleteBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
        res.status(404);
        throw new Error('Banner not found.');
    }

    try {
        await cloudinary.uploader.destroy(banner.imagePublicId);
    } catch (err) {
        console.warn("Cloudinary delete error (non-critical):", err.message);
    }

    await banner.deleteOne();
    res.status(200).json({ message: 'Banner removed successfully.' });
});