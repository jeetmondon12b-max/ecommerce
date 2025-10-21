// import React, { useState } from 'react';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';
// import { useAuth } from '../context/AuthContext.jsx';
// import { FiEdit, FiTrash2, FiUploadCloud, FiImage, FiPlusSquare } from 'react-icons/fi';
// import { API_URL } from '../apiConfig.js';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import LazyImage from '../components/LazyImage.jsx';

// // Data fetching and mutation functions
// const fetchPageCategories = async () => {
//     const { data } = await axios.get(`${API_URL}/api/page-categories`);
//     return data.pageCategories || [];
// };
// const saveCategory = async ({ categoryData, token }) => {
//     const { formData, editingCategoryId } = categoryData;
//     const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
//     if (editingCategoryId) {
//         const { data } = await axios.put(`${API_URL}/api/page-categories/${editingCategoryId}`, formData, config);
//         return data;
//     } else {
//         const { data } = await axios.post(`${API_URL}/api/page-categories`, formData, config);
//         return data;
//     }
// };
// const deleteCategory = async ({ categoryId, token }) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     await axios.delete(`${API_URL}/api/page-categories/${categoryId}`, config);
// };

// const AdminPageCategoryPage = () => {
//     const [name, setName] = useState('');
//     const [image, setImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState('');
//     const [editingCategory, setEditingCategory] = useState(null);
//     const { userInfo } = useAuth();
//     const queryClient = useQueryClient();

//     const { data: pageCategories, isLoading, isError } = useQuery({
//         queryKey: ['pageCategories'],
//         queryFn: fetchPageCategories,
//         staleTime: 1000 * 60 * 5,
//         refetchOnWindowFocus: false,
//     });

//     const saveMutation = useMutation({
//         mutationFn: saveCategory,
//         onSuccess: () => {
//             toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully!`);
//             queryClient.invalidateQueries({ queryKey: ['pageCategories'] });
//             resetForm();
//         },
//         onError: (err) => toast.error(err.response?.data?.message || 'Operation failed.')
//     });

//     const deleteMutation = useMutation({
//         mutationFn: deleteCategory,
//         onSuccess: () => {
//             toast.success('Category deleted successfully!');
//             queryClient.invalidateQueries({ queryKey: ['pageCategories'] });
//         },
//         onError: (err) => toast.error(err.response?.data?.message || 'Deletion failed.')
//     });

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImage(file);
//             setImagePreview(URL.createObjectURL(file));
//         }
//     };
    
//     const resetForm = () => {
//         setName('');
//         setImage(null);
//         setImagePreview('');
//         setEditingCategory(null);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!name || (!image && !editingCategory)) {
//             return toast.error('Name and image are required.');
//         }
//         const formData = new FormData();
//         formData.append('name', name);
//         if (image) formData.append('image', image);
        
//         saveMutation.mutate({
//             categoryData: { formData, editingCategoryId: editingCategory?._id },
//             token: userInfo.token
//         });
//     };

//     const handleEdit = (category) => {
//         setEditingCategory(category);
//         setName(category.name);
//         // ✅ সমাধান: ছবির প্রিভিউ URL থেকে `${API_URL}` সরানো হয়েছে
//         setImagePreview(category.image || '');
//         setImage(null);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const handleDelete = (id) => {
//         if (window.confirm('Are you sure you want to delete this category?')) {
//             deleteMutation.mutate({ categoryId: id, token: userInfo.token });
//         }
//     };
    
//     return (
//         <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen font-sans">
//             <Toaster position="top-center" />
//             <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Page Categories</h1>

//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//                 {/* Form Section */}
//                 <div className="lg:col-span-4 xl:col-span-3">
//                     <div className="sticky top-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//                         <div className="flex items-center gap-3 mb-5">
//                             <FiPlusSquare className="text-indigo-500" size={24} />
//                             <h2 className="text-xl font-bold text-gray-800">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
//                         </div>
//                         <form onSubmit={handleSubmit} className="space-y-5">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
//                                 <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Summer Collection"
//                                     className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
//                                 <div className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
//                                     {imagePreview ? (
//                                         <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
//                                     ) : (
//                                         <div className="text-center text-gray-500">
//                                             <FiUploadCloud className="mx-auto h-10 w-10" />
//                                             <p className="mt-1 text-sm">Upload an image</p>
//                                         </div>
//                                     )}
//                                 </div>
//                                 <input type="file" accept="image/*" onChange={handleImageChange} className="mt-3 text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
//                             </div>
//                             <div className="flex items-center space-x-4 pt-3">
//                                 <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-2.5 px-4 rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50" disabled={saveMutation.isLoading}>
//                                     {saveMutation.isLoading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
//                                 </button>
//                                 {editingCategory && <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>}
//                             </div>
//                         </form>
//                     </div>
//                 </div>

//                 {/* Category List Section */}
//                 <div className="lg:col-span-8 xl:col-span-9">
//                     <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//                         <h2 className="text-xl font-bold text-gray-800 mb-5">Existing Categories</h2>
//                         {isLoading ? <p className="text-center p-10">Loading categories...</p> : isError ? (
//                             <div className="text-center text-red-500 p-10">
//                                 <p className="font-bold">Failed to load categories.</p>
//                             </div>
//                         ) : (
//                             pageCategories.length > 0 ? (
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
//                                     {pageCategories.map(cat => (
//                                         <div key={cat._id} className="group rounded-xl overflow-hidden shadow-md border">
//                                             <div className="relative h-48">
//                                                 {/* ✅ সমাধান: ছবির src থেকে `${API_URL}` সরানো হয়েছে */}
//                                                 <LazyImage 
//                                                     src={cat.image} 
//                                                     alt={cat.name} 
//                                                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                                                 />
//                                                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
//                                                 <div className="absolute bottom-0 left-0 p-4">
//                                                     <h3 className="text-white text-lg font-bold">{cat.name}</h3>
//                                                 </div>
//                                                 <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100">
//                                                     <button onClick={() => handleEdit(cat)} className="btn-icon bg-white/90 text-blue-600" title="Edit"><FiEdit /></button>
//                                                     <button onClick={() => handleDelete(cat._id)} className="btn-icon bg-white/90 text-red-600" title="Delete" disabled={deleteMutation.isLoading}><FiTrash2 /></button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center text-gray-500 py-16">
//                                     <FiImage size={40} className="mx-auto mb-2" />
//                                     <p>No page categories found.</p>
//                                 </div>
//                             )
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminPageCategoryPage;


import React, { useState, useRef } from 'react'; // ✅ useRef ইম্পোর্ট করা হয়েছে
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { FiEdit, FiTrash2, FiUploadCloud, FiImage, FiPlusSquare, FiLoader } from 'react-icons/fi'; // ✅ FiLoader আইকন যোগ করা হয়েছে
import { API_URL } from '../apiConfig.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LazyImage from '../components/LazyImage.jsx';

// Data fetching and mutation functions (অপরিবর্তিত)
const fetchPageCategories = async () => {
    const { data } = await axios.get(`${API_URL}/api/page-categories`);
    return data.pageCategories || [];
};
const saveCategory = async ({ categoryData, token }) => {
    const { formData, editingCategoryId } = categoryData;
    const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
    if (editingCategoryId) {
        const { data } = await axios.put(`${API_URL}/api/page-categories/${editingCategoryId}`, formData, config);
        return data;
    } else {
        const { data } = await axios.post(`${API_URL}/api/page-categories`, formData, config);
        return data;
    }
};
const deleteCategory = async ({ categoryId, token }) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(`${API_URL}/api/page-categories/${categoryId}`, config);
};

const AdminPageCategoryPage = () => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const { userInfo } = useAuth();
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null); // ✅ সমাধান ১: ফাইল ইনপুটের জন্য একটি ref তৈরি করা হয়েছে

    const { data: pageCategories, isLoading, isError } = useQuery({
        queryKey: ['pageCategories'],
        queryFn: fetchPageCategories,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const saveMutation = useMutation({
        mutationFn: saveCategory,
        onSuccess: () => {
            toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully!`);
            queryClient.invalidateQueries({ queryKey: ['pageCategories'] });
            resetForm();
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Operation failed.')
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            toast.success('Category deleted successfully!');
            queryClient.invalidateQueries({ queryKey: ['pageCategories'] });
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Deletion failed.')
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const resetForm = () => {
        setName('');
        setImage(null);
        setImagePreview('');
        setEditingCategory(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || (!image && !editingCategory)) {
            return toast.error('Name and image are required.');
        }
        const formData = new FormData();
        formData.append('name', name);
        if (image) formData.append('image', image);
        
        saveMutation.mutate({
            categoryData: { formData, editingCategoryId: editingCategory?._id },
            token: userInfo.token
        });
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setName(category.name);
        setImagePreview(category.image || '');
        setImage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteMutation.mutate({ categoryId: id, token: userInfo.token });
        }
    };
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen font-sans">
            <Toaster position="top-center" />
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Page Categories</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 xl:col-span-3">
                    <div className="sticky top-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <div className="flex items-center gap-3 mb-5">
                            <FiPlusSquare className="text-indigo-500" size={24} />
                            <h2 className="text-xl font-bold text-gray-800">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Summer Collection"
                                    className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
                                {/* ✅ সমাধান ১: onClick ইভেন্ট যোগ করা হয়েছে */}
                                <div 
                                    className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-500"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-gray-500 pointer-events-none">
                                            <FiUploadCloud className="mx-auto h-10 w-10" />
                                            <p className="mt-1 text-sm">Upload an image</p>
                                        </div>
                                    )}
                                </div>
                                {/* ✅ সমাধান ১: ফাইল ইনপুটটি এখন ref দিয়ে কানেক্ট করা এবং hidden */}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageChange} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                            </div>
                            <div className="flex items-center space-x-4 pt-3">
                                <button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-2.5 px-4 rounded-lg flex justify-center items-center gap-2 hover:shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50" 
                                    disabled={saveMutation.isLoading}
                                >
                                    {/* ✅ সমাধান ২: লোডিং অবস্থা যুক্ত করা হয়েছে */}
                                    {saveMutation.isLoading ? (
                                        <>
                                            <FiLoader className="animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        editingCategory ? 'Update Category' : 'Create Category'
                                    )}
                                </button>
                                {editingCategory && <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-5">Existing Categories ({pageCategories?.length || 0})</h2>
                        {isLoading ? <p className="text-center p-10">Loading categories...</p> : isError ? (
                            <div className="text-center text-red-500 p-10"><p>Failed to load categories.</p></div>
                        ) : (
                            pageCategories.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {pageCategories.map(cat => (
                                        <div key={cat._id} className="group rounded-xl overflow-hidden shadow-md border">
                                            <div className="relative h-48">
                                                <LazyImage 
                                                    src={cat.image} 
                                                    alt={cat.name} 
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                                <div className="absolute bottom-0 left-0 p-4">
                                                    <h3 className="text-white text-lg font-bold">{cat.name}</h3>
                                                </div>
                                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100">
                                                    <button onClick={() => handleEdit(cat)} className="p-2 rounded-full bg-white/90 text-blue-600 shadow-lg" title="Edit"><FiEdit /></button>
                                                    <button onClick={() => handleDelete(cat._id)} className="p-2 rounded-full bg-white/90 text-red-600 shadow-lg" title="Delete" disabled={deleteMutation.isLoading}><FiTrash2 /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-16"><FiImage size={40} className="mx-auto mb-2" /><p>No page categories found.</p></div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPageCategoryPage;