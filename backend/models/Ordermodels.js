import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    size: { type: String }, // For standard sizes
    // ✅ কাস্টম সাইজের জন্য নতুন ফিল্ড
    customSize: { 
        type: { type: String }, // e.g., 'Shoe Size'
        value: { type: String }  // e.g., '42'
    },
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Product' 
    }
});

const orderSchema = new mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true, 
            ref: 'User' 
        },
        customerInfo: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            street: { type: String, required: true },
        },
        orderItems: [orderItemSchema],
        paymentInfo: {
            method: { type: String, required: true },
            subtotal: { type: Number, required: true },
            shippingFee: { type: Number, required: true },
            discount: { type: Number, default: 0 },
            totalAmount: { type: Number, required: true },
            couponCode: { type: String, uppercase: true },
        },
        orderStatus: { 
            type: String, 
            required: true,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
    }, 
    { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;