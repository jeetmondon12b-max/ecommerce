import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../apiConfig';
import { FiUser, FiPhone, FiMapPin, FiChevronDown, FiChevronUp, FiLoader } from 'react-icons/fi';
import LazyImage from "../components/LazyImage"; // ✅ LazyImage ইম্পোর্ট করা হয়েছে

const OrderSummary = React.memo(({ products, total, discount, shippingFee, couponCode }) => (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Order Summary</h2>
        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
            {products.map((item, index) => (
                <div key={item.cartId || index} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                            {/* ✅ ফিক্স: ছবির URL থেকে ${API_URL} সরানো হয়েছে এবং LazyImage ব্যবহার করা হয়েছে */}
                            <LazyImage 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover rounded-md"
                            />
                            <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                        </div>
                    </div>
                    <p className="font-medium">৳{(item.discountPrice || item.regularPrice) * item.quantity}</p>
                </div>
            ))}
        </div>
        <div className="border-t pt-4 space-y-2 text-gray-600">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{total - shippingFee + (discount || 0)}</span>
            </div>
            <div className="flex justify-between">
                <span>Shipping</span>
                <span>৳{shippingFee}</span>
            </div>
            {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({couponCode})</span>
                    <span>-৳{discount}</span>
                </div>
            )}
            <div className="flex justify-between font-bold text-xl border-t pt-2 mt-2 text-gray-800">
                <span>Total</span>
                <span className="text-indigo-600">৳{total}</span>
            </div>
        </div>
        <div className="border-t mt-6 pt-4">
            <h3 className="text-md font-semibold text-gray-800">Payment Method</h3>
            <p className="text-gray-600 mt-1">Cash on Delivery</p>
        </div>
    </div>
));

export default function ShippingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    const { products: items, total, discount, shippingFee, couponCode } = location.state || {};
    const productsToOrder = items || [];

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    
    const [form, setForm] = useState({
        fullName: userInfo?.shippingAddress?.fullName || userInfo?.name || "",
        phone: userInfo?.shippingAddress?.phoneNumber || "",
        street: userInfo?.shippingAddress?.address || "",
    });

    if (productsToOrder.length === 0) {
        return (
            <div className="min-h-[60vh] text-center flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-red-500 mb-4">No product data found.</h1>
                <Link to="/" className="text-indigo-600 font-semibold hover:underline">Go back to Homepage</Link>
            </div>
        );
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const orderDetails = {
            customerInfo: form,
            orderItems: productsToOrder.map(p => ({
                name: p.name, price: p.discountPrice || p.regularPrice, image: p.image, 
                quantity: p.quantity, brand: p.brand, size: p.size, 
                customSize: p.customSize, product: p._id
            })),
            paymentInfo: {
                method: 'Cash on Delivery',
                subtotal: productsToOrder.reduce((acc, item) => acc + ((item.discountPrice || item.regularPrice) * item.quantity), 0),
                shippingFee, discount, totalAmount: total, couponCode,
            },
        };

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const response = await axios.post(`${API_URL}/api/orders`, orderDetails, config);
            navigate("/order-success", { state: { orderDetails: response.data } });
        } catch (err) {
            setError(err.response?.data?.message || "Order submission failed.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-gray-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    
                    <div className="lg:hidden">
                        <div className="bg-white rounded-2xl shadow-lg border">
                            <button onClick={() => setIsSummaryOpen(!isSummaryOpen)} className="w-full p-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800">
                                    {isSummaryOpen ? 'Hide' : 'Show'} Order Summary
                                </span>
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-bold text-indigo-600">৳{total}</span>
                                    {isSummaryOpen ? <FiChevronUp /> : <FiChevronDown />}
                                </div>
                            </button>
                            {isSummaryOpen && (
                                <div className="p-4 border-t">
                                     <OrderSummary products={productsToOrder} total={total} discount={discount} shippingFee={shippingFee} couponCode={couponCode}/>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-3/5">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Address</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                                    <FiUser className="absolute left-3 top-10 text-gray-400" />
                                    <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"/>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                                    <FiPhone className="absolute left-3 top-10 text-gray-400" />
                                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"/>
                                </div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Address</label>
                                    <FiMapPin className="absolute left-3 top-10 text-gray-400" />
                                    <textarea name="street" value={form.street} onChange={handleChange} rows="3" required className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"></textarea>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center disabled:bg-indigo-400">
                                    {loading ? <FiLoader className="animate-spin mr-2"/> : null}
                                    {loading ? 'Processing...' : `Place Order (৳${total})`}
                                </button>
                                {error && <p className="text-center text-red-600 font-medium mt-3">❌ {error}</p>}
                            </form>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/5 hidden lg:block">
                        <div className="lg:sticky lg:top-8">
                             <OrderSummary products={productsToOrder} total={total} discount={discount} shippingFee={shippingFee} couponCode={couponCode}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}