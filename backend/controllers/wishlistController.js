import asyncHandler from 'express-async-handler';
import Wishlist from '../models/WishlistModel.js';
import Product from '../models/Product.js';

/**
 * @desc    Add a product to the logged-in user's wishlist
 * @route   POST /api/wishlist
 * @access  Private (User)
 */
export const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const alreadyExists = await Wishlist.findOne({ user: userId, product: productId });
    if (alreadyExists) {
        res.status(400);
        throw new Error('This product is already in your wishlist');
    }

    const wishlistItem = await Wishlist.create({
        user: userId,
        product: productId,
    });

    res.status(201).json(wishlistItem);
});

/**
 * @desc    Get the logged-in user's wishlist
 * @route   GET /api/wishlist/mywishlist
 * @access  Private (User)
 */
export const getMyWishlist = asyncHandler(async (req, res) => {
    const wishlistItems = await Wishlist.find({ user: req.user._id })
        .populate('product', 'name image regularPrice discountPrice')
        .sort({ createdAt: -1 });

    res.status(200).json(wishlistItems);
});

/**
 * @desc    Remove a product from the logged-in user's wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private (User)
 */
export const removeFromWishlist = asyncHandler(async (req, res) => {
    const deletedItem = await Wishlist.findOneAndDelete({
        user: req.user._id,
        product: req.params.productId
    });

    if (deletedItem) {
        res.json({ message: 'Product removed from wishlist' });
    } else {
        res.status(404);
        throw new Error('Item not found in your wishlist');
    }
});

/**
 * @desc    Get a summary of all wishlisted products for admin
 * @route   GET /api/wishlist/summary
 * @access  Private/Admin
 */
export const getWishlistSummary = asyncHandler(async (req, res) => {
    const summary = await Wishlist.aggregate([
        {
            $group: {
                _id: '$product',
                wishlistCount: { $sum: 1 },
            },
        },
        { $sort: { wishlistCount: -1 } },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'productDetails',
            },
        },
        { $unwind: '$productDetails' },
        {
            $project: {
                _id: 0,
                product: {
                    _id: '$productDetails._id',
                    name: '$productDetails.name',
                    image: '$productDetails.image',
                },
                wishlistCount: 1,
            },
        },
    ]);

    res.json(summary);
});