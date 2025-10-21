import Banner from '../models/bannerModel.js';
import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinaryConfig.js';

// ফ্রন্টএন্ড থেকে আসা ক্রপ করা ছবিটি Cloudinary-তে আপলোড করার ফাংশন
const uploadBannerToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'e-commerce/banners', // Cloudinary-তে এই ফোল্ডারে সেভ হবে
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({ public_id: result.public_id });
            }
        );
        uploadStream.end(buffer);
    });
};


// @desc    Get all banners with full image URLs
// @route   GET /api/banners
export const getAllBanners = asyncHandler(async (req, res) => {
    const bannersFromDB = await Banner.find({}).sort({ createdAt: -1 });

    // প্রতিটি ব্যানারের জন্য ছবির সম্পূর্ণ URL তৈরি করা
    const banners = bannersFromDB.map(banner => {
        const imageUrl = cloudinary.url(banner.imagePublicId, {
            fetch_format: 'auto',
            quality: 'auto'
        });
        return { 
            ...banner.toObject(), 
            image: imageUrl 
        };
    });
    
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

    // ফ্রন্টএন্ড থেকে আসা ক্রপ করা ছবিটি আপলোড করা হচ্ছে
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

    // Cloudinary থেকে ছবিটি ডিলেট করা হচ্ছে
    await cloudinary.uploader.destroy(banner.imagePublicId);
    
    // ডাটাবেস থেকে ব্যানার ডিলেট করা হচ্ছে
    await banner.deleteOne();
    
    res.status(200).json({ message: 'Banner removed successfully.' });
});