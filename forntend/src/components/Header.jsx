// import React, { useState, useEffect } from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext.jsx';
// import { useCart } from '../context/CartContext.jsx';
// import {
//     FiMenu, FiX, FiChevronDown, FiGrid, FiUsers, FiPackage,
//     FiShoppingBag, FiLogOut, FiHeart, FiTag, FiLayers, FiImage, FiShoppingCart, FiUser, FiHome
// } from 'react-icons/fi';
// import toast, { Toaster } from 'react-hot-toast';

// // Profile Dropdown Component (অপরিবর্তিত)
// const ProfileDropdown = ({ userInfo, onLogout }) => {
//     const [isOpen, setIsOpen] = useState(false);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (isOpen && !event.target.closest('.profile-dropdown-container')) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [isOpen]);

//     return (
//         <div className="relative profile-dropdown-container">
//             <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//                 <img src={userInfo.avatar || `https://ui-avatars.com/api/?name=${userInfo.name}&background=random`} alt="avatar" className="w-7 h-7 rounded-full" />
//                 <span className="font-semibold text-gray-700">Account</span>
//                 <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
//             </button>
            
//             {isOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-20 border animate-fade-in-up">
//                     <div className="p-4 border-b">
//                         <p className="font-bold text-gray-800 truncate">{userInfo.name}</p>
//                         <p className="text-sm text-gray-500 truncate">{userInfo.email}</p>
//                     </div>
//                     <div className="py-2">
//                         <Link to="/my-orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                             <FiShoppingBag size={16} /> My Orders
//                         </Link>
//                         <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                             <FiHeart size={16} /> Wishlist
//                         </Link>
//                         <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                             <FiUser size={16} /> Profile Settings
//                         </Link>
//                     </div>
//                     <div className="p-2 border-t">
//                         <button onClick={onLogout} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
//                             <FiLogOut size={16} /> Logout
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// // Category Dropdown Component for Admin (অপরিবর্তিত)
// const CategoryDropdown = ({ isMobile, onClick }) => {
//     // This component remains unchanged
//     const [isOpen, setIsOpen] = useState(false);
//     if (isMobile) {
//         return (
//             <div className="w-full">
//                 <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full text-lg font-medium p-3 rounded-lg transition-colors hover:bg-indigo-600">
//                     <span className="flex items-center gap-3">
//                         <FiLayers />Categories
//                     </span>
//                     <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//                 </button>
//                 {isOpen && (
//                     <div className="pl-8 pt-2 space-y-2">
//                         <NavLink to="/admin/page-categories" onClick={onClick} className="block">Page Categories</NavLink>
//                         <NavLink to="/admin/categories" onClick={onClick} className="block">Product Categories</NavLink>
//                     </div>
//                 )}
//             </div>
//         )
//     }
//     return (
//         <div className="relative">
//             <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-gray-600 font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-gray-100">
//                 <FiLayers />Categories<FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//             </button>
//             {isOpen && (
//                 <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20">
//                     <NavLink to="/admin/page-categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Page Categories</NavLink>
//                     <NavLink to="/admin/categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Product Categories</NavLink>
//                 </div>
//             )}
//         </div>
//     )
// };


// // ✅✅✅ NavLinks Component - এখানেই মূল পরিবর্তনটি করা হয়েছে ✅✅✅
// const NavLinks = ({ isMobile, onClick, userInfo, onLogout }) => {
//     const activeDesktop = { color: '#4f46e5', backgroundColor: '#eef2ff' };
//     const activeMobile = { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' };
//     const getStyle = ({ isActive }) => (isActive ? (isMobile ? activeMobile : activeDesktop) : undefined);
    
//     // স্টাইল ক্লাসগুলো অপরিবর্তিত
//     const navLinkMobile = "flex items-center gap-3 w-full text-lg font-medium p-3 rounded-lg transition-colors hover:bg-indigo-600";
//     const navLinkDesktop = "flex items-center gap-2 text-gray-600 font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-gray-100";

//     // ✅ পরিবর্তন: isMobile prop-এর উপর ভিত্তি করে সঠিক ক্লাস নির্ধারণ করা হচ্ছে
//     const navLinkClass = isMobile ? navLinkMobile : navLinkDesktop;

//     return (
//         <>
//             {userInfo && userInfo.role === 'admin' ? (
//                 // Admin Links
//                 <>
//                     {/* <<< এখানে navLinkMobile-এর বদলে navLinkClass ব্যবহার করা হয়েছে >>> */}
//                     <NavLink to="/admin" end style={getStyle} className={navLinkClass} onClick={onClick}><FiGrid />Dashboard</NavLink>
//                     <NavLink to="/admin/products" style={getStyle} className={navLinkClass} onClick={onClick}><FiPackage />Products</NavLink>
//                     <CategoryDropdown isMobile={isMobile} onClick={onClick} />
//                     <NavLink to="/admin/coupons" style={getStyle} className={navLinkClass} onClick={onClick}><FiTag />Coupons</NavLink>
//                     <NavLink to="/admin/banners" style={getStyle} className={navLinkClass} onClick={onClick}><FiImage />Banners</NavLink>
//                     <NavLink to="/admin/orders" style={getStyle} className={navLinkClass} onClick={onClick}><FiShoppingBag />Orders</NavLink>
//                     <NavLink to="/admin/users" style={getStyle} className={navLinkClass} onClick={onClick}><FiUsers />Users</NavLink>
//                     <NavLink to="/admin/wishlist-summary" style={getStyle} className={navLinkClass} onClick={onClick}><FiHeart />Wishlist</NavLink>
//                 </>
//             ) : (
//                 // Regular User Links
//                 <>
//                     {/* <<< এখানেও navLinkMobile-এর বদলে navLinkClass ব্যবহার করা হয়েছে >>> */}
//                     <NavLink to="/" style={getStyle} className={navLinkClass} onClick={onClick}><FiHome /> Home</NavLink>
//                     <NavLink to="/my-orders" style={getStyle} className={navLinkClass} onClick={onClick}><FiShoppingBag /> My Orders</NavLink>
//                     <NavLink to="/wishlist" style={getStyle} className={navLinkClass} onClick={onClick}><FiHeart /> Wishlist</NavLink>
//                 </>
//             )}

//             {/* Logout Button (শুধুমাত্র মোবাইলের জন্য) */}
//             {userInfo && isMobile && (
//                 <button
//                     onClick={() => {
//                         onClick(); // মেন্যু বন্ধ করার জন্য
//                         onLogout(); // লগআউট কনফার্মেশন দেখানোর জন্য
//                     }}
//                     className="flex items-center gap-3 w-full text-lg font-medium p-3 mt-2 rounded-lg transition-colors text-red-300 hover:bg-red-500 hover:text-white"
//                 >
//                     <FiLogOut /> Logout
//                 </button>
//             )}
//         </>
//     );
// };


// // Main Header Component (অপরিবর্তিত)
// const Header = () => {
//     // This component remains unchanged
//     const { userInfo, logout } = useAuth();
//     const { cartItems } = useCart();
//     const navigate = useNavigate();
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     const confirmLogout = () => {
//         toast((t) => (
//             <div className="max-w-sm w-full bg-white shadow-xl rounded-lg p-4">
//                 <div className="flex flex-col">
//                     <div className="mb-4 text-center">
//                         <h2 className="font-bold text-lg text-gray-800">Confirm Logout</h2>
//                         <p className="text-sm text-gray-600 mt-1">Are you sure you want to end your session?</p>
//                     </div>
//                     <div className="grid grid-cols-2 gap-3">
//                         <button
//                             onClick={() => toast.dismiss(t.id)}
//                             className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={() => {
//                                 logout();
//                                 navigate('/login');
//                                 toast.dismiss(t.id);
//                             }}
//                             className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         ), {
//             duration: 5000,
//             position: 'top-center',
//         });
//     };

//     return (
//         <header className="bg-white shadow-sm sticky top-0 z-30">
//             <Toaster position="top-center" />
//             <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
//                 <Link to="/" className="flex items-baseline gap-2 text-2xl sm:text-3xl font-extrabold text-indigo-600">
//                     <span>Demo</span>
//                     <span className="text-xs font-normal text-gray-400 hidden sm:inline">(Developed by Meer Ishrak)</span>
//                 </Link>
                
//                 {/* Desktop Menu */}
//                 <div className="hidden md:flex items-center gap-4">
//                     <nav className="flex items-center gap-2">
//                         <NavLinks userInfo={userInfo} isMobile={false} />
//                     </nav>
                    
//                     <div className="flex items-center gap-4">
//                         {(!userInfo || userInfo.role !== 'admin') && (
//                             <NavLink to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
//                                 <FiShoppingCart size={24} />
//                                 {cartItems.length > 0 && (<span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartItems.length}</span>)}
//                             </NavLink>
//                         )}

//                         {userInfo ? (
//                             <ProfileDropdown userInfo={userInfo} onLogout={confirmLogout} />
//                         ) : (
//                             <div className="flex items-center gap-2">
//                                 <Link to="/login" className="font-semibold px-4 py-2 rounded-lg bg-gray-100 text-indigo-600 hover:bg-gray-200">Login</Link>
//                                 <Link to="/register" className="font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Sign Up</Link>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Mobile Menu Icon */}
//                 <div className="md:hidden flex items-center gap-2">
//                     {(!userInfo || userInfo.role !== 'admin') && (
//                         <NavLink to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
//                             <FiShoppingCart size={24} />
//                             {cartItems.length > 0 && (<span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartItems.length}</span>)}
//                         </NavLink>
//                     )}
                    
//                     {!userInfo && (
//                         <Link to="/login" className="font-semibold px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
//                             Login
//                         </Link>
//                     )}

//                     <button onClick={() => setIsMenuOpen(true)} className="p-2 text-gray-600 hover:text-indigo-600 text-2xl"><FiMenu /></button>
//                 </div>
//             </div>

//             {/* Mobile Off-canvas Menu */}
//             <div className={`fixed inset-0 z-40 md:hidden ${!isMenuOpen && 'pointer-events-none'}`}>
//                 <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
//                 <div className={`fixed inset-y-0 left-0 w-72 bg-indigo-700 text-white z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    
//                     <div className="flex flex-col h-full">
                        
//                         {/* Header Section */}
//                         <div className="p-5 flex-shrink-0">
//                             <div className="flex justify-between items-center mb-4">
//                                 <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-extrabold">MyShop</Link>
//                                 <button onClick={() => setIsMenuOpen(false)} className="hover:text-gray-300"><FiX size={24} /></button>
//                             </div>
                            
//                             {userInfo && (
//                                 <div className="bg-indigo-600 p-3 rounded-lg mb-4">
//                                     <p className="font-bold truncate">{userInfo.name}</p>
//                                     <p className="text-sm text-indigo-200 truncate">{userInfo.email}</p>
//                                 </div>
//                             )}
//                         </div>
                        
//                         <nav className="flex-grow overflow-y-auto px-5 pb-4">
//                             <div className="space-y-2">
//                                 <NavLinks 
//                                     isMobile={true} 
//                                     onClick={() => setIsMenuOpen(false)} 
//                                     userInfo={userInfo} 
//                                     onLogout={confirmLogout} 
//                                 />
//                             </div>
//                         </nav>

//                     </div>
//                 </div>
//             </div>
//         </header>
//     );
// };  

// export default Header;


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
const ProfileDropdown = ({ userInfo, onLogout }) => {
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

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
                <img src={userInfo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=random`} alt="avatar" className="w-7 h-7 rounded-full" />
                <span className="font-semibold text-gray-700">Account</span>
                <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-20 border animate-fade-in-up">
                    <div className="p-4 border-b">
                        <p className="font-bold text-gray-800 truncate">{userInfo.name}</p>
                        <p className="text-sm text-gray-500 truncate">{userInfo.email}</p>
                    </div>
                    <div className="py-2">
                        <Link to="/my-orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <FiShoppingBag size={16} /> My Orders
                        </Link>
                        <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <FiHeart size={16} /> Wishlist
                        </Link>
                        <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <FiUser size={16} /> Profile Settings
                        </Link>
                    </div>
                    <div className="p-2 border-t">
                        <button onClick={onLogout} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                            <FiLogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Category Dropdown Component
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
                <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full text-lg font-medium p-3 rounded-lg transition-colors hover:bg-indigo-600">
                    <span className="flex items-center gap-3"><FiLayers />Categories</span>
                    <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="pl-8 pt-2 space-y-2">
                        <NavLink to="/admin/page-categories" onClick={onClick} className="block">Page Categories</NavLink>
                        <NavLink to="/admin/categories" onClick={onClick} className="block">Product Categories</NavLink>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-gray-600 font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-gray-100">
                <FiLayers />Categories<FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20">
                    <NavLink to="/admin/page-categories" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Page Categories</NavLink>
                    <NavLink to="/admin/categories" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Product Categories</NavLink>
                </div>
            )}
        </div>
    );
};

// NavLinks Component
const NavLinks = ({ isMobile, onClick, userInfo, onLogout }) => {
    const activeDesktop = { color: '#4f46e5', backgroundColor: '#eef2ff' };
    const activeMobile = { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' };
    const getStyle = ({ isActive }) => (isActive ? (isMobile ? activeMobile : activeDesktop) : undefined);
    
    const navLinkMobile = "flex items-center gap-3 w-full text-lg font-medium p-3 rounded-lg transition-colors hover:bg-indigo-600";
    const navLinkDesktop = "flex items-center gap-2 text-gray-600 font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-gray-100";
    const navLinkClass = isMobile ? navLinkMobile : navLinkDesktop;

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
                <button
                    onClick={() => { onClick(); onLogout(); }}
                    className="flex items-center gap-3 w-full text-lg font-medium p-3 mt-2 rounded-lg text-red-300 hover:bg-red-500 hover:text-white"
                >
                    <FiLogOut /> Logout
                </button>
            )}
        </>
    );
};

// Main Header Component
const Header = () => {
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
                        <button onClick={() => toast.dismiss(t.id)} className="w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg">Cancel</button>
                        <button onClick={() => { logout(); navigate('/login'); toast.dismiss(t.id); }} className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">Logout</button>
                    </div>
                </div>
            </div>
        ), { duration: 5000, position: 'top-center' });
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-30">
            <Toaster position="top-center" />
            <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-baseline gap-2 text-2xl sm:text-3xl font-extrabold text-indigo-600">
                    <span>Demo</span>
                    <span className="text-xs font-normal text-gray-400 hidden sm:inline">(Developed by Meer Ishrak)</span>
                </Link>
                
                <div className="hidden md:flex items-center gap-4">
                    <nav className="flex items-center gap-2">
                        <NavLinks userInfo={userInfo} isMobile={false} />
                    </nav>
                    
                    <div className="flex items-center gap-4">
                        {(!userInfo || userInfo.role !== 'admin') && (
                            <NavLink to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                <FiShoppingCart size={24} />
                                {cartItems.length > 0 && (<span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartItems.length}</span>)}
                            </NavLink>
                        )}
                        {userInfo ? (
                            <ProfileDropdown userInfo={userInfo} onLogout={confirmLogout} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="font-semibold px-4 py-2 rounded-lg bg-gray-100 text-indigo-600 hover:bg-gray-200">Login</Link>
                                <Link to="/register" className="font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:hidden flex items-center gap-2">
                    {(!userInfo || userInfo.role !== 'admin') && (
                        <NavLink to="/cart" className="relative p-2 text-gray-600 hover:text-indigo-600">
                            <FiShoppingCart size={24} />
                            {cartItems.length > 0 && (<span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{cartItems.length}</span>)}
                        </NavLink>
                    )}
                    {!userInfo && (
                        <Link to="/login" className="font-semibold px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white">Login</Link>
                    )}
                    <button onClick={() => setIsMenuOpen(true)} className="p-2 text-gray-600 hover:text-indigo-600 text-2xl"><FiMenu /></button>
                </div>
            </div>

            <div className={`fixed inset-0 z-40 md:hidden ${!isMenuOpen && 'pointer-events-none'}`}>
                <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
                <div className={`fixed inset-y-0 left-0 w-72 bg-indigo-700 text-white z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="p-5 flex-shrink-0">
                            <div className="flex justify-between items-center mb-4">
                                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-extrabold">MyShop</Link>
                                <button onClick={() => setIsMenuOpen(false)} className="hover:text-gray-300"><FiX size={24} /></button>
                            </div>
                            {userInfo && (
                                <div className="bg-indigo-600 p-3 rounded-lg mb-4">
                                    <p className="font-bold truncate">{userInfo.name}</p>
                                    <p className="text-sm text-indigo-200 truncate">{userInfo.email}</p>
                                </div>
                            )}
                        </div>
                        <nav className="flex-grow overflow-y-auto px-5 pb-4">
                            <div className="space-y-2">
                                <NavLinks 
                                    isMobile={true} 
                                    onClick={() => setIsMenuOpen(false)} 
                                    userInfo={userInfo} 
                                    onLogout={confirmLogout} 
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