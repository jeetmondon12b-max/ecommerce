import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { FiEdit, FiTrash2, FiUploadCloud } from 'react-icons/fi';
import { API_URL } from '../apiConfig.js'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

const AdminPageCategoryPage = () => {
    const [pageCategories, setPageCategories] = useState([]);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useAuth();

    // Backend থেকে সব Page Category লোড করার ফাংশন
    const fetchPageCategories = async () => {
        try {
            setLoading(true);
            // ✅ পরিবর্তন: API URL এখন ডাইনামিক
            const { data } = await axios.get(`${API_URL}/api/page-categories`);
            if (data && Array.isArray(data.pageCategories)) {
                setPageCategories(data.pageCategories);
            } else {
                setPageCategories([]);
            }
        } catch (error) {
            toast.error('Failed to load page categories.');
            setPageCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPageCategories();
    }, []);

    // ছবি সিলেক্ট করলে তার প্রিভিউ দেখানোর জন্য
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    // ফর্ম রিসেট করার জন্য
    const resetForm = () => {
        setName('');
        setImage(null);
        setImagePreview('');
        setEditingCategory(null);
    };

    // ফর্ম সাবমিট করার ফাংশন (Create ও Update দুটোই হ্যান্ডেল করে)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || (!image && !editingCategory)) {
            return toast.error('Name and image are required.');
        }
        const formData = new FormData();
        formData.append('name', name);
        if (image) {
            formData.append('image', image);
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // ✅ পরিবর্তন: API URL এখন ডাইনামিক
        const apiCall = editingCategory
            ? axios.put(`${API_URL}/api/page-categories/${editingCategory._id}`, formData, config)
            : axios.post(`${API_URL}/api/page-categories`, formData, config);

        toast.promise(apiCall, {
            loading: editingCategory ? 'Updating category...' : 'Creating category...',
            success: () => {
                fetchPageCategories();
                resetForm();
                return `Category ${editingCategory ? 'updated' : 'created'} successfully!`;
            },
            error: (err) => err.response?.data?.message || 'Operation failed.',
        });
    };

    // এডিট বাটনে ক্লিক করলে ফর্মটি পূরণ করার জন্য
    const handleEdit = (category) => {
        setEditingCategory(category);
        setName(category.name);
        // ✅ পরিবর্তন: ছবির URL এখন ডাইনামিক
        setImagePreview(`${API_URL}${category.image}`);
        setImage(null);
        window.scrollTo(0, 0);
    };

    // ডিলিট বাটনে ক্লিক করার জন্য
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            // ✅ পরিবর্তন: API URL এখন ডাইনামিক
            const apiCall = axios.delete(`${API_URL}/api/page-categories/${id}`, config);
            toast.promise(apiCall, {
                loading: 'Deleting category...',
                success: () => {
                    fetchPageCategories();
                    return 'Category deleted successfully!';
                },
                error: (err) => err.response?.data?.message || 'Deletion failed.',
            });
        }
    };
    
    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
             <Toaster position="top-center" />
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Page Categories</h1>

            {/* ✅ সুন্দর লেআউটের জন্য Grid ব্যবহার করা হয়েছে */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* বাম পাশের কলাম: ফর্ম */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-5 text-gray-700">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Men"
                                    className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                                <div className="mt-1 flex items-center space-x-4">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <FiUploadCloud className="h-8 w-8 text-gray-400" />
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="file-input file-input-bordered w-full max-w-xs" />
                                </div>
                            </div>
                            <div className="flex space-x-4 pt-2">
                                <button type="submit" className="btn btn-primary">{editingCategory ? 'Update Category' : 'Create Category'}</button>
                                {editingCategory && <button type="button" onClick={resetForm} className="btn btn-ghost">Cancel</button>}
                            </div>
                        </form>
                    </div>
                </div>

                {/* ডান পাশের কলাম: বর্তমানে থাকা ক্যাটাগরির লিস্ট */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-5 text-gray-700">Existing Categories</h2>
                        {loading ? <p>Loading categories...</p> : (
                            pageCategories.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {pageCategories.map(cat => (
                                        <div key={cat._id} className="text-center group">
                                            <div className="relative">
                                                {/* ✅ পরিবর্তন: ছবির URL এখন ডাইনামিক */}
                                                <img src={`${API_URL}${cat.image}`} alt={cat.name} className="w-28 h-28 rounded-full mx-auto object-cover border-2 border-gray-200" />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all flex items-center justify-center space-x-3">
                                                    <button onClick={() => handleEdit(cat)} className="btn btn-sm btn-circle btn-info opacity-0 group-hover:opacity-100"><FiEdit /></button>
                                                    <button onClick={() => handleDelete(cat._id)} className="btn btn-sm btn-circle btn-error opacity-0 group-hover:opacity-100"><FiTrash2 /></button>
                                                </div>
                                            </div>
                                            <p className="mt-2 font-semibold text-gray-800">{cat.name}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-10">No page categories found. Add one using the form.</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPageCategoryPage;
