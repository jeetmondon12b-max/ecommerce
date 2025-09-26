// src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// ✅ FiTag আইকনটি এখানে ইম্পোর্ট করা হয়েছে
import { FiUsers, FiShoppingBag, FiPackage, FiPlusCircle, FiList, FiLayers, FiImage, FiLoader, FiAlertCircle, FiTag } from 'react-icons/fi';

// একটি কার্ড ডিজাইন করার জন্য ছোট কম্পোনেন্ট
const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 border-l-4 ${color} transition-transform transform hover:scale-105`}>
        <div className="text-3xl text-gray-500">{icon}</div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

// দ্রুত অ্যাক্সেসের জন্য লিংক কম্পোনেন্ট
const ActionLink = ({ to, icon, title, color }) => (
    <Link to={to} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex flex-col items-center justify-center hover:shadow-lg">
        <div className={`text-4xl mb-2 ${color}`}>{icon}</div>
        <span className="font-semibold text-gray-700">{title}</span>
    </Link>
);

const AdminPage = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('/api/admin/stats', config);
                setStats(data);
            } catch (err) {
                setError('Failed to load dashboard data. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userInfo && userInfo.token) {
            fetchStats();
        }
    }, [userInfo]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FiLoader className="animate-spin text-4xl text-blue-500" />
                <p className="ml-4 text-lg">Loading Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                <FiAlertCircle className="text-4xl" />
                <p className="ml-4 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto space-y-12">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    Admin Dashboard
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link to="/admin/users">
                        <StatCard title="Total Users" value={stats.totalUsers} icon={<FiUsers />} color="border-blue-500" />
                    </Link>
                    <Link to="/admin/orders">
                        <StatCard title="Total Orders" value={stats.totalOrders} icon={<FiShoppingBag />} color="border-green-500" />
                    </Link>
                    <Link to="/admin/products">
                        <StatCard title="Total Products" value={stats.totalProducts} icon={<FiPackage />} color="border-purple-500" />
                    </Link>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                        <ActionLink to="/admin/products/edit/new" icon={<FiPlusCircle />} title="Add Product" color="text-green-500" />
                        <ActionLink to="/admin/orders" icon={<FiShoppingBag />} title="Manage Orders" color="text-blue-500" />
                        
                        {/* ✅ কুপনের জন্য নতুন ActionLink যোগ করা হয়েছে */}
                        <ActionLink to="/admin/coupons" icon={<FiTag />} title="Manage Coupons" color="text-orange-500" />
                        
                        <ActionLink to="/admin/page-categories" icon={<FiLayers />} title="Page Categories" color="text-purple-500" />
                        <ActionLink to="/admin/categories" icon={<FiList />} title="Product Categories" color="text-yellow-500" />
                        <ActionLink to="/admin/banners" icon={<FiImage />} title="Manage Banners" color="text-pink-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;