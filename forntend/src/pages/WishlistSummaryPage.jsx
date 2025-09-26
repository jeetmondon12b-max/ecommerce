import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { FiHeart, FiLoader } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

// ✅ মোবাইল ডিভাইসের জন্য কার্ড কম্পোনেন্ট
const SummaryCard = ({ item, rank }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
            <Link to={`/product/${item.product._id}`} className="flex items-center gap-4 flex-grow min-w-0">
                <span className="font-bold text-lg text-gray-500 w-6 text-center">{rank}.</span>
                <img 
                    src={`http://localhost:5000${item.product.image}`} 
                    alt={item.product.name} 
                    className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                />
                <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate" title={item.product.name}>{item.product.name}</p>
                    <p className="text-xs text-gray-400 font-mono">ID: ...{item.product._id.slice(-6)}</p>
                </div>
            </Link>
            <div className="text-center ml-4 flex-shrink-0">
                <p className="font-bold text-xl text-indigo-600">{item.wishlistCount}</p>
                <p className="text-xs text-gray-500">Likes</p>
            </div>
        </div>
    </div>
);

const WishlistSummaryPage = () => {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchSummary = async () => {
            if (!userInfo || userInfo.role !== 'admin') {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('/api/wishlist/summary', config);
                setSummary(data);
            } catch (error) {
                toast.error("Could not load wishlist summary.");
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [userInfo]);
    
    if (loading) {
        return <div className="flex justify-center items-center p-10"><FiLoader className="animate-spin text-2xl text-indigo-500" /></div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <Toaster position="top-center" />
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FiHeart className="text-red-500"/> Wishlist Summary
                </h1>
                <p className="text-gray-600 mt-2">Here are the most wishlisted products by customers, indicating high demand.</p>
            </div>

            {summary.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No products have been wishlisted yet.</p>
                </div>
            ) : (
                <>
                    {/* ডেস্কটপ ভিউ: টেবিল */}
                    <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600 w-16">#</th>
                                    <th className="p-4 text-left text-sm font-semibold text-gray-600">Product</th>
                                    <th className="p-4 text-center text-sm font-semibold text-gray-600">Times Wishlisted</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.map((item, index) => (
                                    <tr key={item.product._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-500">{index + 1}</td>
                                        <td className="p-4">
                                            <Link to={`/product/${item.product._id}`} className="flex items-center gap-4 hover:underline">
                                                <img src={`http://localhost:5000${item.product.image}`} alt={item.product.name} className="w-16 h-16 object-cover rounded-md"/>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{item.product.name}</p>
                                                    <p className="text-xs text-gray-500 font-mono">ID: {item.product._id}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-bold text-xl text-indigo-600">{item.wishlistCount}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* মোবাইল ভিউ: কার্ড লিস্ট */}
                    <div className="md:hidden space-y-3">
                        {summary.map((item, index) => (
                           <SummaryCard key={item.product._id} item={item} rank={index + 1} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default WishlistSummaryPage;