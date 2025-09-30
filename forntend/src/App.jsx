// import React from "react";
// import { Routes, Route, Outlet, useLocation } from "react-router-dom";

// // Layout & Protection Components
// import Header from "./components/Header.jsx";
// import Footer from "./components/Footer.jsx";
// import AdminRoute from "./components/AdminRoute.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

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
// import NotFoundPage from "./pages/NotFoundPage.jsx"; // ✅ নতুন পরিবর্তন: NotFoundPage ইম্পোর্ট করা হয়েছে

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
//     const isHomePage = location.pathname === '/';

//     return (
//         <>
//             <Header />
//             <main className="min-h-screen">
//                 <Outlet />
//             </main>
//             {isHomePage && <Footer />}
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
//                 <Route path="/page/:pageCategoryName" element={<CategoryProductsPage />} />
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

//                 {/* ✅ নতুন পরিবর্তন: Not Found রুটটি সবার শেষে যোগ করা হয়েছে */}
//                 {/* এটি অন্য কোনো রুটের সাথে না মিললে প্রদর্শিত হবে */}
//                 <Route path="*" element={<NotFoundPage />} />
//             </Route>
//         </Routes>
//     );
// };

// export default App;





import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";

// Layout & Protection Components
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Page Components (Dynamically imported for Code Splitting)
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.jsx"));
const ShippingPage = lazy(() => import("./pages/ShippingPage.jsx"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage.jsx"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage.jsx"));
const WishlistPage = lazy(() => import("./pages/WishlistPage.jsx"));
const CategoryProductsPage = lazy(() => import("./pages/CategoryProductsPage.jsx"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

// Admin Page Components
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));
const UserListPage = lazy(() => import("./pages/UserListPage.jsx"));
const ProductListPage = lazy(() => import("./pages/ProductListPage.jsx"));
const EditProductPage = lazy(() => import("./pages/EditProductPage.jsx"));
const OrderListPage = lazy(() => import("./pages/OrderListPage.jsx"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage.jsx"));
const WishlistSummaryPage = lazy(() => import("./pages/WishlistSummaryPage.jsx"));
const AdminCategoryPage = lazy(() => import("./pages/AdminCategoryPage.jsx"));
const AdminPageCategoryPage = lazy(() => import("./pages/AdminPageCategoryPage.jsx"));
const AdminBannerPage = lazy(() => import("./pages/AdminBannerPage.jsx"));
const CouponManagePage = lazy(() => import("./pages/CouponManagePage.jsx"));
const CouponForm = lazy(() => import("./pages/cuponform.jsx"));
const CouponListPage = lazy(() => import("./pages/CouponListPage.jsx"));


const LoadingFallback = () => (
    <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

const AppLayout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        // ✅ ফিক্স: '<>' এর পরিবর্তে '<React.Fragment>' ব্যবহার করা হয়েছে
        // এটি আপনার দৃশ্যমান < > চিহ্নগুলোর সমস্যা সমাধান করবে।
        <React.Fragment>
            <Header />
            <main className="min-h-screen">
                <Outlet />
            </main>
            {isHomePage && <Footer />}
        </React.Fragment>
    );
};

const App = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/page/:pageCategoryName" element={<CategoryProductsPage />} />
                    <Route path="/category/:categorySlug" element={<CategoryProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={<CartPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/shipping-address" element={<ShippingPage />} />
                        <Route path="/order-success" element={<OrderSuccessPage />} />
                        <Route path="/my-orders" element={<MyOrdersPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                    </Route>

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
        </Suspense>
    );
};

export default App;