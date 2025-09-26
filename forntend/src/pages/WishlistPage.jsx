import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiLoader } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();

    const fetchWishlist = async () => {
        if (!userInfo) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/wishlist/mywishlist', config);
            setWishlist(data);
        } catch (error) {
            toast.error("Could not load your wishlist.");
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
            await axios.delete(`/api/wishlist/${productId}`, config);
            // Optimistic UI update
            setWishlist((prev) => prev.filter(item => item.product._id !== productId));
        };

        toast.promise(promise(), {
            loading: 'Removing item...',
            success: 'Item removed from wishlist!',
            error: 'Could not remove item.',
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center p-20"><FiLoader className="animate-spin text-2xl text-indigo-500" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto my-8 p-4">
            <Toaster position="top-center" />
            <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">My Wishlist</h1>
            {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <FiHeart className="mx-auto text-5xl text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">Your wishlist is empty.</h2>
                    <p className="text-gray-500 mt-2">Add your favourite items here to keep track of them.</p>
                    <Link to="/" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                        Discover Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {wishlist.map(({ product }) => (
                         <div key={product._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-lg transition-shadow">
                            <Link to={`/product/${product._id}`} className="flex items-center gap-4 w-full">
                                <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0"/>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-lg text-gray-800 break-words">{product.name}</h3>
                                    <p className="text-indigo-600 font-semibold">৳{product.discountPrice || product.regularPrice}</p>
                                </div>
                            </Link>
                            <button 
                                onClick={() => handleRemove(product._id)} 
                                className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors"
                                title="Remove from wishlist"
                            >
                                <FiTrash2 size={18} />
                                <span className="sm:hidden font-semibold">Remove</span>
                            </button>
                         </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;