//     const config = { headers: { Authorization: `Bearer ${token}` } };
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
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
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
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Product Management</h1>
                </div>
                <ProductListSkeleton />
            </div>
        );
    }

    if (isError) {
        return <div className="text-center p-10 font-semibold text-red-500"><FiAlertCircle className="inline mr-2" />Error: {error.message}</div>;
    }

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Product Management ({totalProducts})
                </h1>
                <Link to="/admin/products/edit/new" className="flex w-full sm:w-auto items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    <FiPlusCircle className="mr-2" /> Add New Product
                </Link>
            </div>

            <div className="mb-6 relative">
                <input 
                    type="text"
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className={`overflow-x-auto relative transition-opacity duration-300 ${isFetching || deleteMutation.isPending ? 'opacity-50' : 'opacity-100'}`}>
                {(isFetching || deleteMutation.isPending) && <div className="absolute inset-0 flex justify-center items-center z-10"><FiLoader className="animate-spin text-3xl text-indigo-500" /></div>}
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50 hidden md:table-header-group">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Product</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Categories</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Stock</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Price</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 md:divide-y-0">
                        {products.length > 0 ? products.map(product => (
                            <tr key={product._id} className="block md:table-row mb-4 md:mb-0 border md:border-none rounded-lg md:rounded-none shadow-md md:shadow-none">
                                <td className="p-4 flex items-center gap-4 border-b md:border-b-0 md:table-cell">
                                    {/* ✅ মূল পরিবর্তন এখানে */}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded-md border"
                                        loading="lazy"
                                        width="64"
                                        height="64"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">{product.name}</div>
                                        <div className="text-sm text-gray-500">{product.brand || 'N/A'}</div>
                                    </div>
                                </td>
                                <td className="p-4 flex justify-between items-center border-b md:border-b-0 md:table-cell">
                                    <span className="font-bold text-gray-600 md:hidden">Categories:</span>
                                    <div className="flex flex-col items-end md:items-start text-right md:text-left">
                                        <span className="font-semibold text-indigo-600">{product.pageCategory}</span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {product.categories?.map(cat => cat.name).join(', ') || ''}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 flex justify-between items-center border-b md:border-b-0 md:table-cell md:text-center">
                                    <span className="font-bold text-gray-600 md:hidden">Stock:</span>
                                    {product.countInStock > 0 ? (
                                        <span className="text-green-600 font-semibold">{product.countInStock}</span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">Out of Stock</span>
                                    )}
                                </td>
                                <td className="p-4 flex justify-between items-center border-b md:border-b-0 md:table-cell">
                                    <span className="font-bold text-gray-600 md:hidden">Price:</span>
                                    {product.discountPrice ? (
                                        <div className="flex flex-col items-end md:items-start">
                                            <span className="text-red-600 font-bold">৳{product.discountPrice}</span>
                                            <span className="line-through text-gray-500 text-sm">৳{product.regularPrice}</span>
                                        </div>
                                    ) : (
                                        <span className="font-semibold text-gray-900">৳{product.regularPrice}</span>
                                    )}
                                </td>
                                <td className="p-4 flex justify-between items-center md:table-cell md:text-center">
                                    <span className="font-bold text-gray-600 md:hidden">Actions:</span>
                                    <div className="flex justify-center items-center gap-4">
                                        <button onClick={() => navigate(`/admin/products/edit/${product._id}`)} className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50" title="Edit Product">
                                            <FiEdit size={20} />
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50" title="Delete Product" disabled={deleteMutation.isPending}>
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500">
                                    No products found. Try a different search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {totalPages > 1 && (
                <div className="mt-8 flex justify-between items-center">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300">
                        <FiChevronLeft className="mr-2" /> Previous
                    </button>
                    <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300">
                        Next <FiChevronRight className="ml-2" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductListPage;