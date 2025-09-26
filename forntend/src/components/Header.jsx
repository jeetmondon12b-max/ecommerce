// src/components/Header.jsx

import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { 
    FiMenu, FiX, FiChevronDown, FiGrid, FiUsers, FiPackage, 
    FiShoppingBag, FiLogOut, FiList, FiHeart, FiTag, FiLayers, FiImage, FiShoppingCart
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

// Profile Dropdown Component (অপরিবর্তিত)
const ProfileDropdown = ({ userInfo, onLogout }) => { /* ... কোড অপরিবর্তিত ... */ };

// Category Dropdown Component (অপরিবর্তিত)
const CategoryDropdown = ({ isMobile, onClick }) => { /* ... কোড অপরিবর্তিত ... */ };

// Reusable Navigation Links Component
const NavLinks = ({ isMobile, onClick, userInfo, onLogout }) => {
    const activeDesktop = { color: '#4f46e5', backgroundColor: '#eef2ff' };
    const activeMobile = { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' };
    const getStyle = ({ isActive }) => (isActive ? (isMobile ? activeMobile : activeDesktop) : undefined);
    const navLinkMobile = "flex items-center gap-3 w-full text-lg font-medium p-3 rounded-lg transition-colors hover:bg-indigo-600";
    const navLinkDesktop = "flex items-center gap-2 text-gray-600 font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-gray-100";
    const { cartItems } = useCart();
    return (
        <>
            {userInfo && userInfo.role === 'admin' && (
                <>
                    <NavLink to="/admin" end style={getStyle} className={isMobile ? navLinkMobile : navLinkDesktop} onClick={onClick}><FiGrid/>Dashboard</NavLink>
                    <NavLink to="/admin/products" style={getStyle} className={isMobile ? navLinkMobile : navLinkDesktop} onClick={onClick}><FiPackage/>Products</NavLink>
                    <CategoryDropdown isMobile={isMobile} onClick={onClick} />
                    
                    {/* ✅ কুপনের জন্য নতুন NavLink যোগ করা হয়েছে */}
                    <NavLink to="/admin/coupons" style={getStyle} className={isMobile ? navLinkMobile : navLinkDesktop} onClick={onClick}><FiTag/>Coupons</NavLink>
                    
                    <NavLink to="/admin/banners" style={getStyle} className={isMobile ? navLinkMobile : navLinkDesktop} onClick={onClick}><FiImage/>Banners</NavLink>
                    <NavLink to="/admin/orders" style={getStyle} className={isMobile ? navLinkMobile : navLinkDesktop} onClick={onClick}><FiShoppingBag/>Orders</NavLink>
                    <NavLink to="/admin/users" style={getStyle} className={isMobile ? navLinkMobile : navLinkDesktop} onClick={onClick}><FiUsers/>Users</NavLink>
                    <NavLink to="/admin/wishlist-summary" style={getStyle} className={isMobile ? navLinkMobile : navLinkDesktop} onClick={onClick}><FiHeart/>Wishlist</NavLink>
                </>
            )}
            {/* ... বাকি কোড অপরিবর্তিত ... */}
        </>
    );
};

// Main Header Component
const Header = () => {
    // ... আপনার বাকি কোড অপরিবর্তিত থাকবে ...
    // শুধু NavLinks কম্পোনেন্ট পরিবর্তন করা হয়েছে
};


// ⛔️ Header.jsx এর বাকি কোডটি অনেক বড় এবং সেখানে কোনো পরিবর্তন নেই, 
// তাই শুধু NavLinks অংশটুকু দেখানো হয়েছে। আপনি আপনার পুরো Header.jsx 
// ফাইলে শুধু NavLinks কম্পোনেন্টের ভেতর নতুন লিংকটি যোগ করবেন।
// নিচে সম্পূর্ণ কোডটিও দিয়ে দিচ্ছি আপনার সুবিধার জন্য।

// --- সম্পূর্ণ Header.jsx কোড (আপডেটসহ) ---
const Header_Full = () => {
    const { userInfo, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const confirmLogout = () => {
        toast((t) => (
            <div className="max-w-sm w-full bg-white shadow-xl rounded-lg p-4">
                <div className="flex flex-col">
                    <div className="mb-4 text-center">
                        <h2 className="font-bold text-lg text-gray-800">Confirm Logout</h2>
                        <p className="text-sm text-gray-600 mt-1">Are you sure you want to end your session?</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                                toast.dismiss(t.id);
                            }}
                            className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        ), {
            duration: 5000,
            position: 'top-center',
        });
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-30">
            <Toaster position="top-center" />
            <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-3xl font-extrabold text-indigo-600">MyShop</Link>
                
                <div className="hidden md:flex items-center gap-4">
                    <nav className="flex items-center gap-2">
                        <NavLinks userInfo={userInfo} /> {/* NavLinks এখানে ব্যবহার করা হয়েছে */}
                    </nav>
                    {userInfo?.role !== 'admin' && (
                        <NavLink to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                            <FiShoppingCart size={24} />
                            {cartItems.length > 0 && (<span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartItems.length}</span>)}
                        </NavLink>
                    )}
                    {userInfo ? (<ProfileDropdown userInfo={userInfo} onLogout={confirmLogout} />) : (<div className="flex items-center gap-2"><Link to="/login" className="font-semibold px-4 py-2 rounded-lg bg-gray-100 text-indigo-600 hover:bg-gray-200">Login</Link><Link to="/register" className="font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Sign Up</Link></div>)}
                </div>

                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(true)} className="text-gray-600 hover:text-indigo-600 text-2xl"><FiMenu /></button>
                </div>
            </div>

            <div className={`fixed inset-0 z-40 md:hidden ${!isMenuOpen && 'pointer-events-none'}`}>
                <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
                <div className={`fixed inset-y-0 left-0 w-72 bg-indigo-700 text-white z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-5 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-8">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-extrabold">MyShop</Link>
                            <button onClick={() => setIsMenuOpen(false)} className="hover:text-gray-300"><FiX size={24} /></button>
                        </div>
                        <nav className="flex-grow overflow-y-auto flex flex-col space-y-2">
                            <NavLinks isMobile={true} onClick={() => setIsMenuOpen(false)} userInfo={userInfo} onLogout={confirmLogout} />
                        </nav>
                        {!userInfo && (
                            <div className="mt-auto pt-4 border-t border-indigo-600">
                                <div className="space-y-2">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-white text-indigo-700 font-semibold py-3 rounded-lg">Login</Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-indigo-800 font-semibold py-3 rounded-lg hover:bg-indigo-900">Get Started</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header_Full; // Note: You should export this as `default`