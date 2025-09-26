import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// Layout & Protection Components
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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

// ✅ কুপন সম্পর্কিত নতুন এবং পুরোনো পেজগুলো ইম্পোর্ট করা হয়েছে
import CouponForm from "./pages/cuponform.jsx"; 
import CouponManagePage from "./pages/CouponManagePage.jsx";
import CouponListPage from "./pages/CouponListPage.jsx";

const AppLayout = () => {
    return (
        <>
            <Header />
            <main className="container mx-auto p-4 sm:p-6 pb-24 md:pb-6">
                <Outlet />
            </main>
            <BottomNav />
        </>
    );
};

const App = () => {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                {/* --- Public Routes --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/page/:pageCategoryName" element={<CategoryProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<CartPage />} />

                {/* --- Protected Routes --- */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/shipping-address" element={<ShippingPage />} />
                    <Route path="/order-success" element={<OrderSuccessPage />} />
                    <Route path="/my-orders" element={<MyOrdersPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
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

                    {/* ✅ কুপনের জন্য নতুন রাউটিং সিস্টেম যোগ করা হয়েছে */}
                    <Route path="coupons" element={<CouponManagePage />} />
                    <Route path="coupons/create" element={<CouponForm />} />
                    <Route path="coupons/list" element={<CouponListPage />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;

