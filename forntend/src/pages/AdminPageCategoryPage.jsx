
// import React, { useState } from 'react';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';
// import { useAuth } from '../context/AuthContext.jsx';
// import { FiEdit, FiTrash2, FiUploadCloud, FiPlus } from 'react-icons/fi';
// import { API_URL } from '../apiConfig.js';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import LazyImage from '../components/LazyImage.jsx';

// // ✅ React Query-এর জন্য ডেটা আনার ফাংশন
// const fetchPageCategories = async () => {
//     const { data } = await axios.get(`${API_URL}/api/page-categories`);
//     return data.pageCategories || [];
// };

// // ✅ React Query-এর জন্য ক্যাটাগরি তৈরি/আপডেট করার ফাংশন
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

// // ✅ React Query-এর জন্য ক্যাটাগরি ডিলিট করার ফাংশন
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

//     // ✅ useState এবং useEffect এর পরিবর্তে useQuery দিয়ে ডেটা আনা হচ্ছে
//     const { data: pageCategories, isLoading, isError } = useQuery({
//         queryKey: ['pageCategories'],
//         queryFn: fetchPageCategories
//     });

//     // ✅ ক্যাটাগরি সেভ করার জন্য useMutation
//     const saveMutation = useMutation({
//         mutationFn: saveCategory,
//         onSuccess: () => {
//             toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully!`);
//             queryClient.invalidateQueries({ queryKey: ['pageCategories'] });
//             resetForm();
//         },
//         onError: (err) => {
//             toast.error(err.response?.data?.message || 'Operation failed.');
//         }
//     });

//     // ✅ ক্যাটাগরি ডিলিট করার জন্য useMutation
//     const deleteMutation = useMutation({
//         mutationFn: deleteCategory,
//         onSuccess: () => {
//             toast.success('Category deleted successfully!');
//             queryClient.invalidateQueries({ queryKey: ['pageCategories'] });
//         },
//         onError: (err) => {
//             toast.error(err.response?.data?.message || 'Deletion failed.');
//         }
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
//         if (image) {
//             formData.append('image', image);
//         }

//         saveMutation.mutate({
//             categoryData: { formData, editingCategoryId: editingCategory?._id },
//             token: userInfo.token
//         });
//     };

//     const handleEdit = (category) => {
//         setEditingCategory(category);
//         setName(category.name);
//         setImagePreview(category.image); // Cloudinary URL
//         setImage(null);
//         window.scrollTo(0, 0);
//     };

//     const handleDelete = (id) => {
//         if (window.confirm('Are you sure you want to delete this category?')) {
//             deleteMutation.mutate({ categoryId: id, token: userInfo.token });
//         }
//     };
    
//     return (
//         <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//             <Toaster position="top-center" />
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Page Categories</h1>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 <div className="lg:col-span-1">
//                     <div className="bg-white p-6 rounded-lg shadow-md">
//                         <h2 className="text-2xl font-semibold mb-5 text-gray-700">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
//                                 <input
//                                     type="text"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     placeholder="e.g., Men"
//                                     className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
//                                 <div className="mt-1 flex items-center space-x-4">
//                                     <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
//                                         {imagePreview ? (
//                                             <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
//                                         ) : (
//                                             <FiUploadCloud className="h-8 w-8 text-gray-400" />
//                                         )}
//                                     </div>
//                                     <input type="file" accept="image/*" onChange={handleImageChange} className="file-input file-input-bordered w-full max-w-xs" />
//                                 </div>
//                             </div>
//                             <div className="flex space-x-4 pt-2">
//                                 <button type="submit" className="btn btn-primary" disabled={saveMutation.isLoading}>
//                                     {saveMutation.isLoading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
//                                 </button>
//                                 {editingCategory && <button type="button" onClick={resetForm} className="btn btn-ghost">Cancel</button>}
//                             </div>
//                         </form>
//                     </div>
//                 </div>

//                 <div className="lg:col-span-2">
//                     <div className="bg-white p-6 rounded-lg shadow-md">
//                         <h2 className="text-2xl font-semibold mb-5 text-gray-700">Existing Categories</h2>
//                         {isLoading ? <p>Loading categories...</p> : isError ? <p className='text-red-500'>Failed to load categories.</p> : (
//                             pageCategories.length > 0 ? (
//                                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
//                                     {pageCategories.map(cat => (
//                                         <div key={cat._id} className="text-center group">
//                                             <div className="relative w-28 h-28 mx-auto">
//                                                 <LazyImage 
//                                                     src={cat.image} 
//                                                     alt={cat.name} 
//                                                     className="w-full h-full rounded-full object-cover border-2 border-gray-200" 
//                                                 />
//                                                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all flex items-center justify-center space-x-3">
//                                                     <button onClick={() => handleEdit(cat)} className="btn btn-sm btn-circle btn-info opacity-0 group-hover:opacity-100"><FiEdit /></button>
//                                                     <button onClick={() => handleDelete(cat._id)} className="btn btn-sm btn-circle btn-error opacity-0 group-hover:opacity-100" disabled={deleteMutation.isLoading}><FiTrash2 /></button>
//                                                 </div>
//                                             </div>
//                                             <p className="mt-2 font-semibold text-gray-800">{cat.name}</p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <p className="text-center text-gray-500 py-10">No page categories found. Add one using the form.</p>
//                             )
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminPageCategoryPage;

import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { FiEdit, FiTrash2, FiUploadCloud, FiImage, FiPlusSquare } from 'react-icons/fi';
import { API_URL } from '../apiConfig.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LazyImage from '../components/LazyImage.jsx';

// Data fetching and mutation functions
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

    const { data: pageCategories, isLoading, isError } = useQuery({
        queryKey: ['pageCategories'],
        queryFn: fetchPageCategories,
        // ✅ পরিবর্তন: React Query-কে স্থিতিশীল করার জন্য এই দুটি অপশন যোগ করা হয়েছে
        staleTime: 1000 * 60 * 5, // ৫ মিনিটের জন্য ডেটাকে 'fresh' ধরা হবে, ফলে অতিরিক্ত রি-ফেচ হবে না
        refetchOnWindowFocus: false, // অন্য ট্যাব থেকে ফিরে আসলে স্বয়ংক্রিয় রি-ফেচ বন্ধ করা হলো
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
        setImagePreview(category.image ? `${API_URL}${category.image}` : '');
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
                {/* Form Section */}
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
                                <div className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <FiUploadCloud className="mx-auto h-10 w-10" />
                                            <p className="mt-1 text-sm">Upload an image</p>
                                        </div>
                                    )}
                                </div>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="mt-3 text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
                            </div>
                            <div className="flex items-center space-x-4 pt-3">
                                <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-2.5 px-4 rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50" disabled={saveMutation.isLoading}>
                                    {saveMutation.isLoading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                                </button>
                                {editingCategory && <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Category List Section */}
                <div className="lg:col-span-8 xl:col-span-9">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-5">Existing Categories</h2>
                        {isLoading ? <p className="text-center p-10">Loading categories...</p> : isError ? (
                            <div className="text-center text-red-500 p-10 border-2 border-dashed border-red-200 rounded-lg">
                                <p className="font-bold">Failed to load categories.</p>
                                <p className="text-sm mt-1 text-gray-600">Please check the server connection and try again.</p>
                            </div>
                        ) : (
                            pageCategories.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {pageCategories.map(cat => (
                                        <div key={cat._id} className="group rounded-xl overflow-hidden shadow-md border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                            <div className="relative md:h-48">
                                                <LazyImage 
                                                    src={`${API_URL}${cat.image}`} 
                                                    alt={cat.name} 
                                                    className="w-full h-48 object-cover transition-transform duration-300 md:group-hover:scale-110"
                                                />
                                                <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                                <div className="hidden md:block absolute bottom-0 left-0 p-4">
                                                    <h3 className="text-white text-lg font-bold drop-shadow-lg">{cat.name}</h3>
                                                </div>
                                                <div className="hidden absolute top-3 right-3 md:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <button onClick={() => handleEdit(cat)} className="bg-white/90 text-blue-600 rounded-full p-2 shadow-lg hover:bg-white" title="Edit"><FiEdit /></button>
                                                    <button onClick={() => handleDelete(cat._id)} className="bg-white/90 text-red-600 rounded-full p-2 shadow-lg hover:bg-white" title="Delete" disabled={deleteMutation.isLoading}><FiTrash2 /></button>
                                                </div>
                                            </div>
                                            <div className="p-4 md:hidden">
                                                <h3 className="text-gray-800 font-bold mb-3">{cat.name}</h3>
                                                <div className="flex items-center justify-end gap-3 border-t pt-3">
                                                    <button onClick={() => handleEdit(cat)} className="flex items-center gap-1.5 text-sm text-blue-600 font-semibold" title="Edit">
                                                        <FiEdit size={14}/> Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(cat._id)} className="flex items-center gap-1.5 text-sm text-red-600 font-semibold" title="Delete" disabled={deleteMutation.isLoading}>
                                                        <FiTrash2 size={14}/> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-16 border-2 border-dashed rounded-lg">
                                    <FiImage size={40} className="mx-auto mb-2" />
                                    <p>No page categories found.</p>
                                    <p className="text-sm mt-1">Use the form on the left to add a new category.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPageCategoryPage;