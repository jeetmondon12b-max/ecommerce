import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import {
    FiMenu, FiX, FiChevronDown, FiGrid, FiUsers, FiPackage,
    FiShoppingBag, FiLogOut, FiHeart, FiTag, FiLayers, FiImage, FiShoppingCart, FiUser, FiHome
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

// Profile Dropdown Component
const ProfileDropdown = ({ userInfo, onLogoutConfirm }) => { // Changed prop name for clarity
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogoutClick = () => {
        setIsOpen(false); // Close dropdown first
        onLogoutConfirm(); // Then trigger confirmation
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
                <img src={userInfo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=random`} alt="avatar" className="rounded-full w-7 h-7" />
                <span className="font-semibold text-gray-700">Account</span>
                <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 z-20 w-56 mt-2 bg-white border rounded-md shadow-xl animate-fade-in-up">
                    <div className="p-4 border-b">
                        <p className="font-bold text-gray-800 truncate">{userInfo.name}</p>
                        <p className="text-sm text-gray-500 truncate">{userInfo.email}</p>
                    </div>
                    <div className="py-2">
                        <Link to="/my-orders" onClick={() => setIsOpen(false)} className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <FiShoppingBag size={16} /> My Orders
                        </Link>
                        <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <FiHeart size={16} /> Wishlist
                        </Link>
                        <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <FiUser size={16} /> Profile Settings
                        </Link>
                    </div>
                    <div className="p-2 border-t">
                        {/* Use the new handler */}
                        <button onClick={handleLogoutClick} className="flex items-center w-full gap-3 px-4 py-2 text-sm text-left text-red-600 rounded-md hover:bg-red-50">
                            <FiLogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Category Dropdown Component (No changes needed here)
const CategoryDropdown = ({ isMobile, onClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isMobile) {
        return (
            <div className="w-full">
                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full p-3 text-lg font-medium transition-colors rounded-lg hover:bg-indigo-600">
                    <span className="flex items-center gap-3"><FiLayers />Categories</span>
                    <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="pt-2 pl-8 space-y-2">
                        <NavLink to="/admin/page-categories" onClick={onClick} className="block">Page Categories</NavLink>
                        <NavLink to="/admin/categories" onClick={onClick} className="block">Product Categories</NavLink>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-2 font-semibold text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                <FiLayers />Categories<FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute left-0 z-20 w-48 mt-2 bg-white rounded-md shadow-xl">
                    <NavLink to="/admin/page-categories" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Page Categories</NavLink>
                    <NavLink to="/admin/categories" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Product Categories</NavLink>
                </div>
            )}
        </div>
    );
};

// NavLinks Component (No changes needed here, assuming onLogoutConfirm is passed)
const NavLinks = ({ isMobile, onClick, userInfo, onLogoutConfirm }) => { // Changed prop name
    const activeDesktop = { color: '#4f46e5', backgroundColor: '#eef2ff' };
    const activeMobile = { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' };
    const getStyle = ({ isActive }) => (isActive ? (isMobile ? activeMobile : activeDesktop) : undefined);
    
    const navLinkMobile = "flex items-center gap-3 w-full text-lg font-medium p-3 rounded-lg transition-colors hover:bg-indigo-600";
    const navLinkDesktop = "flex items-center gap-2 text-gray-600 font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-gray-100";
    const navLinkClass = isMobile ? navLinkMobile : navLinkDesktop;

    const handleMobileLogoutClick = () => {
        if(onClick) onClick(); // Close mobile menu if onClick handler exists
        onLogoutConfirm(); // Trigger logout confirmation
    };

    return (
        <>
            {userInfo && userInfo.role === 'admin' ? (
                <>
                    {/* ✅ সমাধান: Homepage বাটনটি এখানে যোগ করা হয়েছে */}
                    <NavLink to="/" target="_blank" rel="noopener noreferrer" className={navLinkClass} onClick={onClick}><FiHome />Homepage</NavLink>
                    
                    <NavLink to="/admin" end style={getStyle} className={navLinkClass} onClick={onClick}><FiGrid />Dashboard</NavLink>
                    <NavLink to="/admin/products" style={getStyle} className={navLinkClass} onClick={onClick}><FiPackage />Products</NavLink>
                    <CategoryDropdown isMobile={isMobile} onClick={onClick} />
                    <NavLink to="/admin/coupons" style={getStyle} className={navLinkClass} onClick={onClick}><FiTag />Coupons</NavLink>
                    <NavLink to="/admin/banners" style={getStyle} className={navLinkClass} onClick={onClick}><FiImage />Banners</NavLink>
                    <NavLink to="/admin/orders" style={getStyle} className={navLinkClass} onClick={onClick}><FiShoppingBag />Orders</NavLink>
                    <NavLink to="/admin/users" style={getStyle} className={navLinkClass} onClick={onClick}><FiUsers />Users</NavLink>
                    <NavLink to="/admin/wishlist-summary" style={getStyle} className={navLinkClass} onClick={onClick}><FiHeart />Wishlist</NavLink>
                </>
            ) : (
                <>
                    <NavLink to="/" style={getStyle} className={navLinkClass} onClick={onClick}><FiHome /> Home</NavLink>
                    <NavLink to="/my-orders" style={getStyle} className={navLinkClass} onClick={onClick}><FiShoppingBag /> My Orders</NavLink>
                    <NavLink to="/wishlist" style={getStyle} className={navLinkClass} onClick={onClick}><FiHeart /> Wishlist</NavLink>
                </>
            )}
            {userInfo && isMobile && (
                // Use the new handler for mobile logout
                <button
                    onClick={handleMobileLogoutClick}
                    className="flex items-center w-full gap-3 p-3 mt-2 text-lg font-medium text-red-300 rounded-lg hover:bg-red-500 hover:text-white"
                >
                    <FiLogOut /> Logout
                </button>
            )}
        </>
    );
};

// Main Header Component
const Header = () => {
    const { userInfo, logout } = useAuth(); // Get logout from context
    const { cartItems } = useCart();
    const navigate = useNavigate(); // Get navigate function
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // ✅ Define the confirmation logic directly within Header
    const confirmLogout = () => {
        // Ensure we always use the latest logout and navigate functions from hooks
        const currentLogout = logout;
        const currentNavigate = navigate;

        toast((t) => (
            <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow-xl">
                <div className="flex flex-col">
                    <div className="mb-4 text-center">
                        <h2 className="text-lg font-bold text-gray-800">Confirm Logout</h2>
                        <p className="mt-1 text-sm text-gray-600">Are you sure you want to end your session?</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => toast.dismiss(t.id)} className="w-full px-4 py-2 font-semibold text-gray-800 bg-gray-200 rounded-lg">Cancel</button>
                        <button 
                            onClick={() => { 
                                currentLogout();         // Use the function captured at call time
                                currentNavigate('/login'); // Use the function captured at call time
                                toast.dismiss(t.id); 
                            }} 
                            className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded-lg"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        ), { duration: Infinity, position: 'top-center', id: 'logout-confirm' }); // Use infinity duration and an ID
    };

    return (
        <header className="sticky top-0 z-30 bg-white shadow-sm">
            <Toaster position="top-center" />
            <div className="container flex items-center justify-between px-4 py-3 mx-auto sm:px-6">
                <Link to="/" className="flex items-baseline gap-2 text-2xl font-extrabold text-indigo-600 sm:text-3xl">
                    <span>Demo</span>
                    <span className="hidden text-xs font-normal text-gray-400 sm:inline">(Developed by Meer Ishrak)</span>
                </Link>
                
                <div className="items-center hidden gap-4 md:flex">
                    <nav className="flex items-center gap-2">
                        {/* Pass confirmLogout to NavLinks for desktop admin */}
                        <NavLinks userInfo={userInfo} isMobile={false} onLogoutConfirm={confirmLogout} /> 
                    </nav>
                    
                    <div className="flex items-center gap-4">
                        {(!userInfo || userInfo.role !== 'admin') && (
                            <NavLink to="/cart" className="relative p-2 text-gray-600 transition-colors hover:text-indigo-600">
                                <FiShoppingCart size={24} />
                                {cartItems.length > 0 && (<span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartItems.length}</span>)}
                            </NavLink>
                        )}
                        {userInfo ? (
                            // Pass confirmLogout to ProfileDropdown
                            <ProfileDropdown userInfo={userInfo} onLogoutConfirm={confirmLogout} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="px-4 py-2 font-semibold text-indigo-600 bg-gray-100 rounded-lg hover:bg-gray-200">Login</Link>
                                <Link to="/register" className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Area */}
                <div className="flex items-center gap-2 md:hidden">
                    {(!userInfo || userInfo.role !== 'admin') && (
                        <NavLink to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600">
                            <FiShoppingCart size={24} />
                            {cartItems.length > 0 && (<span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{cartItems.length}</span>)}
                        </NavLink>
                    )}
                    {!userInfo && (
                        <Link to="/login" className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg">Login</Link>
                    )}
                    <button onClick={() => setIsMenuOpen(true)} className="p-2 text-2xl text-gray-600 hover:text-indigo-600"><FiMenu /></button>
                </div>
            </div>

            {/* Mobile Off-canvas Menu */}
            <div className={`fixed inset-0 z-40 md:hidden ${!isMenuOpen && 'pointer-events-none'}`}>
                {/* Overlay */}
                <div 
                    className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
                    onClick={() => setIsMenuOpen(false)}
                ></div>
                {/* Menu Content */}
                <div className={`fixed inset-y-0 left-0 w-72 bg-indigo-700 text-white z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="flex-shrink-0 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-extrabold">MyShop</Link>
                                <button onClick={() => setIsMenuOpen(false)} className="hover:text-gray-300"><FiX size={24} /></button>
                            </div>
                            {userInfo && (
                                <div className="p-3 mb-4 bg-indigo-600 rounded-lg">
                                    <p className="font-bold truncate">{userInfo.name}</p>
                                    <p className="text-sm text-indigo-200 truncate">{userInfo.email}</p>
                                </div>
                            )}
                        </div>
                        <nav className="flex-grow px-5 pb-4 overflow-y-auto">
                            <div className="space-y-2">
                                {/* Pass confirmLogout to NavLinks for mobile */}
                                <NavLinks 
                                    isMobile={true} 
                                    onClick={() => setIsMenuOpen(false)} 
                                    userInfo={userInfo} 
                                    onLogoutConfirm={confirmLogout} 
                                />
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};   

export default Header;