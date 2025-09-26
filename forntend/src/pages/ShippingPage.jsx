// import { useState } from "react";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from '../context/AuthContext';

// export default function ShippingPage() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { userInfo } = useAuth();

//     const { products: items, product: singleItem, total, discount, shippingFee, couponCode } = location.state || {};
//     const productsToOrder = items || (singleItem ? [singleItem] : []);

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
    
//     const [form, setForm] = useState({
//         fullName: userInfo?.shippingAddress?.fullName || "",
//         phone: userInfo?.shippingAddress?.phoneNumber || "",
//         street: userInfo?.shippingAddress?.address || "",
//     });

//     if (productsToOrder.length === 0) {
//         return (
//             <div className="text-center py-20">
//                 <h1 className="text-2xl font-bold text-red-500 mb-4">No product data found.</h1>
//                 <Link to="/" className="text-indigo-600 font-semibold">Go back to Homepage</Link>
//             </div>
//         );
//     }

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         const orderDetails = {
//             customerInfo: form,
//             orderItems: productsToOrder.map(p => ({
//                 name: p.name,
//                 price: p.price,
//                 image: p.image,
//                 quantity: p.quantity,
//                 brand: p.brand,
//                 size: p.size,
//                 product: p._id
//             })),
//             paymentInfo: {
//                 method: 'Cash on Delivery',
//                 subtotal: productsToOrder.reduce((acc, item) => acc + (item.price * item.quantity), 0),
//                 shippingFee: shippingFee,
//                 discount: discount,
//                 totalAmount: total,
//                 couponCode: couponCode,
//             },
//         };

//         try {
//             const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
//             const response = await axios.post("http://localhost:5000/api/orders", orderDetails, config);
//             navigate("/order-success", { state: { orderDetails: response.data } });
//         } catch (err) {
//             setError(err.response?.data?.message || "Order submission failed.");
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     return (
//         <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//             <div className="container mx-auto">
//                 {/* ✅ ধাপ ১: দুই-কলামের লেআউট তৈরি করা হয়েছে */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
//                     {/* বাম কলাম: শিপিং ফর্ম */}
//                     <div className="bg-white p-8 rounded-2xl shadow-lg">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Address</h2>
//                         <form onSubmit={handleSubmit} className="space-y-5">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
//                                 <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl"/>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
//                                 <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl"/>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-600 mb-1">Full Address</label>
//                                 <textarea name="street" value={form.street} onChange={handleChange} rows="3" required className="w-full px-4 py-3 border rounded-xl"></textarea>
//                             </div>
//                             <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700">
//                                 {loading ? 'Processing...' : 'Place Order'}
//                             </button>
//                             {error && <p className="text-center text-red-600 font-bold mt-3">❌ {error}</p>}
//                         </form>
//                     </div>

//                     {/* ✅ ধাপ ২: ডান কলামে 'Your Order' সামারি যোগ করা হয়েছে */}
//                     <div className="bg-white p-8 rounded-2xl shadow-lg">
//                         <h2 className="text-xl font-semibold border-b pb-4 mb-4">Your Order</h2>
//                         <div className="space-y-4 mb-6">
//                             {productsToOrder.map((item) => (
//                                 <div key={item._id} className="flex justify-between items-center">
//                                     <div className="flex items-center gap-4">
//                                         <div className="relative">
//                                             <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded"/>
//                                             <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
//                                         </div>
//                                         <div>
//                                             <p className="font-semibold">{item.name}</p>
//                                             <p className="text-sm text-gray-500">{item.size ? `Size: ${item.size}` : ''}</p>
//                                         </div>
//                                     </div>
//                                     <p className="font-medium">৳{item.price * item.quantity}</p>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="border-t pt-4 space-y-2">
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Subtotal</span>
//                                 <span>৳{total - shippingFee + (discount || 0)}</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Shipping</span>
//                                 <span>৳{shippingFee}</span>
//                             </div>
//                             {discount > 0 && (
//                                 <div className="flex justify-between text-green-600">
//                                     <span>Discount</span>
//                                     <span>-৳{discount}</span>
//                                 </div>
//                             )}
//                             <div className="flex justify-between font-bold text-xl border-t pt-2 mt-2">
//                                 <span>Total</span>
//                                 <span>৳{total}</span>
//                             </div>
//                         </div>

//                         {/* ✅ ধাপ ৩: পেমেন্ট মেথড যোগ করা হয়েছে */}
//                         <div className="border-t mt-6 pt-4">
//                             <h3 className="text-md font-semibold text-gray-800">Payment Method</h3>
//                             <p className="text-gray-600 mt-1">Cash on Delivery</p>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }

import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

export default function ShippingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    const { products: items, total, discount, shippingFee, couponCode } = location.state || {};
    // ✅ Checkout পেজ থেকে এখন 'products' হিসেবেই ডেটা আসছে, তাই লজিক সহজ করা হলো
    const productsToOrder = items || [];

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [form, setForm] = useState({
        fullName: userInfo?.shippingAddress?.fullName || "",
        phone: userInfo?.shippingAddress?.phoneNumber || "",
        street: userInfo?.shippingAddress?.address || "",
    });

    if (productsToOrder.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-red-500 mb-4">No product data found.</h1>
                <Link to="/" className="text-indigo-600 font-semibold">Go back to Homepage</Link>
            </div>
        );
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const orderDetails = {
            customerInfo: form,
            orderItems: productsToOrder.map(p => ({
                name: p.name,
                price: p.price,
                image: p.image,
                quantity: p.quantity,
                brand: p.brand,
                size: p.size,
                customSize: p.customSize, // ✅ পরিবর্তন: কাস্টম সাইজ যোগ করা হয়েছে
                product: p._id
            })),
            paymentInfo: {
                method: 'Cash on Delivery',
                subtotal: productsToOrder.reduce((acc, item) => acc + (item.price * item.quantity), 0),
                shippingFee: shippingFee,
                discount: discount,
                totalAmount: total,
                couponCode: couponCode,
            },
        };

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const response = await axios.post("http://localhost:5000/api/orders", orderDetails, config);
            navigate("/order-success", { state: { orderDetails: response.data } });
        } catch (err) {
            setError(err.response?.data?.message || "Order submission failed.");
        } finally {
            setLoading(false);
        }
    };
    
    // ... আপনার বাকি JSX কোড অপরিবর্তিত থাকবে ...
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* বাম কলাম: শিপিং ফর্ম */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Address</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Full Address</label>
                                <textarea name="street" value={form.street} onChange={handleChange} rows="3" required className="w-full px-4 py-3 border rounded-xl"></textarea>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700">
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                            {error && <p className="text-center text-red-600 font-bold mt-3">❌ {error}</p>}
                        </form>
                    </div>

                    {/* ডান কলাম: 'Your Order' সামারি */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-xl font-semibold border-b pb-4 mb-4">Your Order</h2>
                        <div className="space-y-4 mb-6">
                            {productsToOrder.map((item, index) => (
                                <div key={item.cartId || index} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded"/>
                                            <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            {/* ✅ পরিবর্তন: কাস্টম সাইজ দেখানোর লজিক */}
                                            {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                                            {item.customSize?.value && <p className="text-sm text-gray-500">{item.customSize.type}: {item.customSize.value}</p>}
                                        </div>
                                    </div>
                                    <p className="font-medium">৳{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>৳{total - shippingFee + (discount || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>৳{shippingFee}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-৳{discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-xl border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>৳{total}</span>
                            </div>
                        </div>
                        <div className="border-t mt-6 pt-4">
                            <h3 className="text-md font-semibold text-gray-800">Payment Method</h3>
                            <p className="text-gray-600 mt-1">Cash on Delivery</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}