// import React from "react";
// import { Routes, Route, Outlet, useLocation } from "react-router-dom";

// // Layout & Protection Components
// import Header from "./components/Header.jsx";
// import Footer from "./components/Footer.jsx";
// import AdminRoute from "./components/AdminRoute.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import BottomNav from "./components/BottomNav.jsx";

// // Page Components
// import HomePage from "./pages/HomePage.jsx";
// import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
// import LoginPage from "./pages/LoginPage.jsx";
// import RegisterPage from "./pages/RegisterPage.jsx";
// import CartPage from "./pages/CartPage.jsx";
// import CheckoutPage from "./pages/CheckoutPage.jsx";
// import ShippingPage from "./pages/ShippingPage.jsx";
// import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
// import MyOrdersPage from "./pages/MyOrdersPage.jsx";
// import WishlistPage from "./pages/WishlistPage.jsx";
// import OrderDetailsPage from "./pages/OrderDetailsPage.jsx"; 
// import CategoryProductsPage from "./pages/CategoryProductsPage.jsx";
// import SearchResultsPage from "./pages/SearchResultsPage.jsx";
// import NotFoundPage from "./pages/NotFoundPage.jsx";

// // Admin Page Components
// import AdminPage from "./pages/AdminPage.jsx";
// import UserListPage from "./pages/UserListPage.jsx";
// import ProductListPage from "./pages/ProductListPage.jsx";
// import EditProductPage from "./pages/EditProductPage.jsx";
// import OrderListPage from "./pages/OrderListPage.jsx";
// import WishlistSummaryPage from "./pages/WishlistSummaryPage.jsx";
// import AdminCategoryPage from "./pages/AdminCategoryPage.jsx";
// import AdminPageCategoryPage from "./pages/AdminPageCategoryPage.jsx";
// import AdminBannerPage from "./pages/AdminBannerPage.jsx";
// import CouponManagePage from "./pages/CouponManagePage.jsx";
// import CouponForm from "./pages/cuponform.jsx";
// import CouponListPage from "./pages/CouponListPage.jsx";

// const AppLayout = () => {
//     const location = useLocation();
//     const isAdminRoute = location.pathname.startsWith('/admin');

//     return (
//         <>
//             <Header />
//             {/* ✅ সমাধান: এই লাইনটিই BottomNav-এর জন্য জায়গা তৈরি করে, যাতে কন্টেন্ট এর পেছনে না যায় */}
//             <main className="min-h-screen pb-20 md:pb-0">
//                 <Outlet />
//             </main>
//             {!isAdminRoute && <Footer />}
//             {!isAdminRoute && <BottomNav />}
//         </>
//     );
// };

// const App = () => {
//     return (
//         <Routes>
//             <Route element={<AppLayout />}>
//                 {/* --- Public Routes --- */}
//                 <Route path="/" element={<HomePage />} />
//                 <Route path="/search" element={<SearchResultsPage />} />
//                 <Route path="/page-category/:pageCategoryName" element={<CategoryProductsPage />} />
//                 <Route path="/category/:categorySlug" element={<CategoryProductsPage />} />
//                 <Route path="/product/:id" element={<ProductDetailsPage />} />
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/register" element={<RegisterPage />} />
//                 <Route path="/cart" element={<CartPage />} />

//                 {/* --- Protected Routes (for logged-in users) --- */}
//                 <Route element={<ProtectedRoute />}>
//                     <Route path="/checkout" element={<CheckoutPage />} />
//                     <Route path="/shipping-address" element={<ShippingPage />} />
//                     <Route path="/order-success" element={<OrderSuccessPage />} />
//                     <Route path="/my-orders" element={<MyOrdersPage />} />
//                     <Route path="/wishlist" element={<WishlistPage />} />
//                     <Route path="/orders/:id" element={<OrderDetailsPage />} />
//                 </Route>

//                 {/* --- Admin Routes --- */}
//                 <Route path="/admin" element={<AdminRoute />}>
//                     <Route index element={<AdminPage />} />
//                     <Route path="products" element={<ProductListPage />} />
//                     <Route path="products/edit/:id" element={<EditProductPage />} />
//                     <Route path="page-categories" element={<AdminPageCategoryPage />} />
//                     <Route path="categories" element={<AdminCategoryPage />} />
//                     <Route path="banners" element={<AdminBannerPage />} />
//                     <Route path="orders" element={<OrderListPage />} />
//                     <Route path="orders/:id" element={<OrderDetailsPage />} />
//                     <Route path="users" element={<UserListPage />} />
//                     <Route path="wishlist-summary" element={<WishlistSummaryPage />} />
//                     <Route path="coupons" element={<CouponManagePage />} />
//                     <Route path="coupons/create" element={<CouponForm />} />
//                     <Route path="coupons/list" element={<CouponListPage />} />
//                 </Route>

//                 <Route path="*" element={<NotFoundPage />} />
//             </Route>
//         </Routes>
//     );
// };

// export default App;


import React, { useEffect } from "react"; // <<< ১. এখানে useEffect ইম্পোর্ট করা হয়েছে
import { Routes, Route, Outlet, useLocation } from "react-router-dom";

// Layout & Protection Components
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import BottomNav from "./components/BottomNav.jsx";

// Page Components
import HomePage from "./pages/HomePage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ShippingPage from "./pages/ShippingPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx"; 
import CategoryProductsPage from "./pages/CategoryProductsPage.jsx";
import SearchResultsPage from "./pages/SearchResultsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Admin Page Components
import AdminPage from "./pages/AdminPage.jsx";
import UserListPage from "./pages/UserListPage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import EditProductPage from "./pages/EditProductPage.jsx";
import OrderListPage from "./pages/OrderListPage.jsx";
import WishlistSummaryPage from "./pages/WishlistSummaryPage.jsx";
import AdminCategoryPage from "./pages/AdminCategoryPage.jsx";
import AdminPageCategoryPage from "./pages/AdminPageCategoryPage.jsx";
import AdminBannerPage from "./pages/AdminBannerPage.jsx";
import CouponManagePage from "./pages/CouponManagePage.jsx";
import CouponForm from "./pages/cuponform.jsx";
import CouponListPage from "./pages/CouponListPage.jsx";

const AppLayout = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    // <<< ২. এই কোডটুকু যোগ করা হয়েছে >>>
    // এই useEffect হুকটি React Router-কে বলে যে
    // যখনই location.pathname (অর্থাৎ, URL) পরিবর্তন হবে,
    // পেজটিকে তৎক্ষণাৎ (0, 0) পজিশনে স্ক্রল করতে হবে।
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]); // <-- এই হুকটি location.pathname পরিবর্তন হলেই চলবে

    return (
        <>
            <Header />
            {/* ✅ সমাধান: এই লাইনটিই BottomNav-এর জন্য জায়গা তৈরি করে, যাতে কন্টেন্ট এর পেছনে না যায় */}
            <main className="min-h-screen pb-20 md:pb-0">
                <Outlet />
            </main>
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <BottomNav />}
        </>
    );
};

const App = () => {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                {/* --- Public Routes --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/page-category/:pageCategoryName" element={<CategoryProductsPage />} />
                <Route path="/category/:categorySlug" element={<CategoryProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<CartPage />} />

                {/* --- Protected Routes (for logged-in users) --- */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/shipping-address" element={<ShippingPage />} />
                    <Route path="/order-success" element={<OrderSuccessPage />} />
                    <Route path="/my-orders" element={<MyOrdersPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/orders/:id" element={<OrderDetailsPage />} />
                </Route>

                {/* --- Admin Routes --- */}
                <Route path="/admin" element={<AdminRoute />}>
                    <Route index element={<AdminPage />} />
                    <Route path="products" element={<ProductListPage />} />
                    <Route path="products/edit/:id" element={<EditProductPage />} />
                    <Route path="page-categories" element={<AdminPageCategoryPage />} />
                    <Route path="categories" element={<AdminCategoryPage />} />
                    <Route path="banners" element={<AdminBannerPage />} />
                    <Route path="orders" element={<OrderListPage />} />
                    <Route path="orders/:id" element={<OrderDetailsPage />} />
                    <Route path="users" element={<UserListPage />} />
                    <Route path="wishlist-summary" element={<WishlistSummaryPage />} />
                    <Route path="coupons" element={<CouponManagePage />} />
                    <Route path="coupons/create" element={<CouponForm />} />
                    <Route path="coupons/list" element={<CouponListPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
};

export default App;