// import React from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext.jsx';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiEdit, FiTrash2, FiPlusCircle, FiAlertCircle } from 'react-icons/fi';
// import toast from 'react-hot-toast';
// import { API_URL } from '../apiConfig.js'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

// // API থেকে প্রোডাক্ট আনার জন্য একটি async ফাংশন
// const fetchProducts = async () => {
//     // ✅ পরিবর্তন: API URL এখন ডাইনামিক
//     const { data } = await axios.get(`${API_URL}/api/products`);
//     return data.products || [];
// };

// // প্রোডাক্ট ডিলিট করার জন্য একটি async ফাংশন
// const deleteProduct = async ({ productId, token }) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     // ✅ পরিবর্তন: API URL এখন ডাইনামিক
//     await axios.delete(`${API_URL}/api/products/${productId}`, config);
// };

// const ProductListPage = () => {
//     const { userInfo } = useAuth();
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();

//     const { data: products, isLoading, isError, error } = useQuery({
//         queryKey: ['products'],
//         queryFn: fetchProducts,
//     });

//     const deleteMutation = useMutation({
//         mutationFn: deleteProduct,
//         onSuccess: () => {
//             toast.success('Product deleted successfully!');
//             queryClient.invalidateQueries({ queryKey: ['products'] });
//         },
//         onError: (err) => {
//             toast.error(err.response?.data?.message || 'Failed to delete product.');
//         },
//     });

//     const handleDelete = (productId) => {
//         if (window.confirm('Are you sure you want to delete this product?')) {
//             deleteMutation.mutate({ productId, token: userInfo.token });
//         }
//     };

//     if (isLoading) {
//         return <div className="text-center p-10 font-semibold text-gray-600">Loading products...</div>;
//     }

//     if (isError) {
//         return <div className="text-center p-10 font-semibold text-red-500"><FiAlertCircle className="inline mr-2" />Error: {error.message}</div>;
//     }

//     return (
//         <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
//                     Product Management ({products?.length || 0})
//                 </h1>
//                 <Link
//                     to="/admin/products/edit/new"
//                     className="flex w-full sm:w-auto items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
//                 >
//                     <FiPlusCircle className="mr-2" /> Add New Product
//                 </Link>
//             </div>

//             <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white">
//                     <thead className="bg-gray-50 hidden md:table-header-group">
//                         <tr>
//                             <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Product</th>
//                             <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Categories</th>
//                             <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Stock</th>
//                             <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Price</th>
//                             <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Actions</th>
//                         </tr>
//                     </thead>
                    
//                     <tbody className="divide-y divide-gray-200 md:divide-y-0">
//                         {products && products.map(product => (
//                             <tr key={product._id} className="block md:table-row mb-4 md:mb-0 border md:border-none rounded-lg md:rounded-none shadow-md md:shadow-none">
                                
//                                 <td className="p-4 flex items-center gap-4 border-b md:border-b-0 md:table-cell">
//                                     {/* ✅ পরিবর্তন: ছবির URL এখন ডাইনামিক */}
//                                     <img
//                                         src={`${API_URL}${product.image}`}
//                                         alt={product.name}
//                                         className="w-16 h-16 object-cover rounded-md border"
//                                     />
//                                     <div>
//                                         <div className="font-medium text-gray-900">{product.name}</div>
//                                         <div className="text-sm text-gray-500">{product.brand || 'N/A'}</div>
//                                     </div>
//                                 </td>

//                                 <td className="p-4 flex justify-between items-center border-b md:border-b-0 md:table-cell">
//                                     <span className="font-bold text-gray-600 md:hidden">Categories:</span>
//                                     <span className="text-gray-600 text-right">
//                                         {product.categories?.map(cat => cat.name).join(', ') || 'N/A'}
//                                     </span>
//                                 </td>

//                                 <td className="p-4 flex justify-between items-center border-b md:border-b-0 md:table-cell md:text-center">
//                                     <span className="font-bold text-gray-600 md:hidden">Stock:</span>
//                                     {product.countInStock > 0 ? (
//                                         <span className="text-green-600 font-semibold">{product.countInStock}</span>
//                                     ) : (
//                                         <span className="text-red-600 font-semibold">Out of Stock</span>
//                                     )}
//                                 </td>
                                
//                                 <td className="p-4 flex justify-between items-center border-b md:border-b-0 md:table-cell">
//                                     <span className="font-bold text-gray-600 md:hidden">Price:</span>
//                                     {product.discountPrice ? (
//                                         <div className="flex flex-col items-end md:items-start">
//                                             <span className="text-red-600 font-bold">৳{product.discountPrice}</span>
//                                             <span className="line-through text-gray-500 text-sm">৳{product.regularPrice}</span>
//                                         </div>
//                                     ) : (
//                                         <span className="font-semibold text-gray-900">৳{product.regularPrice}</span>
//                                     )}
//                                 </td>

//                                 <td className="p-4 flex justify-between items-center md:table-cell md:text-center">
//                                     <span className="font-bold text-gray-600 md:hidden">Actions:</span>
//                                     <div className="flex justify-center items-center gap-4">
//                                         <button
//                                             onClick={() => navigate(`/admin/products/edit/${product._id}`)}
//                                             className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
//                                             title="Edit Product"
//                                         >
//                                             <FiEdit size={20} />
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(product._id)}
//                                             className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
//                                             title="Delete Product"
//                                             disabled={deleteMutation.isPending}
//                                         >
//                                             <FiTrash2 size={20} />
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default ProductListPage;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlusCircle, FiAlertCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig.js';

// API থেকে পেজিনেশনসহ প্রোডাক্ট আনার জন্য ফাংশন
const fetchProducts = async (page = 1) => {
    // এখন থেকে API পেজ নম্বর অনুযায়ী ডাটা পাঠাবে
    const { data } = await axios.get(`${API_URL}/api/products?page=${page}&limit=10`);
    return data; // এখন পুরো অবজেক্ট রিটার্ন করা হচ্ছে (products, page, pages)
};

// প্রোডাক্ট ডিলিট করার ফাংশন (অপরিবর্তিত)
const deleteProduct = async ({ productId, token }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/api/products/${productId}`, config);
};

const ProductListPage = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1); // পেজিনেশনের জন্য স্টেট

    // useQuery এখন currentPage-এর উপর নির্ভর করবে
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['products', currentPage], // queryKey-তে currentPage যোগ করা হয়েছে
        queryFn: () => fetchProducts(currentPage),
        keepPreviousData: true, // পেজ পরিবর্তনের সময় পুরোনো ডাটা দেখানোর জন্য
    });

    // products, pages, total এখন 'data' অবজেক্ট থেকে আসবে
    const products = data?.products || [];
    const totalPages = data?.pages || 1;
    const totalProducts = data?.total || 0;

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            toast.success('Product deleted successfully!');
            // বর্তমান এবং অন্যান্য পেজের ডাটা ইনভ্যালিডেট করা হচ্ছে
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
    
    // পেজ পরিবর্তনের জন্য হ্যান্ডলার
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (isLoading && !data) { // শুধুমাত্র প্রথম লোডিং-এ স্কেলেটন দেখাবে
        return <div className="text-center p-10 font-semibold text-gray-600">Loading products...</div>;
    }

    if (isError) {
        return <div className="text-center p-10 font-semibold text-red-500"><FiAlertCircle className="inline mr-2" />Error: {error.message}</div>;
    }

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
                    Product Management ({totalProducts})
                </h1>
                <Link
                    to="/admin/products/edit/new"
                    className="flex w-full sm:w-auto items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                    <FiPlusCircle className="mr-2" /> Add New Product
                </Link>
            </div>

            <div className="overflow-x-auto">
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
                        {products && products.map(product => (
                            <tr key={product._id} className="block md:table-row mb-4 md:mb-0 border md:border-none rounded-lg md:rounded-none shadow-md md:shadow-none">
                                
                                <td className="p-4 flex items-center gap-4 border-b md:border-b-0 md:table-cell">
                                    <img
                                        src={`${API_URL}${product.image}`}
                                        alt={product.name}
                                        className="w-16 h-16 object-cover rounded-md border"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">{product.name}</div>
                                        <div className="text-sm text-gray-500">{product.brand || 'N/A'}</div>
                                    </div>
                                </td>

                                {/* ✅✅✅ উন্নত ক্যাটাগরি ডিসপ্লে ✅✅✅ */}
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
                                        <button
                                            onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                                            title="Edit Product"
                                        >
                                            <FiEdit size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                                            title="Delete Product"
                                            disabled={deleteMutation.isPending}
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* ✅✅✅ পেজিনেশন বাটন ✅✅✅ */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                    >
                        <FiChevronLeft className="mr-2" /> Previous
                    </button>
                    <span className="text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                    >
                        Next <FiChevronRight className="ml-2" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductListPage;