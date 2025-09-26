import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { userInfo } = useAuth();

    // চেক করা হচ্ছে ইউজার লগইন করা আছে কিনা
    if (userInfo) {
        // যদি ইউজার লগইন করা থাকে, তাহলে তাকে সেই পেজটি দেখতে দেওয়া হবে।
        // <Outlet /> কম্পোনেন্টটি চাইল্ড রুটগুলোকে (e.g., MyOrdersPage) রেন্ডার করে।
        return <Outlet />;
    } else {
        // যদি ইউজার লগইন করা না থাকে, তাকে লগইন পেজে পাঠিয়ে দেওয়া হবে।
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;