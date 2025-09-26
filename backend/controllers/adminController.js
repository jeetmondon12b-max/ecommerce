// import asyncHandler from 'express-async-handler';
// import User from '../models/User.js';
// import Order from '../models/Ordermodels.js';
// import mongoose from 'mongoose';

// // @desc    Get all users with filtering and search (Admin only)
// const getUsers = asyncHandler(async (req, res) => {
//     // ✅ সমস্যাটি এই লাইনে ছিল, এখন এটি ঠিক করা হয়েছে
//     const { search, filter } = req.query;
//     let query = {};

//     if (filter === 'banned') {
//         query.isActive = false;
//     }
//     // Check if the search term is a valid MongoDB ObjectId
//     if (search && mongoose.Types.ObjectId.isValid(search)) {
//         query._id = search;
//     } else if (search) {
//         // If it's not a valid ID, you might want to search by name or email
//         // This part can be expanded later if needed
//     }

//     const users = await User.find(query).sort({ createdAt: -1 });
//     res.status(200).json(users);
// });

// // @desc    Unban all users (Admin only)
// const unbanAllUsers = asyncHandler(async (req, res) => {
//     await User.updateMany({ isActive: false, role: 'user' }, { $set: { isActive: true } });
//     res.status(200).json({ message: 'All banned users have been unbanned.' });
// });

// // @desc    Update a user's details by Admin
// const updateUserByAdmin = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.params.id);

//     if (user) {
//         user.name = req.body.name || user.name;
//         if (req.body.isActive !== undefined) {
//             user.isActive = Boolean(req.body.isActive);
//         }
//         const updatedUser = await user.save();
//         res.status(200).json(updatedUser);
//     } else {
//         res.status(404);
//         throw new Error('User not found');
//     }
// });

// // @desc    Delete a user (Admin only)
// const deleteUser = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (user) {
//         if (user.role === 'admin') {
//             res.status(400);
//             throw new Error('Cannot delete an admin user');
//         }
//         await User.deleteOne({ _id: user._id });
//         res.status(200).json({ message: 'User removed successfully' });
//     } else {
//         res.status(404);
//         throw new Error('User not found');
//     }
// });

// // @desc    Get all orders with search by ID (Admin only)
// const getAllOrders = asyncHandler(async (req, res) => {
//     const { search } = req.query;
//     let query = {};

//     if (search && mongoose.Types.ObjectId.isValid(search)) {
//         query._id = search;
//     }

//     const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 });
//     res.status(200).json(orders);
// });

// // @desc    Update order status (Admin only)
// const updateOrderStatus = asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id);

//     if (order) {
//         order.orderStatus = req.body.status || order.orderStatus;
//         const updatedOrder = await order.save();
//         res.json(updatedOrder);
//     } else {
//         res.status(404);
//         throw new Error('Order not found');
//     }
// });

// export { 
//     getUsers, 
//     updateUserByAdmin, 
//     deleteUser, 
//     getAllOrders, 
//     unbanAllUsers,
//     updateOrderStatus
// };

import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Order from '../models/Ordermodels.js';
import Product from '../models/Product.js'; // ✅ নতুন Product মডেল import করা হয়েছে
import mongoose from 'mongoose';

// @desc    Get all users with filtering and search (Admin only)
const getUsers = asyncHandler(async (req, res) => {
    const { search, filter } = req.query;
    let query = {};

    if (filter === 'banned') {
        query.isActive = false;
    }
    if (search && mongoose.Types.ObjectId.isValid(search)) {
        query._id = search;
    } else if (search) {
        // You can expand search logic here for name/email if needed
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json(users);
});

// @desc    Unban all users (Admin only)
const unbanAllUsers = asyncHandler(async (req, res) => {
    await User.updateMany({ isActive: false, role: 'user' }, { $set: { isActive: true } });
    res.status(200).json({ message: 'All banned users have been unbanned.' });
});

// @desc    Update a user's details by Admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        if (req.body.isActive !== undefined) {
            user.isActive = Boolean(req.body.isActive);
        }
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Delete a user (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete an admin user');
        }
        await User.deleteOne({ _id: user._id });
        res.status(200).json({ message: 'User removed successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all orders with search by ID (Admin only)
const getAllOrders = asyncHandler(async (req, res) => {
    const { search } = req.query;
    let query = {};

    if (search && mongoose.Types.ObjectId.isValid(search)) {
        query._id = search;
    }

    const orders = await Order.find(query).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(orders);
});

// @desc    Update order status (Admin only)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.orderStatus = req.body.status || order.orderStatus;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// ✅ নতুন ফাংশনটি এখানে যোগ করা হয়েছে
// @desc    Get admin dashboard stats (total users, products, orders)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    try {
        const [totalUsers, totalProducts, totalOrders] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments()
        ]);

        res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders
        });

    } catch (error) {
        res.status(500);
        throw new Error('Could not fetch admin statistics');
    }
});


export {
    getUsers,
    updateUserByAdmin,
    deleteUser,
    getAllOrders,
    unbanAllUsers,
    updateOrderStatus,
    getAdminStats // ✅ নতুন ফাংশনটিকে export করা হয়েছে
};