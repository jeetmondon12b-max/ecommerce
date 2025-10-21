import React, { useEffect } from 'react'; // <<< ১. useEffect ইম্পোর্ট করা হয়েছে
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { FiTag, FiCalendar, FiLoader, FiAlertCircle, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig.js'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

// API থেকে কুপন আনার ফাংশন
const fetchCoupons = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    // ✅ পরিবর্তন: API URL এখন ডাইনামিক
    const { data } = await axios.get(`${API_URL}/api/coupons`, config);
    return data || [];
};

// কুপন ডিলেট করার জন্য নতুন async ফাংশন
const deleteCouponAPI = async ({ couponId, token }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    // ✅ পরিবর্তন: API URL এখন ডাইনামিক
    await axios.delete(`${API_URL}/api/coupons/${couponId}`, config);
};

const CouponListPage = () => {
    const { userInfo } = useAuth();
    const queryClient = useQueryClient();

    // <<< ২. এই কোডটুকু যোগ করা হয়েছে >>>
    // এই useEffect হুকটি নিশ্চিত করে যে পেজটি লোড হওয়ামাত্র
    // এটি ব্যবহারকারীকে পেজের একদম উপরে নিয়ে যাবে।
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // <-- [] মানে এই ইফেক্ট শুধু একবারই (পেজ লোডের সময়) চলবে

    const { data: coupons, isLoading, isError, error } = useQuery({
        queryKey: ['coupons'],
        queryFn: () => fetchCoupons(userInfo.token),
        enabled: !!userInfo,
    });

    // ডিলেট অপারেশনের জন্য useMutation হুক
    const deleteMutation = useMutation({
        mutationFn: deleteCouponAPI,
        onSuccess: () => {
            toast.success('Coupon deleted successfully!');
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to delete coupon.');
        },
    });

    // ডিলেট বাটনে ক্লিক করলে এই ফাংশনটি কল হবে
    const handleDelete = (couponId) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            deleteMutation.mutate({ couponId, token: userInfo.token });
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

    if (isLoading) {
        return <div className="flex justify-center p-10"><FiLoader className="text-4xl text-indigo-500 animate-spin" /></div>;
    }

    if (isError) {
        return <div className="p-10 font-semibold text-center text-red-500"><FiAlertCircle className="inline mr-2" />Error: {error.message}</div>;
    }

    return (
        <div className="p-6 bg-white shadow-lg sm:p-8 rounded-2xl">
            <h1 className="pb-4 mb-6 text-3xl font-bold text-gray-800 border-b">Active Coupons ({coupons?.length || 0})</h1>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="hidden bg-gray-50 md:table-header-group">
                        <tr>
                            <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 uppercase">Code</th>
                            <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 uppercase">Discount</th>
                            <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 uppercase">Min. Purchase</th>
                            <th className="px-4 py-3 text-sm font-semibold text-center text-gray-600 uppercase">Usage</th>
                            <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 uppercase">Dates</th>
                            <th className="px-4 py-3 text-sm font-semibold text-center text-gray-600 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons && coupons.map(coupon => (
                            <tr key={coupon._id} className="block mb-4 border rounded-lg shadow-md md:table-row md:mb-0 md:border-none md:shadow-none">
                                <td className="flex items-center justify-between p-4 border-b md:table-cell md:border-b-0">
                                    <span className="font-bold md:hidden">Code:</span>
                                    <div className="flex items-center gap-2">
                                        <FiTag className="text-indigo-500" />
                                        <span className="px-2 py-1 font-mono font-bold text-indigo-700 bg-indigo-100 rounded-md">{coupon.code}</span>
                                    </div>
                                </td>
                                <td className="flex items-center justify-between p-4 border-b md:table-cell md:border-b-0">
                                    <span className="font-bold md:hidden">Discount:</span>
                                    <span className="font-semibold text-green-600">৳{coupon.discount}</span>
                                </td>
                                <td className="flex items-center justify-between p-4 border-b md:table-cell md:border-b-0">
                                    <span className="font-bold md:hidden">Min. Purchase:</span>
                                    <span className="text-gray-600">৳{coupon.minimumAmount}</span>
                                </td>
                                <td className="flex items-center justify-between p-4 border-b md:table-cell md:text-center md:border-b-0">
                                    <span className="font-bold md:hidden">Usage:</span>
                                    <span>{coupon.timesUsed} / {coupon.usageLimit}</span>
                                </td>
                                <td className="flex items-center justify-between p-4 border-b md:table-cell md:border-b-0">
                                    <span className="font-bold md:hidden">Dates:</span>
                                    <div className="flex flex-col text-right md:text-left">
                                        <span className="text-xs text-gray-500">Created: {formatDate(coupon.createdAt)}</span>
                                        <span className="text-xs font-semibold text-red-600">Expires: {formatDate(coupon.expiresAt)}</span>
                                    </div>
                                </td>
                                <td className="flex items-center justify-between p-4 md:table-cell md:text-center">
                                    <span className="font-bold md:hidden">Action:</span>
                                    <button 
                                        onClick={() => handleDelete(coupon._id)}
                                        disabled={deleteMutation.isPending}
                                        className="p-2 text-red-500 transition-colors rounded-full hover:text-red-700 disabled:text-gray-300 hover:bg-red-50" 
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
                    <div className="py-12 text-center text-gray-500">
                        <p>No active coupons found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CouponListPage;