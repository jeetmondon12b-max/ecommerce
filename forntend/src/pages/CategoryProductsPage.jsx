import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../apiConfig';
import ProductCard from '../components/ProductCard';

const fetchCategoryProducts = async ({ queryKey }) => {
    const [, categoryInfo, page] = queryKey;
    
    const params = new URLSearchParams({
        page: page,
        limit: 12,
    });

    if (categoryInfo.type === 'pageCategory' && categoryInfo.value) {
        params.append('pageCategory', categoryInfo.value);
    } else if (categoryInfo.type === 'categorySlug' && categoryInfo.value) {
        params.append('category', categoryInfo.value);
    }

    const { data } = await axios.get(`${API_URL}/api/products?${params.toString()}`);
    return data;
};

const CategoryProductsPage = () => {
    const { pageCategoryName, categorySlug } = useParams();
    const [currentPage, setCurrentPage] = useState(1);

    const categoryInfo = useMemo(() => {
        if (pageCategoryName) return { type: 'pageCategory', value: decodeURIComponent(pageCategoryName) };
        if (categorySlug) return { type: 'categorySlug', value: decodeURIComponent(categorySlug) };
        return { type: null, value: 'All' };
    }, [pageCategoryName, categorySlug]);

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ['category-products', categoryInfo, currentPage],
        queryFn: fetchCategoryProducts,
        keepPreviousData: true,
        staleTime: 1000 * 60 * 2,
    });
    
    useEffect(() => {
        setCurrentPage(1);
        window.scrollTo(0, 0);
    }, [categoryInfo.value]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (data?.pages || 1)) {
            setCurrentPage(newPage);
            window.scrollTo(0, 0);
        }
    };
    
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading products...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return <p className="text-center text-red-500 py-20">Failed to load products.</p>;
    }

    const { products = [], totalProducts = 0, totalPages = 1 } = data || {};

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Products in {categoryInfo.value}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Showing {products.length} of {totalProducts} products
                        </p>
                    </div>
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>

            {products.length > 0 ? (
                <>
                    <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                        {/* ✅ ফিক্স: মোবাইলের জন্য 'grid-cols-1' কে 'grid-cols-2' করা হয়েছে */}
                        {/* এবং ছোট ডিভাইসের জন্য gap কমানো হয়েছে। */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isFetching} className="px-4 py-2 font-semibold bg-white rounded-lg disabled:opacity-50 hover:bg-gray-100 border">
                                Previous
                            </button>
                            {/* Pagination buttons can be rendered here if needed */}
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isFetching} className="px-4 py-2 font-semibold bg-white rounded-lg disabled:opacity-50 hover:bg-gray-100 border">
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20">
                    <div className="text-gray-400 text-6xl mb-4">😔</div>
                    <p className="text-gray-500 text-lg mb-4">No products found in this category.</p>
                    <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Back to Home
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CategoryProductsPage;  