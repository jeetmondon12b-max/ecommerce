import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';
import { API_URL } from '../apiConfig';
import useInfiniteScroll from '../hooks/useInfiniteScroll.js';
import ProductCard from './ProductCard.jsx';

// প্রোডাক্ট লোড হওয়ার সময় দেখানোর জন্য স্কেলেটন কম্পোনেন্ট
const ProductSkeleton = () => (
    <div className="border border-gray-200 rounded-xl p-3 animate-pulse">
        <div className="bg-gray-200 aspect-square w-full rounded-lg"></div>
        <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
);

const ProductModal = ({ categorySlug, categoryName, isOpen, onClose }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // মডাল খোলা বা বন্ধ হলে ব্যাকগ্রাউন্ড স্ক্রলিং নিয়ন্ত্রণ
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // ✅✅✅ মূল পরিবর্তন এখানে ✅✅✅
    // এখন থেকে মডালটি যতবার খোলা হবে (isOpen = true), ততবার ভেতরের ডেটা রিসেট হয়ে যাবে
    useEffect(() => {
        if (isOpen) {
            setProducts([]);
            setPage(1);
            setHasMore(true);
        }
    }, [isOpen, categorySlug]);

    const loadMoreProducts = useCallback(async () => {
        // পেজ ১ না হলে আর লোড করার কিছু না থাকলে ফাংশন চলবে না
        if (page > 1 && (loading || !hasMore)) return;
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_URL}/api/products?category=${categorySlug}&page=${page}&limit=10`);
            setProducts(prev => [...prev, ...data.products]);
            setPage(prev => prev + 1);
            setHasMore(data.page < data.pages);
        } catch (error) {
            console.error("Failed to load products in modal", error);
        } finally {
            setLoading(false);
        }
    }, [categorySlug, page, loading, hasMore]);
    
    // প্রথমবার প্রোডাক্ট লোড করার জন্য
    useEffect(() => {
        if (isOpen && page === 1) {
             loadMoreProducts();
        }
    }, [isOpen, page, loadMoreProducts]);
    
    const lastProductElementRef = useInfiniteScroll(loadMoreProducts, hasMore, loading);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">{categoryName}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full">
                        <FiX size={26} />
                    </button>
                </div>

                {/* Modal Body with Infinite Scroll */}
                <div className="flex-grow overflow-y-auto p-6">
                    {products.length === 0 && loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                           {Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {products.map((product, index) => (
                                <div ref={products.length === index + 1 ? lastProductElementRef : null} key={`${product._id}-${index}`}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                     {loading && products.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
                           {Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)}
                        </div>
                    )}
                    {!loading && !hasMore && products.length > 0 && <p className="text-center text-gray-500 mt-8">You've seen it all!</p>}
                </div>
            </div>
        </div>
    );
};

export default ProductModal;