import React, { useState, useEffect } from 'react'; // <<< ১. useEffect ইম্পোর্ট করা হয়েছে
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

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

    // <<< ২. এই কোডটুকু যোগ করা হয়েছে >>>
    // এই useEffect হুকটি নিশ্চিত করে যে পেজটি লোড হওয়ামাত্র
    // এটি ব্যবহারকারীকে পেজের একদম উপরে নিয়ে যাবে।
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // <-- [] মানে এই ইফেক্ট শুধু একবারই (পেজ লোডের সময়) চলবে

    const handleCouponChange = (e) => {
        setCouponData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCouponSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // ✅ পরিবর্তন: API URL এখন ডাইনামিক। localhost-এর পরিবর্তে API_URL ব্যবহার করা হয়েছে।
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
        <div className="p-8 mt-12 bg-white shadow-lg rounded-2xl">
            <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Create New Coupon</h2>
            <form onSubmit={handleCouponSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Coupon Code</label>
                        <input
                            name="code"
                            value={couponData.code}
                            onChange={handleCouponChange}
                            placeholder="e.g., EID2025"
                            className="w-full px-4 py-2 uppercase border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Discount Amount (৳)</label>
                        <input
                            name="discount"
                            type="number"
                            value={couponData.discount}
                            onChange={handleCouponChange}
                            placeholder="e.g., 100"
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Minimum Purchase (৳)</label>
                        <input
                            name="minimumAmount"
                            type="number"
                            value={couponData.minimumAmount}
                            onChange={handleCouponChange}
                            placeholder="e.g., 999"
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Usage Limit</label>
                        <input
                            name="usageLimit"
                            type="number"
                            value={couponData.usageLimit}
                            onChange={handleCouponChange}
                            placeholder="e.g., 50"
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Expires At</label>
                        <input
                            name="expiresAt"
                            type="date"
                            value={couponData.expiresAt}
                            onChange={handleCouponChange}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 text-lg font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:bg-green-400"
                >
                    {submitting ? 'Creating...' : 'Create Coupon'}
                </button>
            </form>
        </div>
    );
};

export default CouponForm;