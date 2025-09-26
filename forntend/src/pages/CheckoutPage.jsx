import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiTag, FiTruck } from "react-icons/fi";

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ সমাধান: এখানে 'product' এর পরিবর্তে 'singleItem' চেক করা হয়েছে
    // এখন এটি কার্ট পেজ থেকে আসা `items` এবং ডিটেইলস পেজ থেকে আসা `singleItem` উভয়ই গ্রহণ করতে পারবে।
    let itemsToCheckout = [];
    if (location.state?.items && Array.isArray(location.state.items)) {
        itemsToCheckout = location.state.items;
    } else if (location.state?.singleItem) { // <--- পরিবর্তন এখানে
        itemsToCheckout = [location.state.singleItem]; // <--- পরিবর্তন এখানে
    }

    // আপনার state গুলো আগের মতোই রাখা হয়েছে
    const [shippingOption, setShippingOption] = useState("inside_dhaka");
    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [couponMessage, setCouponMessage] = useState({ type: "", text: "" });

    if (itemsToCheckout.length === 0) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
                <h1 className="text-2xl font-bold text-red-600 mb-4">No Products Found for Checkout</h1>
                <p className="text-gray-600 mb-6">Please add items to your cart or select a product first.</p>
                <Link to="/" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold">
                    Go to Homepage
                </Link>
            </div>
        );
    }

    // সাবটোটাল হিসাব করার লজিক ঠিক আছে, এটি এখন একাধিক বা একটি প্রোডাক্টের জন্য কাজ করবে।
    const subtotal = itemsToCheckout.reduce((total, item) => {
        const price = item.price || item.regularPrice;
        const quantity = item.quantity || 1;
        return total + price * quantity;
    }, 0);

    const shippingCosts = { inside_dhaka: 60, outside_dhaka: 120 };
    const shippingFee = shippingCosts[shippingOption];
    const finalTotal = (subtotal + shippingFee) - discount;

    const handleApplyCoupon = async () => {
        setCouponMessage({ type: "", text: "" });
        if (coupon.trim() === "") {
            setCouponMessage({ type: "error", text: "Please enter a coupon code." });
            return;
        }
        setIsApplyingCoupon(true);
        try {
            const response = await axios.post("http://localhost:5000/api/coupons/validate", {
                code: coupon,
                cartTotal: subtotal,
            });
            if (response.data.valid) {
                const fetchedDiscount = response.data.discount;
                setDiscount(fetchedDiscount);
                setAppliedCoupon(coupon);
                setCouponMessage({ type: "success", text: `✅ Coupon applied! You get a ৳${fetchedDiscount} discount.` });
            }
        } catch (error) {
            setDiscount(0);
            setAppliedCoupon(null);
            const errorMessage = error.response?.data?.message || "Invalid coupon code.";
            setCouponMessage({ type: "error", text: `❌ ${errorMessage}` });
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleNext = () => {
        navigate("/shipping-address", {
            state: {
                products: itemsToCheckout, // এখন `product` এর পরিবর্তে `products` এর তালিকা পাঠানো হচ্ছে
                shippingFee,
                total: finalTotal,
                discount,
                couponCode: appliedCoupon,
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 text-center">
                    Complete Your Order
                </h2>

                {/* --- Order Summary Section --- */}
                <div className="border border-gray-200 bg-gray-50 rounded-2xl p-4 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Order Summary ({itemsToCheckout.length} items)</h3>
                    {itemsToCheckout.map((item, index) => (
                        <div key={item.cartId || item._id || index} className="flex items-center space-x-4">
                              <img 
                                src={`http://localhost:5000${item.image}`} 
                                alt={item.name} 
                                className="w-20 h-20 object-cover rounded-lg border"
                            />
                            <div className="flex-1">
                                <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">Brand: {item.brand}</p>
                                {/* ✅ কাস্টম সাইজ দেখানোর জন্য 추가 লজিক */}
                                {item.size && <p className="text-sm text-gray-500">Size: <span className="font-semibold">{item.size}</span></p>}
                                {item.customSize && <p className="text-sm text-gray-500">{item.customSize.type}: <span className="font-semibold">{item.customSize.value}</span></p>}
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <p className="text-lg font-bold text-gray-800">৳{(item.price || item.regularPrice) * item.quantity}</p>
                        </div>
                    ))}
                </div>

                {/* --- Shipping Fee Section --- */}
                <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><FiTruck className="mr-3 text-gray-500"/>Shipping Method</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                            onClick={() => setShippingOption("inside_dhaka")}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${shippingOption === "inside_dhaka" ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-blue-500"}`}
                        >
                            <p className="font-semibold text-gray-800">Inside Dhaka</p>
                            <p className="text-gray-600 font-bold">৳{shippingCosts.inside_dhaka}</p>
                        </div>
                        <div
                            onClick={() => setShippingOption("outside_dhaka")}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${shippingOption === "outside_dhaka" ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-blue-500"}`}
                        >
                            <p className="font-semibold text-gray-800">Outside Dhaka</p>
                            <p className="text-gray-600 font-bold">৳{shippingCosts.outside_dhaka}</p>
                        </div>
                    </div>
                </div>

                {/* --- Coupon Section --- */}
                <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><FiTag className="mr-3 text-gray-500"/>Apply Coupon</h4>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                            placeholder="Enter coupon code"
                            className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isApplyingCoupon}
                        />
                        <button
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon}
                            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-green-300"
                        >
                            {isApplyingCoupon ? "Applying..." : "Apply"}
                        </button>
                    </div>
                    {couponMessage.text && (
                        <p className={`font-medium mt-2 ${couponMessage.type === "error" ? "text-red-500" : "text-green-600"}`}>
                            {couponMessage.text}
                        </p>
                    )}
                </div>

                {/* --- Total Calculation --- */}
                <div className="border-t pt-6 space-y-3">
                    <div className="flex justify-between text-lg">
                        <span className="font-medium text-gray-600">Subtotal</span>
                        <span className="font-semibold text-gray-800">৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                        <span className="font-medium text-gray-600">Shipping</span>
                        <span className="font-semibold text-gray-800">৳{shippingFee}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-lg text-green-600">
                            <span className="font-medium">Discount</span>
                            <span>-৳{discount}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t mt-3">
                        <span className="text-xl lg:text-2xl font-bold text-gray-900">Total</span>
                        <span className="text-2xl lg:text-3xl font-bold text-blue-600">৳{finalTotal}</span>
                    </div>
                </div>
                
                {/* --- Proceed Button --- */}
                <button
                    onClick={handleNext}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    Proceed to Shipping Address
                </button>
            </div>
        </div>
    );
}