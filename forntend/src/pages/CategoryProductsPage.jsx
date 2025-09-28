import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../apiConfig';
import ProductCard from '../components/ProductCard';

const CategoryProductsPage = () => {
    const { pageCategoryName, categorySlug } = useParams();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    
    // ✅ সঠিকভাবে ক্যাটাগরি টাইপ আইডেন্টিফাই করা
    const getCategoryType = () => {
        if (pageCategoryName) return 'pageCategory';
        if (categorySlug) return 'categorySlug';
        return null;
    };

    const getCategoryValue = () => {
        if (pageCategoryName) return decodeURIComponent(pageCategoryName);
        if (categorySlug) return decodeURIComponent(categorySlug);
        return null;
    };

    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
            const categoryType = getCategoryType();
            const categoryValue = getCategoryValue();
            
            let url = `${API_URL}/api/products?page=${page}&limit=12`;
            
            // ✅ সঠিক ক্যাটাগরি প্যারামিটার যোগ করা
            if (categoryType === 'pageCategory') {
                url += `&pageCategory=${encodeURIComponent(categoryValue)}`;
            } else if (categoryType === 'categorySlug') {
                url += `&category=${encodeURIComponent(categoryValue)}`;
            }

            console.log('Fetching products from:', url); // ডিবাগিং জন্য

            const { data } = await axios.get(url);
            setProducts(data.products || []);
            setCurrentPage(data.page || 1);
            setTotalPages(data.pages || 1);
            setTotalProducts(data.total || 0);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setTotalPages(1);
            setTotalProducts(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1);
    }, [pageCategoryName, categorySlug]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchProducts(newPage);
        window.scrollTo(0, 0);
    };

    // ✅ পেজিনেশন বাটন জেনারেটর
    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisibleButtons = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
        
        if (endPage - startPage + 1 < maxVisibleButtons) {
            startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }
        
        // Previous button
        buttons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
                Previous
            </button>
        );
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 rounded ${
                        currentPage === i 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }
        
        // Next button
        buttons.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
                Next
            </button>
        );
        
        return buttons;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* ✅ হেডার সেকশন - ক্যাটাগরি নাম দেখানো */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {pageCategoryName 
                                ? `All ${decodeURIComponent(pageCategoryName)} Products` 
                                : categorySlug 
                                    ? `All Products in ${decodeURIComponent(categorySlug)}` 
                                    : 'All Products'
                            }
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Showing {products.length} of {totalProducts} products
                        </p>
                    </div>
                    <Link 
                        to="/" 
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>

            {/* ✅ প্রোডাক্ট গ্রিড */}
            {products.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {/* ✅ পেজিনেশন */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            {renderPaginationButtons()}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20">
                    <div className="text-gray-400 text-6xl mb-4">😔</div>
                    <p className="text-gray-500 text-lg mb-4">No products found in this category.</p>
                    <Link 
                        to="/" 
                        className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CategoryProductsPage;