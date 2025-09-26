import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const CouponForm = () => {
    const [couponData, setCouponData] = useState({
        code: '',
        discount: '',
        minimumAmount: '',
        expiresAt: '',
        usageLimit: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { userInfo } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const processedValue = name === 'code' ? value.toUpperCase() : value;
        setCouponData(prev => ({ ...prev, [name]: processedValue }));
    };

    // This function will contain the actual API call logic
    const createCoupon = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading('Creating coupon...');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const response = await axios.post('http://localhost:5000/api/coupons', couponData, config);
            
            toast.success(response.data.message || 'Coupon created successfully!', { id: toastId });
            setCouponData({ code: '', discount: '', minimumAmount: '', expiresAt: '', usageLimit: '' });

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create coupon.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Show a confirmation toast before creating
        toast((t) => (
            <div className="flex flex-col items-center gap-4 p-2">
                <p className="font-semibold text-gray-800">Are you sure you want to create this coupon?</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            createCoupon();
                        }}
                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 6000, // Keep the toast open longer for user action
        });
    };

    return (
        // Added responsive padding and text sizes
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-2xl mx-auto">
            <Toaster position="top-center" />
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Create Coupon</h2>
                <p className="text-gray-500">Generate a new discount coupon for your store.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-1">Coupon Code</label>
                    <input type="text" name="code" id="code" value={couponData.code} onChange={handleChange} placeholder="e.g., EID2025" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>

                {/* Grid for inputs, stacks on mobile (grid-cols-1) and becomes 2 columns on medium screens and up */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="discount" className="block text-sm font-semibold text-gray-700 mb-1">Discount Value (৳)</label>
                        <input type="number" name="discount" id="discount" value={couponData.discount} onChange={handleChange} placeholder="e.g., 150" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="minimumAmount" className="block text-sm font-semibold text-gray-700 mb-1">Minimum Purchase (৳)</label>
                        <input type="number" name="minimumAmount" id="minimumAmount" value={couponData.minimumAmount} onChange={handleChange} placeholder="e.g., 999" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="expiresAt" className="block text-sm font-semibold text-gray-700 mb-1">Expiry Date</label>
                        <input type="date" name="expiresAt" id="expiresAt" value={couponData.expiresAt} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="usageLimit" className="block text-sm font-semibold text-gray-700 mb-1">Total Usage Limit</label>
                        <input type="number" name="usageLimit" id="usageLimit" value={couponData.usageLimit} onChange={handleChange} placeholder="e.g., 100" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                </div>
                
                <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Creating...' : 'Create Coupon'}
                </button>
            </form>
        </div>
    );
};

export default CouponForm;