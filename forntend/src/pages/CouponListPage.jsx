import React from 'react';
// ✅ useMutation ও useQueryClient ইম্পোর্ট করুন
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { FiTag, FiCalendar, FiLoader, FiAlertCircle, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast'; // ✅ toast নোটিফিকেশনের জন্য

// API থেকে কুপন আনার ফাংশন (অপরিবর্তিত)
const fetchCoupons = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await axios.get('http://localhost:5000/api/coupons', config);
    return data || [];
};

// ✅ কুপন ডিলেট করার জন্য নতুন async ফাংশন
const deleteCouponAPI = async ({ couponId, token }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`http://localhost:5000/api/coupons/${couponId}`, config);
};

const CouponListPage = () => {
    const { userInfo } = useAuth();
    const queryClient = useQueryClient(); // ✅ QueryClient Instance

    const { data: coupons, isLoading, isError, error } = useQuery({
        queryKey: ['coupons'],
        queryFn: () => fetchCoupons(userInfo.token),
        enabled: !!userInfo,
    });

    // ✅ ডিলেট অপারেশনের জন্য useMutation হুক
    const deleteMutation = useMutation({
        mutationFn: deleteCouponAPI,
        onSuccess: () => {
            toast.success('Coupon deleted successfully!');
            // ডিলেট সফল হলে কুপন লিস্ট রিফ্রেশ করার জন্য কোয়েরি ইনভ্যালিডেট করা হচ্ছে
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to delete coupon.');
        },
    });

    // ✅ ডিলেট বাটনে ক্লিক করলে এই ফাংশনটি কল হবে
    const handleDelete = (couponId) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            deleteMutation.mutate({ couponId, token: userInfo.token });
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

    if (isLoading) {
        return <div className="flex justify-center p-10"><FiLoader className="animate-spin text-4xl text-indigo-500" /></div>;
    }

    if (isError) {
        return <div className="text-center p-10 font-semibold text-red-500"><FiAlertCircle className="inline mr-2" />Error: {error.message}</div>;
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b">Active Coupons ({coupons?.length || 0})</h1>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50 hidden md:table-header-group">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Code</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Discount</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Min. Purchase</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Usage</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Dates</th>
                            {/* ✅ Action কলাম যোগ করা হয়েছে */}
                            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons && coupons.map(coupon => (
                            <tr key={coupon._id} className="block md:table-row mb-4 md:mb-0 border md:border-none rounded-lg shadow-md md:shadow-none">
                                {/* ... অন্যান্য কলাম অপরিবর্তিত থাকবে ... */}
                                <td className="p-4 flex justify-between items-center md:table-cell border-b md:border-b-0">
                                    <span className="font-bold md:hidden">Code:</span>
                                    <div className="flex items-center gap-2">
                                        <FiTag className="text-indigo-500" />
                                        <span className="font-mono bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-bold">{coupon.code}</span>
                                    </div>
                                </td>
                                <td className="p-4 flex justify-between items-center md:table-cell border-b md:border-b-0">
                                    <span className="font-bold md:hidden">Discount:</span>
                                    <span className="font-semibold text-green-600">৳{coupon.discount}</span>
                                </td>
                                <td className="p-4 flex justify-between items-center md:table-cell border-b md:border-b-0">
                                    <span className="font-bold md:hidden">Min. Purchase:</span>
                                    <span className="text-gray-600">৳{coupon.minimumAmount}</span>
                                </td>
                                <td className="p-4 flex justify-between items-center md:table-cell md:text-center border-b md:border-b-0">
                                    <span className="font-bold md:hidden">Usage:</span>
                                    <span>{coupon.timesUsed} / {coupon.usageLimit}</span>
                                </td>
                                <td className="p-4 flex justify-between items-center md:table-cell border-b md:border-b-0">
                                    <span className="font-bold md:hidden">Dates:</span>
                                    <div className="flex flex-col text-right md:text-left">
                                        <span className="text-xs text-gray-500">Created: {formatDate(coupon.createdAt)}</span>
                                        <span className="text-xs font-semibold text-red-600">Expires: {formatDate(coupon.expiresAt)}</span>
                                    </div>
                                </td>
                                {/* ✅ Action/Delete বাটন যোগ করা হয়েছে */}
                                <td className="p-4 flex justify-between items-center md:table-cell md:text-center">
                                    <span className="font-bold md:hidden">Action:</span>
                                    <button 
                                        onClick={() => handleDelete(coupon._id)}
                                        disabled={deleteMutation.isPending}
                                        className="text-red-500 hover:text-red-700 disabled:text-gray-300 transition-colors p-2 rounded-full hover:bg-red-50" 
                                        title="Delete Coupon"
                                    >
                                        <FiTrash2 size={20}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {coupons?.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-gray-500">
                        <p>No active coupons found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CouponListPage;