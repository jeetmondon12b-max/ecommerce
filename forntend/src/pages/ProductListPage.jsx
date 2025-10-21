import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlusCircle, FiAlertCircle, FiChevronLeft, FiChevronRight, FiSearch, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig.js';

const fetchProducts = async (page = 1, search = '') => {
    const { data } = await axios.get(`${API_URL}/api/products`, {
        params: { page, limit: 10, search }
    });
    return data;
};

const deleteProduct = async ({ productId, token }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/api/products/${productId}`, config);
};

// Skeleton Loader for initial loading
const ProductListSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-24 h-8 bg-gray-200 rounded"></div>  
            </div>
        ))}
    </div>
);

const ProductListPage = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // <<< এই কোডটুকু যোগ করা হয়েছে >>>
    // এই useEffect হুকটি নিশ্চিত করে যে পেজটি লোড হওয়ামাত্র
    // এটি ব্যবহারকারীকে পেজের একদম উপরে নিয়ে যাবে।
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // <-- [] মানে এই ইফেক্ট শুধু একবারই (পেজ লোডের সময়) চলবে

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data, isLoading, isError, error, isFetching } = useQuery({
        queryKey: ['products', currentPage, debouncedSearchTerm],
        queryFn: () => fetchProducts(currentPage, debouncedSearchTerm),
        keepPreviousData: true,
    });

    const products = data?.products || [];
    const totalPages = data?.pages || 1;
    const totalProducts = data?.total || 0;

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            toast.success('Product deleted successfully!');
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to delete product.');
        },
    });

    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate({ productId, token: userInfo.token });
        }
    };
    
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 bg-white shadow-lg sm:p-6 rounded-2xl">
                <div className="flex items-center justify-between pb-4 mb-6 border-b">
                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Product Management</h1>
                </div>
                <ProductListSkeleton />
            </div>
        );
    }

    if (isError) {
        return <div className="p-10 font-semibold text-center text-red-500"><FiAlertCircle className="inline mr-2" />Error: {error.message}</div>;
    }

    return (
        <div className="p-4 bg-white shadow-lg sm:p-6 rounded-2xl">
            <div className="flex flex-col items-start justify-between gap-4 pb-4 mb-6 border-b sm:flex-row sm:items-center">
                <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                    Product Management ({totalProducts})
                </h1>
                <Link to="/admin/products/edit/new" className="flex items-center justify-center w-full px-4 py-2 font-semibold text-white transition-colors bg-indigo-600 rounded-lg sm:w-auto hover:bg-indigo-700">
                    <FiPlusCircle className="mr-2" /> Add New Product
                </Link>
            </div>

            <div className="relative mb-6">
                <input 
                    type="text"
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <FiSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            </div>

            <div className={`overflow-x-auto relative transition-opacity duration-300 ${isFetching || deleteMutation.isPending ? 'opacity-50' : 'opacity-100'}`}>
                {(isFetching || deleteMutation.isPending) && <div className="absolute inset-0 z-10 flex items-center justify-center"><FiLoader className="text-3xl text-indigo-500 animate-spin" /></div>}
                <table className="min-w-full bg-white">
                    <thead className="hidden bg-gray-50 md:table-header-group">
                        <tr>
                            <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 uppercase">Product</th>
                            <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 uppercase">Categories</th>
                            <th className="px-4 py-3 text-sm font-semibold text-center text-gray-600 uppercase">Stock</th>
                            <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 uppercase">Price</th>
                            <th className="px-4 py-3 text-sm font-semibold text-center text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 md:divide-y-0">
                        {products.length > 0 ? products.map(product => (
                            <tr key={product._id} className="block mb-4 border rounded-lg shadow-md md:table-row md:mb-0 md:border-none md:rounded-none md:shadow-none">
                                <td className="flex items-center gap-4 p-4 border-b md:border-b-0 md:table-cell">
                                    {/* ✅ মূল পরিবর্তন এখানে (আপনার কোডটি সঠিক ছিলো, পরিষ্কার করা হয়েছে) */}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="object-cover w-16 h-16 border rounded-md"
                                        loading="lazy"
                                        width="64"
                                        height="64"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">{product.name}</div>
                                        <div className="text-sm text-gray-500">{product.brand || 'N/A'}</div>
                                    </div>
                                </td>
                                <td className="flex items-center justify-between p-4 border-b md:border-b-0 md:table-cell">
                                    <span className="font-bold text-gray-600 md:hidden">Categories:</span>
                                    <div className="flex flex-col items-end text-right md:items-start md:text-left">
                                        <span className="font-semibold text-indigo-600">{product.pageCategory}</span>
                                        <span className="mt-1 text-xs text-gray-500">
                                            {product.categories?.map(cat => cat.name).join(', ') || ''}
                                        </span>
                                    </div>
                                </td>
                                <td className="flex items-center justify-between p-4 border-b md:border-b-0 md:table-cell md:text-center">
                                    <span className="font-bold text-gray-600 md:hidden">Stock:</span>
                                    {product.countInStock > 0 ? (
                                        <span className="font-semibold text-green-600">{product.countInStock}</span>
                                    ) : (
                                        <span className="font-semibold text-red-600">Out of Stock</span>
                                    )}
                                </td>
                                <td className="flex items-center justify-between p-4 border-b md:border-b-0 md:table-cell">
                                    <span className="font-bold text-gray-600 md:hidden">Price:</span>
                                    {product.discountPrice ? (
                                        <div className="flex flex-col items-end md:items-start">
                                            <span className="font-bold text-red-600">৳{product.discountPrice}</span>
                                            <span className="text-sm text-gray-500 line-through">৳{product.regularPrice}</span>
                                        </div>
                                    ) : (
                                        <span className="font-semibold text-gray-900">৳{product.regularPrice}</span>
                                    )}
                                </td>
                                <td className="flex items-center justify-between p-4 md:table-cell md:text-center">
                                    <span className="font-bold text-gray-600 md:hidden">Actions:</span>
                                    <div className="flex items-center justify-center gap-4">
                                        <button onClick={() => navigate(`/admin/products/edit/${product._id}`)} className="p-2 text-gray-400 transition-colors rounded-full hover:text-blue-600 hover:bg-blue-50" title="Edit Product">
                                            <FiEdit size={20} />
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-400 transition-colors rounded-full hover:text-red-600 hover:bg-red-50" title="Delete Product" disabled={deleteMutation.isPending}>
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="py-10 text-center text-gray-500">
                                    No products found. Try a different search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300">
                        <FiChevronLeft className="mr-2" /> Previous
                    </button>
                    <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300">
                        Next <FiChevronRight className="ml-2" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductListPage;