import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiLoader } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { API_URL } from '../apiConfig.js';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();

    // এই useEffect হুকটি নিশ্চিত করে যে পেজটি লোড হওয়ামাত্র
    // এটি ব্যবহারকারীকে পেজের একদম উপরে নিয়ে যাবে।
    // (আপনার App.jsx ফাইলে এটি থাকার কারণে এই কোডটি এখানে আর প্রয়োজন নেই,
    // তবে থাকলেও কোনো সমস্যা নেই)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // <-- [] মানে এই ইফেক্ট শুধু একবারই (পেজ লোডের সময়) চলবে

    const fetchWishlist = async () => {
        if (!userInfo) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/wishlist/mywishlist`, config);
            setWishlist(data);
        } catch (error) {
            toast.error("Could not load your wishlist.");
            setWishlist([]); // এরর হলে খালি অ্যারে সেট করুন
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [userInfo]);

    const handleRemove = async (productId) => {
        const promise = async () => {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`${API_URL}/api/wishlist/${productId}`, config);
            // Optimistic UI update
            setWishlist((prev) => prev.filter(item => item.product && item.product._id !== productId));
        };

        toast.promise(promise(), {
            loading: 'Removing item...',
            success: 'Item removed from wishlist!',
            error: 'Could not remove item.',
        });
    };

    if (loading) {
        return <div className="flex items-center justify-center p-20"><FiLoader className="text-2xl text-indigo-500 animate-spin" /></div>;
    }

    // <<< ✅ সমাধান ১: এখানে ফিল্টার করা হচ্ছে >>>
    // প্রথমে আমরা null প্রোডাক্ট থাকা আইটেমগুলো বাদ দিচ্ছি
    const validWishlistItems = wishlist.filter(item => item.product);

    return (
        <div className="max-w-4xl p-4 mx-auto my-8">
            <Toaster position="top-center" />
            <h1 className="pb-4 mb-8 text-3xl font-bold text-gray-800 border-b">My Wishlist</h1>
            
            {/* <<< ✅ সমাধান ২: এখানে validWishlistItems.length চেক করা হচ্ছে >>> */}
            {validWishlistItems.length === 0 ? (
                <div className="py-20 text-center rounded-lg bg-gray-50">
                    <FiHeart className="mx-auto mb-4 text-5xl text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-700">Your wishlist is empty.</h2>
                    <p className="mt-2 text-gray-500">Add your favourite items here to keep track of them.</p>
                    <Link to="/" className="inline-block px-6 py-3 mt-6 font-semibold text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        Discover Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* <<< ✅ সমাধান ৩: এখানে validWishlistItems ম্যাপ করা হচ্ছে >>> */}
                    {validWishlistItems.map(({ product }) => (
                         <div key={product._id} className="flex flex-col items-center justify-between gap-4 p-4 transition-shadow bg-white rounded-lg shadow-md sm:flex-row hover:shadow-lg">
                            <Link to={`/product/${product._id}`} className="flex items-center w-full gap-4">
                                <img src={`${API_URL}${product.image}`} alt={product.name} className="flex-shrink-0 object-cover w-20 h-20 rounded-md"/>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-gray-800 break-words">{product.name}</h3>
                                    <p className="font-semibold text-indigo-600">৳{product.discountPrice || product.regularPrice}</p>
                                </div>
                            </Link>
                            <button 
                                onClick={() => handleRemove(product._id)} 
                                className="flex items-center justify-center flex-shrink-0 w-full gap-2 p-2 text-red-500 transition-colors rounded-md sm:w-auto bg-red-50 hover:bg-red-100"
                                title="Remove from wishlist"
                            >
                                <FiTrash2 size={18} />
                                <span className="font-semibold sm:hidden">Remove</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;