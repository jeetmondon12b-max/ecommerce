import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiList } from 'react-icons/fi';

const CouponManagePage = () => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Coupon Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <Link 
                    to="/admin/coupons/create" 
                    className="group flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl hover:bg-indigo-100 transition-all duration-300 hover:shadow-xl"
                >
                    <FiPlusCircle className="text-5xl text-indigo-500 group-hover:scale-110 transition-transform" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-700">Create New Coupon</h2>
                    <p className="text-sm text-gray-500 mt-1">Add a new discount coupon for customers.</p>
                </Link>
                <Link 
                    to="/admin/coupons/list" 
                    className="group flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl hover:bg-green-100 transition-all duration-300 hover:shadow-xl"
                >
                    <FiList className="text-5xl text-green-500 group-hover:scale-110 transition-transform" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-700">View Coupon List</h2>
                    <p className="text-sm text-gray-500 mt-1">See all active coupons and their details.</p>
                </Link>
            </div>
        </div>
    );
};

export default CouponManagePage;