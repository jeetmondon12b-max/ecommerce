import React, { useState, useEffect } from "react"; // <<< ১. এখানে useEffect ইম্পোর্ট করা হয়েছে
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../apiConfig';
import { FiUser, FiPhone, FiMapPin, FiChevronDown, FiChevronUp, FiLoader } from 'react-icons/fi';
import LazyImage from "../components/LazyImage"; // ✅ LazyImage ইম্পোর্ট করা হয়েছে

const OrderSummary = React.memo(({ products, total, discount, shippingFee, couponCode }) => (
    <div className="p-6 bg-white border shadow-lg sm:p-8 rounded-2xl">
        <h2 className="pb-4 mb-4 text-xl font-bold text-gray-800 border-b">Order Summary</h2>
        <div className="pr-2 mb-6 space-y-4 overflow-y-auto max-h-60">
            {products.map((item, index) => (
                <div key={item.cartId || index} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0 w-16 h-16">
                            {/* ✅ ফিক্স: ছবির URL থেকে ${API_URL} সরানো হয়েছে এবং LazyImage ব্যবহার করা হয়েছে */}
                            <LazyImage 
                                src={item.image} 
                                alt={item.name} 
                                className="object-cover w-full h-full rounded-md"
                            />
                            <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-gray-700 rounded-full -top-2 -right-2">{item.quantity}</span>
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
        <div className="pt-4 space-y-2 text-gray-600 border-t">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{total - shippingFee + (discount || 0)}</span>
            </div>
            <div className="flex justify-between">
                <span>Shipping</span>
                <span>৳{shippingFee}</span>
            </div>
            {discount > 0 && (
                <div className="flex justify-between font-medium text-green-600">
                    <span>Discount ({couponCode})</span>
                    <span>-৳{discount}</span>
                </div>
            )}
            <div className="flex justify-between pt-2 mt-2 text-xl font-bold text-gray-800 border-t">
                <span>Total</span>
                <span className="text-indigo-600">৳{total}</span>
            </div>
        </div>
        <div className="pt-4 mt-6 border-t">
            <h3 className="font-semibold text-gray-800 text-md">Payment Method</h3>
            <p className="mt-1 text-gray-600">Cash on Delivery</p>
        </div>
    </div>
));

export default function ShippingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    // <<< ২. এই কোডটুকু যোগ করা হয়েছে >>>
    // এই useEffect হুকটি নিশ্চিত করে যে পেজটি লোড হওয়ামাত্র
    // এটি ব্যবহারকারীকে পেজের একদম উপরে নিয়ে যাবে।
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // <-- [] মানে এই ইফেক্ট শুধু একবারই (পেজ লোডের সময়) চলবে

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
                <h1 className="mb-4 text-2xl font-bold text-red-500">No product data found.</h1>
                <Link to="/" className="font-semibold text-indigo-600 hover:underline">Go back to Homepage</Link>
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
        <div className="min-h-screen px-4 py-8 bg-gray-50 sm:py-12 sm:px-6 lg:px-8">
            <div className="container max-w-6xl mx-auto">
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                    
                    <div className="lg:hidden">
                        <div className="bg-white border shadow-lg rounded-2xl">
                            <button onClick={() => setIsSummaryOpen(!isSummaryOpen)} className="flex items-center justify-between w-full p-4">
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
                        <div className="p-6 bg-white border shadow-lg sm:p-8 rounded-2xl">
                            <h2 className="mb-6 text-2xl font-bold text-gray-800">Shipping Address</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="relative">
                                    <label className="block mb-1 text-sm font-medium text-gray-600">Full Name</label>
                                    <FiUser className="absolute text-gray-400 left-3 top-10" />
                                    <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className="w-full py-3 pl-10 pr-4 border rounded-xl focus:ring-2 focus:ring-indigo-500"/>
                                </div>
                                <div className="relative">
                                    <label className="block mb-1 text-sm font-medium text-gray-600">Phone Number</label>
                                    <FiPhone className="absolute text-gray-400 left-3 top-10" />
                                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="w-full py-3 pl-10 pr-4 border rounded-xl focus:ring-2 focus:ring-indigo-500"/>
                                </div>
                                <div className="relative">
                                    <label className="block mb-1 text-sm font-medium text-gray-600">Full Address</label>
                                    <FiMapPin className="absolute text-gray-400 left-3 top-10" />
                                    <textarea name="street" value={form.street} onChange={handleChange} rows="3" required className="w-full py-3 pl-10 pr-4 border rounded-xl focus:ring-2 focus:ring-indigo-500"></textarea>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center disabled:bg-indigo-400">
                                    {loading ? <FiLoader className="mr-2 animate-spin"/> : null}
                                    {loading ? 'Processing...' : `Place Order (৳${total})`}
                                </button>
                                {error && <p className="mt-3 font-medium text-center text-red-600">❌ {error}</p>}
                            </form>
                        </div>
                    </div>

                    <div className="hidden w-full lg:w-2/5 lg:block">
                        <div className="lg:sticky lg:top-8">
                            <OrderSummary products={productsToOrder} total={total} discount={discount} shippingFee={shippingFee} couponCode={couponCode}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}