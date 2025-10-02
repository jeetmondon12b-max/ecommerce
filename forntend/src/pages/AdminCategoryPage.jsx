import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { FiEdit, FiTrash2, FiPlus, FiX, FiLoader } from 'react-icons/fi';
import { API_URL } from '../apiConfig.js'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

// মোবাইল ডিভাইসের জন্য Category Card কম্পোনেন্ট
const CategoryCard = ({ category, onEdit, onDelete }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
            <p className="font-bold text-gray-800">{category.name}</p>
            <p className="text-xs font-mono text-gray-500 mt-1">{category.slug}</p>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => onEdit(category)} className="p-2 text-blue-600 hover:text-blue-800" title="Edit">
                <FiEdit size={18} />
            </button>
            <button onClick={() => onDelete(category._id)} className="p-2 text-red-600 hover:text-red-800" title="Delete">
                <FiTrash2 size={18} />
            </button>
        </div>
    </div>
);

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const { userInfo } = useAuth();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            // ✅ পরিবর্তন: API URL এখন ডাইনামিক
            const { data } = await axios.get(`${API_URL}/api/categories`);
            setCategories(data);
        } catch (error) {
            toast.error('Failed to load categories.');
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openModalForNew = () => {
        setCurrentCategory(null);
        setCategoryName('');
        setIsModalOpen(true);
    };

    const openModalForEdit = (category) => {
        setCurrentCategory(category);
        setCategoryName(category.name);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
        setCategoryName('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            toast.error('Category name cannot be empty.');
            return;
        }

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        // ✅ পরিবর্তন: API URL এখন ডাইনামিক
        const promise = currentCategory
            ? axios.put(`${API_URL}/api/categories/${currentCategory._id}`, { name: categoryName }, config)
            : axios.post(`${API_URL}/api/categories`, { name: categoryName }, config);

        toast.promise(promise, {
            loading: 'Saving category...',
            success: () => {
                fetchCategories();
                closeModal();
                return currentCategory ? 'Category updated successfully!' : 'Category created successfully!';
            },
            error: (err) => err.response?.data?.message || 'Could not save category.',
        });
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? This cannot be undone.')) {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            // ✅ পরিবর্তন: API URL এখন ডাইনামিক
            const promise = axios.delete(`${API_URL}/api/categories/${categoryId}`, config);

            toast.promise(promise, {
                loading: 'Deleting category...',
                success: () => {
                    fetchCategories();
                    return 'Category deleted successfully!';
                },
                error: (err) => err.response?.data?.message || 'Could not delete category.',
            });
        }
    };

    if (loading) return <div className="flex justify-center items-center p-10"><FiLoader className="animate-spin text-2xl" /></div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <Toaster position="top-center" />
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Categories</h1>
                <button onClick={openModalForNew} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
                    <FiPlus /> Add New Category
                </button>
            </div>

            {/* ডেস্কটপ ভিউ: টেবিল */}
            <div className="hidden md:block bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Category Name</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Slug</th>
                            <th className="p-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat._id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-800">{cat.name}</td>
                                <td className="p-3 font-mono text-xs text-gray-500">{cat.slug}</td>
                                <td className="p-3 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => openModalForEdit(cat)} className="text-blue-600 hover:text-blue-800" title="Edit"><FiEdit size={18} /></button>
                                        <button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-800" title="Delete"><FiTrash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* মোবাইল ভিউ: কার্ড লিস্ট */}
            <div className="md:hidden space-y-3">
                {categories.length > 0 ? categories.map((cat) => (
                    <CategoryCard 
                        key={cat._id}
                        category={cat}
                        onEdit={openModalForEdit}
                        onDelete={handleDelete}
                    />
                )) : (
                    <div className="text-center p-10 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">No categories found.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{currentCategory ? 'Edit Category' : 'Add New Category'}</h2>
                            <button onClick={closeModal}><FiX /></button>
                        </div>
                        <form onSubmit={handleSave}>
                            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
                            <input
                                type="text"
                                id="categoryName"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <div className="mt-6 flex justify-end gap-4">
                                <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategoryPage;


