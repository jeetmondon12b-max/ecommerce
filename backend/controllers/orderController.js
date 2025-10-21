
// import Order from '../models/Ordermodels.js'; // ✅ সমাধান: ভুল নাম 'Ordermodels.js' কে সঠিক নাম 'orderModel.js' করা হয়েছে
// import Coupon from '../models/Coupon.js';
// import Product from '../models/Product.js';
// import asyncHandler from 'express-async-handler';

// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Private (User)
// export const createOrder = asyncHandler(async (req, res) => {
//     const orderDetails = { ...req.body, user: req.user._id };
//     const newOrder = new Order(orderDetails);
//     const savedOrder = await newOrder.save();

//     // If a coupon was used, update its usage count
//     if (orderDetails.paymentInfo && orderDetails.paymentInfo.couponCode) {
//         const couponCode = orderDetails.paymentInfo.couponCode;
//         await Coupon.updateOne(
//             { code: couponCode },
//             { $inc: { timesUsed: 1 } }
//         );
//     }

//     // Logic to update product stock
//     if (savedOrder) {
//         // Decrease stock for each item in the order
//         for (const item of savedOrder.orderItems) {
//             const product = await Product.findById(item.product);
//             if (product) {
//                 product.countInStock -= item.quantity;
//                 await product.save();
//             }
//         }
//     }
    
//     res.status(201).json(savedOrder);
// });

// // @desc    Get logged in user's orders
// // @route   GET /api/orders/myorders
// // @access  Private (User)
// export const getMyOrders = asyncHandler(async (req, res) => {
//     const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
//     res.status(200).json(orders);
// });

// // @desc    Get all orders (for Admin)
// // @route   GET /api/admin/orders
// // @access  Private/Admin
// export const getAllOrders = asyncHandler(async (req, res) => {
//     const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
//     res.status(200).json(orders);
// });

// // @desc    Get order by ID (for Admin)
// // @route   GET /api/admin/orders/:id
// // @access  Private/Admin
// export const getOrderById = asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id).populate('user', 'name email');

//     if (order) {
//         res.status(200).json(order);
//     } else {
//         res.status(404);
//         throw new Error('Order not found');
//     }
// });

// // @desc    Update order status (for Admin)
// // @route   PUT /api/admin/orders/:id/status
// // @access  Private/Admin
// export const updateOrderStatus = asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id);

//     if (order) {
//         const { status } = req.body;
//         const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
//         if (!validStatuses.includes(status)) {
//             res.status(400);
//             throw new Error('Invalid status');
//         }

//         order.orderStatus = status;
//         const updatedOrder = await order.save();
//         res.status(200).json(updatedOrder);
//     } else {
//         res.status(404);
//         throw new Error('Order not found');
//     }
// });

// // @desc    Cancel an order (by user)
// // @route   PUT /api/orders/:id/cancel
// // @access  Private (User)
// export const cancelMyOrder = asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//         res.status(404);
//         throw new Error('Order not found');
//     }

//     if (order.user.toString() !== req.user._id.toString()) {
//         res.status(401);
//         throw new Error('Not authorized to perform this action');
//     }

//     if (order.orderStatus !== 'Pending') {
//         res.status(400);
//         throw new Error(`Order cannot be cancelled as it is already ${order.orderStatus}`);
//     }

//     order.orderStatus = 'Cancelled';
//     const updatedOrder = await order.save();
//     res.status(200).json(updatedOrder);
// });

import Order from '../models/Ordermodels.js'; // ✅ সমাধান: ভুল নামটি এখানে ঠিক করা হয়েছে
import Coupon from '../models/Coupon.js';
import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User)
export const createOrder = asyncHandler(async (req, res) => {
    const orderDetails = { ...req.body, user: req.user._id };
    const newOrder = new Order(orderDetails);
    const savedOrder = await newOrder.save();

    // If a coupon was used, update its usage count
    if (orderDetails.paymentInfo && orderDetails.paymentInfo.couponCode) {
        const couponCode = orderDetails.paymentInfo.couponCode;
        await Coupon.updateOne(
            { code: couponCode },
            { $inc: { timesUsed: 1 } }
        );
    }

    // Logic to update product stock
    if (savedOrder) {
        // Decrease stock for each item in the order
        for (const item of savedOrder.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock -= item.quantity;
                await product.save();
            }
        }
    }
    
    res.status(201).json(savedOrder);
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private (User)
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
});

// @desc    Get all orders (for Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(orders);
});

// @desc    Get order by ID (for Admin & User)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order status (for Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            res.status(400);
            throw new Error('Invalid status');
        }

        order.orderStatus = status;
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Cancel an order (by user)
// @route   PUT /api/orders/:id/cancel
// @access  Private (User)
export const cancelMyOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to perform this action');
    }

    if (order.orderStatus !== 'Pending') {
        res.status(400);
        throw new Error(`Order cannot be cancelled as it is already ${order.orderStatus}`);
    }

    order.orderStatus = 'Cancelled';
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
});