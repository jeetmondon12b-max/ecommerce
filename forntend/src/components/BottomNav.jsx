import React from 'react';
import { NavLink } from 'react-router-dom';
// ✅ নতুন আইকন এবং AuthContext ইম্পোর্ট করা হয়েছে
import { FaHome, FaShoppingCart, FaHeart, FaBoxOpen } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const { cartItems } = useCart();
    const { userInfo } = useAuth(); // ইউজার লগইন করা কিনা তা চেক করার জন্য

    // NavLink এর জন্য active স্টাইল
    const activeLinkStyle = {
        color: '#4f46e5', // Indigo color
    };

    return (
        // এই নেভিগেশন বারটি শুধুমাত্র md স্ক্রিনের নিচে দেখা যাবে
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
            <div className="flex justify-around h-16">
                <NavLink 
                    to="/" 
                    className="flex flex-col items-center justify-center w-full text-gray-500 hover:text-indigo-600"
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                >
                    <FaHome size={22} />
                    <span className="text-xs mt-1">Home</span>
                </NavLink>

                <NavLink 
                    to="/cart" 
                    className="relative flex flex-col items-center justify-center w-full text-gray-500 hover:text-indigo-600"
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                >
                    <FaShoppingCart size={22} />
                    <span className="text-xs mt-1">Cart</span>
                    {cartItems.length > 0 && (
                        <span className="absolute top-2 right-6 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {cartItems.length}
                        </span>
                    )}
                </NavLink>

                <NavLink 
                    to="/wishlist" 
                    className="flex flex-col items-center justify-center w-full text-gray-500 hover:text-indigo-600"
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                >
                    <FaHeart size={22} />
                    <span className="text-xs mt-1">Wishlist</span>
                </NavLink>

                {/* ✅ "My Orders" বাটনটি এখানে যোগ করা হয়েছে */}
                {/* এই বাটনটি শুধুমাত্র লগইন করা থাকলেই দেখা যাবে */}
                {userInfo && (
                    <NavLink 
                        to="/my-orders" 
                        className="flex flex-col items-center justify-center w-full text-gray-500 hover:text-indigo-600"
                        style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                    >
                        <FaBoxOpen size={22} />
                        <span className="text-xs mt-1">My Orders</span>
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

export default BottomNav;