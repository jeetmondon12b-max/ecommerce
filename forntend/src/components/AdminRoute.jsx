import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { userInfo } = useAuth();

    // Check if user is logged in and has the 'admin' role
    if (userInfo && userInfo.role === 'admin') {
        return <Outlet />; // If admin, render the child component (e.g., AdminPage)
    } else {
        // If not an admin, redirect to the login page
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;