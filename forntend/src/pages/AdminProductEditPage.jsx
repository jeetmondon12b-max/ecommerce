import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import toast, { Toaster } from 'react-hot-toast';
import { API_URL } from '../apiConfig.js'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

const AdminProductEditPage = () => {
    const { id } = useParams(); // 'new' for creating, or an ID for editing
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    const [product, setProduct] = useState({
        name: '', brand: '', regularPrice: '', discountPrice: '', countInStock: '', description: ''
    });
    const [allCategories, setAllCategories] = useState([]); // সব ক্যাটাগরি লোড করার জন্য
    const [selectedCategories, setSelectedCategories] = useState([]); // সিলেক্ট করা ক্যাটাগরি রাখার জন্য
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Fetch all categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // ✅ পরিবর্তন: API URL এখন ডাইনামিক
                const { data } = await axios.get(`${API_URL}/api/categories`);
                setAllCategories(data);
            } catch (error) {
                toast.error('Could not fetch categories.');
            }
        };
        fetchCategories();
    }, []);

    // Fetch product details if editing
    useEffect(() => {
        if (id !== 'new') {
            setLoading(true);
            const fetchProduct = async () => {
                try {
                    // ✅ পরিবর্তন: API URL এখন ডাইনামিক
                    const { data } = await axios.get(`${API_URL}/api/products/${id}`);
                    setProduct(data);
                    // প্রোডাক্টের ক্যাটাগরি আইডিগুলো selectedCategories-এ সেট করা হচ্ছে
                    setSelectedCategories(data.categories.map(cat => cat._id));
                } catch (error) {
                    toast.error('Could not fetch product details.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedCategories(prev => [...prev, value]);
        } else {
            setSelectedCategories(prev => prev.filter(catId => catId !== value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('brand', product.brand);
        formData.append('regularPrice', product.regularPrice);
        formData.append('discountPrice', product.discountPrice);
        formData.append('countInStock', product.countInStock);
        formData.append('description', product.description);
        
        if (image) {
            formData.append('image', image);
        }

        // ক্যাটাগরি আইডিগুলো কমা দিয়ে যুক্ত করে পাঠানো হচ্ছে
        formData.append('categories', selectedCategories.join(','));

        const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };
        
        // ✅ পরিবর্তন: API URL এখন ডাইনামিক
        const apiCall = id === 'new'
            ? axios.post(`${API_URL}/api/products`, formData, config)
            : axios.put(`${API_URL}/api/products/${id}`, formData, config);

        toast.promise(apiCall, {
            loading: 'Saving product...',
            success: () => {
                navigate('/admin/products');
                return 'Product saved successfully!';
            },
            error: (err) => err.response?.data?.message || 'Failed to save product.',
        });
    };

    if (loading) return <p>Loading product details...</p>;

    return (
        <div className="p-8">
            <Toaster />
            <h1 className="text-3xl font-bold mb-6">{id === 'new' ? 'Add New Product' : 'Edit Product'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                {/* Product Name, Brand, Prices, Stock, Description inputs */}
                <div>
                    <label>Name</label>
                    <input name="name" value={product.name} onChange={handleChange} className="w-full p-2 border rounded"/>
                </div>
                <div>
                    <label>Brand</label>
                    <input name="brand" value={product.brand} onChange={handleChange} className="w-full p-2 border rounded"/>
                </div>
                <div>
                    <label>Regular Price</label>
                    <input type="number" name="regularPrice" value={product.regularPrice} onChange={handleChange} className="w-full p-2 border rounded"/>
                </div>
                <div>
                    <label>Discount Price</label>
                    <input type="number" name="discountPrice" value={product.discountPrice} onChange={handleChange} className="w-full p-2 border rounded"/>
                </div>
                 <div>
                    <label>Count In Stock</label>
                    <input type="number" name="countInStock" value={product.countInStock} onChange={handleChange} className="w-full p-2 border rounded"/>
                </div>
                <div>
                    <label>Description</label>
                    <textarea name="description" value={product.description} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
                </div>
                <div>
                    <label>Main Image</label>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full"/>
                </div>

                {/* ✅✅✅ ডাইনামিক ক্যাটাগরি চেকবক্স সেকশন ✅✅✅ */}
                <div>
                    <label className="font-semibold">Categories</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 border p-4 rounded-lg">
                        {allCategories.map(cat => (
                            <div key={cat._id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={cat._id}
                                    value={cat._id}
                                    checked={selectedCategories.includes(cat._id)}
                                    onChange={handleCategoryChange}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor={cat._id} className="ml-3 text-sm text-gray-700">{cat.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
                
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700">
                    {id === 'new' ? 'Create Product' : 'Update Product'}
                </button>
            </form>
        </div>
    );
};

export default AdminProductEditPage;
