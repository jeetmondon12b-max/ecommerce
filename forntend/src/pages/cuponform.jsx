import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

const CouponForm = () => {
    const [couponData, setCouponData] = useState({
        code: '',
        discount: '',
        minimumAmount: '',
        expiresAt: '',
        usageLimit: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const { userInfo } = useAuth();

    const handleCouponChange = (e) => {
        setCouponData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCouponSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // ✅ পরিবর্তন: API URL এখন ডাইনামিক। localhost-এর পরিবর্তে API_URL ব্যবহার করা হয়েছে।
        const apiCall = axios.post(
            `${API_URL}/api/coupons`,
            {
                ...couponData,
                code: couponData.code.toUpperCase(), // Ensure code is uppercase
            },
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );

        toast.promise(apiCall, {
            loading: 'Creating coupon...',
            success: (res) => {
                setCouponData({ // Reset form on success
                    code: '',
                    discount: '',
                    minimumAmount: '',
                    expiresAt: '',
                    usageLimit: '',
                });
                return `Coupon "${res.data.coupon.code}" created successfully!`;
            },
            error: (err) => err.response?.data?.message || 'Failed to create coupon.',
        }).finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg mt-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create New Coupon</h2>
            <form onSubmit={handleCouponSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                        <input
                            name="code"
                            value={couponData.code}
                            onChange={handleCouponChange}
                            placeholder="e.g., EID2025"
                            className="w-full border rounded-lg px-4 py-2 uppercase"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount (৳)</label>
                        <input
                            name="discount"
                            type="number"
                            value={couponData.discount}
                            onChange={handleCouponChange}
                            placeholder="e.g., 100"
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Purchase (৳)</label>
                        <input
                            name="minimumAmount"
                            type="number"
                            value={couponData.minimumAmount}
                            onChange={handleCouponChange}
                            placeholder="e.g., 999"
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                        <input
                            name="usageLimit"
                            type="number"
                            value={couponData.usageLimit}
                            onChange={handleCouponChange}
                            placeholder="e.g., 50"
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
                        <input
                            name="expiresAt"
                            type="date"
                            value={couponData.expiresAt}
                            onChange={handleCouponChange}
                            className="w-full border rounded-lg px-4 py-2"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700 disabled:bg-green-400"
                >
                    {submitting ? 'Creating...' : 'Create Coupon'}
                </button>
            </form>
        </div>
    );
};

export default CouponForm;
