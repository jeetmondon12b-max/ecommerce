import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const { cartItems } = useCart();
    const { userInfo } = useAuth();
    
    const activeLinkStyle = {
        color: '#4f46e5', // Indigo color
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-20">
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

                <NavLink 
                    to={userInfo ? "/my-orders" : "/login"}
                    className="flex flex-col items-center justify-center w-full text-gray-500 hover:text-indigo-600"
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                >
                    <FaUser size={22} />
                    <span className="text-xs mt-1">{userInfo ? "Account" : "Login"}</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;