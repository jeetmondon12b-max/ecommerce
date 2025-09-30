// import Banner from '../models/bannerModel.js';
// import asyncHandler from 'express-async-handler';
// import sharp from 'sharp';
// import path from 'path';
// import fs from 'fs/promises';
// import safeUnlink from '../utils/safeUnlink.js'; // Make sure this import path is correct

// // Banner image processing function (wide ratio)
// const processBannerImage = async (fileBuffer) => {
//     const uploadsDir = path.join(process.cwd(), 'uploads');
//     await fs.mkdir(uploadsDir, { recursive: true });
    
//     const newFilename = `banner-${Date.now()}-${Math.floor(Math.random() * 1000)}.webp`;
//     const outputPath = path.join(uploadsDir, newFilename);

//     await sharp(fileBuffer)
//         .resize({ width: 1600, height: 600, fit: 'cover' })
//         .toFormat("webp", { quality: 85 })
//         .toFile(outputPath);
        
//     return `/uploads/${newFilename}`;
// };

// // @desc    Get all banners
// // @route   GET /api/banners
// export const getAllBanners = asyncHandler(async (req, res) => {
//     const banners = await Banner.find({}).sort({ createdAt: -1 });
//     res.status(200).json({ banners: banners });
// });

// // @desc    Create a new banner
// // @route   POST /api/banners
// export const createBanner = asyncHandler(async (req, res) => {
//     const { title, subtitle, link } = req.body;
    
//     // ✅ Only the image is now required
//     if (!req.file) {
//         res.status(400);
//         throw new Error('Banner image is required.');
//     }

//     const imagePath = await processBannerImage(req.file.buffer);
//     const banner = await Banner.create({ title, subtitle, link, image: imagePath });
//     res.status(201).json(banner);
// });

// // @desc    Delete a banner
// // @route   DELETE /api/banners/:id
// export const deleteBanner = asyncHandler(async (req, res) => {
//     const banner = await Banner.findById(req.params.id);
//     if (banner) {
//         // Safely deleting the image from the server
//         await safeUnlink(banner.image);
//         await banner.deleteOne();
//         res.status(200).json({ message: 'Banner removed successfully.' });
//     } else {
//         res.status(404);
//         throw new Error('Banner not found.');
//     }
// });


import Banner from '../models/bannerModel.js';
import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinaryConfig.js'; // ✅ আপনার cloudinaryConfig ইম্পোর্ট করুন
import sharp from 'sharp';

// Helper function to upload banner image buffer to Cloudinary
const uploadBannerToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'e-commerce/banners',
                public_id: `banner-${Date.now()}`,
                format: 'webp',
                transformation: [
                    { width: 1600, height: 600, crop: 'fill', gravity: 'auto' }
                ]
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id,
                    });
                }
            }
        );

        sharp(buffer)
          .resize({ width: 1600, height: 600, fit: 'cover' })
          .toFormat("webp", { quality: 80 })
          .pipe(uploadStream);
    });
};

// @desc    Get all banners
// @route   GET /api/banners
export const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({}).sort({ createdAt: -1 });
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

  // Cloudinary-তে ছবি আপলোড
  const uploadResult = await uploadBannerToCloudinary(req.file.buffer);

  const banner = await Banner.create({
    title,
    subtitle,
    link,
    image: uploadResult.url,
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

  // Cloudinary থেকে ছবি ডিলিট
  try {
    await cloudinary.uploader.destroy(banner.imagePublicId);
  } catch (err) {
    console.warn("Cloudinary delete error (non-critical):", err.message);
  }

  await banner.deleteOne();
  res.status(200).json({ message: 'Banner removed successfully.' });
});