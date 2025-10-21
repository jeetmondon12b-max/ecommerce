// import React, { useEffect, useState } from 'react';
// import { useLocation, Link, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { FiCheckCircle } from 'react-icons/fi';

// const OrderSuccessPage = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
    
//     // ✅ ধাপ ১: রিডাইরেক্টিং মেসেজ দেখানোর জন্য নতুন state
//     const [isRedirecting, setIsRedirecting] = useState(false);

//     const { orderDetails } = location.state || {};

//     // ✅ ধাপ ২: useEffect ব্যবহার করে স্বয়ংক্রিয় কাজগুলো করা হচ্ছে
//     useEffect(() => {
//         if (!orderDetails || !orderDetails._id) {
//             navigate('/');
//             return;
//         }

//         // react-hot-toast এর মাধ্যমে সাকসেস মেসেজ দেখানো হচ্ছে
//         toast.success(`আপনার অর্ডারটি (${orderDetails._id}) সফলভাবে প্লেস করা হয়েছে!`, {
//             duration: 4000,
//         });

//         // ২ সেকেন্ড পর "Redirecting..." মেসেজ দেখানো হবে
//         const redirectMsgTimer = setTimeout(() => {
//             setIsRedirecting(true);
//         }, 2000);

//         // ৫ সেকেন্ড পর হোমপেজে রিডাইরেক্ট করা হবে
//         const redirectTimer = setTimeout(() => {
//             navigate('/');
//         }, 5000);

//         // কম্পোনেন্টটি inactive হয়ে গেলে টাইমারগুলো বন্ধ করা হবে
//         return () => {
//             clearTimeout(redirectMsgTimer);
//             clearTimeout(redirectTimer);
//         };
//     }, [orderDetails, navigate]);


//     if (!orderDetails) {
//         // যদি কোনো কারণে ডেটা না থাকে, তাহলে একটি ফলব্যাক UI দেখানো হচ্ছে
//         return (
//             <div className="text-center py-20">
//                 <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
//                 <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Go to Homepage</Link>
//             </div>
//         );
//     }
    
//     // ✅ ধাপ ৩: একাধিক প্রোডাক্ট দেখানোর জন্য লজিক আপডেট করা হয়েছে
//     const productNames = orderDetails.orderItems.map(item => item.name).join(', ');

//     return (
//         <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
//             <div className="max-w-2xl w-full mx-auto my-10 p-8 bg-white shadow-lg rounded-xl text-center">
//                 <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-5">
//                     <FiCheckCircle className="w-12 h-12 text-green-600" />
//                 </div>
//                 <h1 className="text-3xl font-bold text-gray-800">Order Placed Successfully!</h1>
//                 <p className="text-gray-600 mt-2">Thank you for your purchase. Your order is being processed.</p>
                
//                 <div className="text-left mt-8 p-6 bg-gray-50 rounded-lg border">
//                     <h3 className="text-lg font-semibold mb-4 border-b pb-2">Order Summary</h3>
//                     <p><strong>Order ID:</strong> <span className="text-gray-700 break-all">{orderDetails._id}</span></p>
//                     <p><strong>Products:</strong> <span className="text-gray-700">{productNames}</span></p>
//                     <p><strong>Total Amount:</strong> <span className="font-bold text-blue-600">৳{orderDetails.paymentInfo.totalAmount}</span></p>
//                     <p><strong>Shipping to:</strong> <span className="text-gray-700">{orderDetails.customerInfo.fullName}, {orderDetails.customerInfo.street}</span></p>
//                 </div>

//                 {/* ✅ ধাপ ৪: শর্তসাপেক্ষে রিডাইরেক্টিং মেসেজ এবং বাটন */}
//                 {isRedirecting ? (
//                     <p className="mt-8 text-lg text-gray-500 animate-pulse">
//                         Redirecting to homepage...
//                     </p>
//                 ) : (
//                     <Link to="/" className="mt-8 inline-block w-full bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300">
//                         Continue Shopping
//                     </Link>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default OrderSuccessPage;




import React, { useEffect, useState, useMemo } from 'react'; // 🚀 useMemo যোগ করা হয়েছে
import { useLocation, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiLoader } from 'react-icons/fi'; // 🚀 FiLoader আইকন যোগ করা হয়েছে

const OrderSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { orderDetails } = location.state || {};

    useEffect(() => {
        if (!orderDetails || !orderDetails._id) {
            navigate('/');
            return;
        }

        // react-hot-toast এর মাধ্যমে সাকসেস মেসেজ দেখানো হচ্ছে
        toast.success(`Your order (${orderDetails._id}) has been placed successfully!`, {
            duration: 4000,
        });

        // ২ সেকেন্ড পর "Redirecting..." মেসেজ দেখানো হবে
        const redirectMsgTimer = setTimeout(() => {
            setIsRedirecting(true);
        }, 2000);

        // ৫ সেকেন্ড পর হোমপেজে রিডাইরেক্ট করা হবে
        const redirectTimer = setTimeout(() => {
            navigate('/');
        }, 5000);

        // কম্পোনেন্টটি inactive হয়ে গেলে টাইমারগুলো বন্ধ করা হবে
        return () => {
            clearTimeout(redirectMsgTimer);
            clearTimeout(redirectTimer);
        };
    }, [orderDetails, navigate]);

    // 🚀 useMemo ব্যবহার করে productNames ক্যালকুলেশন অপটিমাইজ করা হয়েছে
    // এটি শুধু orderDetails পরিবর্তন হলেই রান হবে, অপ্রয়োজনীয় re-calculation হবে না।
    const productNames = useMemo(() => {
        if (!orderDetails?.orderItems) return '';
        return orderDetails.orderItems.map(item => item.name).join(', ');
    }, [orderDetails]);


    if (!orderDetails) {
        // যদি কোনো কারণে ডেটা না থাকে, তাহলে একটি ফলব্যাক UI দেখানো হচ্ছে
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
                <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Go to Homepage</Link>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
            <div className="max-w-2xl w-full mx-auto my-10 p-8 bg-white shadow-xl rounded-2xl text-center border">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-5">
                    <FiCheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Order Placed Successfully!</h1>
                <p className="text-gray-600 mt-2">Thank you for your purchase. Your order is being processed.</p>
                
                <div className="text-left mt-8 p-6 bg-gray-50 rounded-lg border space-y-2">
                    <h3 className="text-lg font-semibold mb-3 border-b pb-3 text-gray-800">Order Summary</h3>
                    <p><strong>Order ID:</strong> <span className="text-gray-700 break-all">{orderDetails._id}</span></p>
                    <p><strong>Products:</strong> <span className="text-gray-700">{productNames}</span></p>
                    <p><strong>Total Amount:</strong> <span className="font-bold text-indigo-600">৳{orderDetails.paymentInfo.totalAmount}</span></p>
                    <p><strong>Shipping to:</strong> <span className="text-gray-700">{orderDetails.customerInfo.fullName}, {orderDetails.customerInfo.street}</span></p>
                </div>

                {isRedirecting ? (
                    <div className="mt-8 flex items-center justify-center text-lg text-gray-500">
                        <FiLoader className="animate-spin mr-3" />
                        Redirecting to homepage...
                    </div>
                ) : (
                    <Link to="/" className="mt-8 inline-block w-full bg-indigo-600 text-white px-5 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50">
                        Continue Shopping
                    </Link>
                )}
            </div>
        </div>
    );
};

export default OrderSuccessPage;