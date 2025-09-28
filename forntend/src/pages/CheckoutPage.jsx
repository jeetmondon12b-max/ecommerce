import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiTag, FiTruck, FiLoader } from "react-icons/fi";
import { API_URL } from '../apiConfig';

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();

    let itemsToCheckout = [];
    if (location.state?.items && Array.isArray(location.state.items)) {
        itemsToCheckout = location.state.items;
    } else if (location.state?.singleItem) {
        itemsToCheckout = [location.state.singleItem];
    }

    const [shippingOption, setShippingOption] = useState("inside_dhaka");
    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [couponMessage, setCouponMessage] = useState({ type: "", text: "" });

    if (itemsToCheckout.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center text-center p-4">
                <h1 className="text-2xl font-bold text-red-600 mb-4">No Products Found for Checkout</h1>
                <p className="text-gray-600 mb-6">Please add items to your cart or select a product first.</p>
                <Link to="/" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
                    Go to Homepage
                </Link>
            </div>
        );
    }

    const subtotal = itemsToCheckout.reduce((total, item) => {
        const price = item.discountPrice || item.regularPrice;
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
            const response = await axios.post(`${API_URL}/api/coupons/validate`, {
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
                products: itemsToCheckout,
                shippingFee,
                total: finalTotal,
                discount,
                couponCode: appliedCoupon,
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-8">
                
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
                    Complete Your Order
                </h2>

                {/* --- Order Summary Section --- */}
                <div className="border border-gray-200 bg-gray-50/50 rounded-xl p-4 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Order Summary ({itemsToCheckout.length} {itemsToCheckout.length > 1 ? 'items' : 'item'})</h3>
                    {itemsToCheckout.map((item, index) => (
                        <div key={item.cartId || item._id || index} className="flex items-center space-x-3 sm:space-x-4">
                             <img 
                                src={`${API_URL}${item.image}`} 
                                alt={item.name} 
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{item.name}</p>
                                {item.size && <p className="text-sm text-gray-500">Size: <span className="font-medium">{item.size}</span></p>}
                                <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                            </div>
                            <p className="font-bold text-gray-800">৳{(item.discountPrice || item.regularPrice) * (item.quantity || 1)}</p>
                        </div>
                    ))}
                </div>

                {/* --- Shipping Fee Section --- */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><FiTruck className="mr-2 text-gray-500"/>Shipping Method</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div onClick={() => setShippingOption("inside_dhaka")} className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${shippingOption === "inside_dhaka" ? "border-indigo-600 bg-indigo-50" : "border-gray-300 hover:border-indigo-500"}`}>
                            <p className="font-semibold text-gray-800">Inside Dhaka</p>
                            <p className="font-bold">৳{shippingCosts.inside_dhaka}</p>
                        </div>
                        <div onClick={() => setShippingOption("outside_dhaka")} className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${shippingOption === "outside_dhaka" ? "border-indigo-600 bg-indigo-50" : "border-gray-300 hover:border-indigo-500"}`}>
                            <p className="font-semibold text-gray-800">Outside Dhaka</p>
                            <p className="font-bold">৳{shippingCosts.outside_dhaka}</p>
                        </div>
                    </div>
                </div>

                {/* --- Coupon Section --- */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><FiTag className="mr-2 text-gray-500"/>Apply Coupon</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                            placeholder="Enter coupon code"
                            className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={isApplyingCoupon}
                        />
                        <button onClick={handleApplyCoupon} disabled={isApplyingCoupon} className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-green-300 flex items-center justify-center">
                            {isApplyingCoupon ? <FiLoader className="animate-spin mr-2"/> : null}
                            {isApplyingCoupon ? "Applying..." : "Apply"}
                        </button>
                    </div>
                    {couponMessage.text && (
                        <p className={`font-medium mt-2 text-sm ${couponMessage.type === "error" ? "text-red-500" : "text-green-600"}`}>
                            {couponMessage.text}
                        </p>
                    )}
                </div>

                {/* --- Total Calculation --- */}
                <div className="border-t pt-6 space-y-2 text-base text-gray-600">
                    <div className="flex justify-between font-medium">
                        <span>Subtotal</span>
                        <span className="text-gray-800">৳{subtotal}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                        <span>Shipping</span>
                        <span className="text-gray-800">৳{shippingFee}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between font-medium text-green-600">
                            <span>Discount</span>
                            <span>-৳{discount}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t mt-3">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-indigo-600">৳{finalTotal}</span>
                    </div>
                </div>
                
                {/* --- Proceed Button --- */}
                <button
                    onClick={handleNext}
                    className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 transform hover:-translate-y-1"
                >
                    Proceed to Shipping Address
                </button>
            </div>
        </div>
    );
}
