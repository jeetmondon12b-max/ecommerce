import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { FiUploadCloud, FiX, FiPlusCircle } from 'react-icons/fi';
// ✅ Toaster কম্পোনেন্টটি ইম্পোর্ট করুন
import toast, { Toaster } from 'react-hot-toast';

const ProductForm = () => {
    const { id: productId } = useParams();

    const [formData, setFormData] = useState({
        name: "", brand: "", description: "", regularPrice: "",
        discountPrice: "", countInStock: "", pageCategory: "",
        rating: "", numReviews: "",
    });
    
    // ... বাকি সব state অপরিবর্তিত থাকবে ...
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [productImages, setProductImages] = useState([]);
    const [productImagesPreview, setProductImagesPreview] = useState([]);
    const [standardSizes, setStandardSizes] = useState([]);
    const [customSizes, setCustomSizes] = useState([]);
    const [showCustomSizeForm, setShowCustomSizeForm] = useState(false);
    const [currentCustomSizeType, setCurrentCustomSizeType] = useState("");
    const [currentCustomSizeValues, setCurrentCustomSizeValues] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [pageCategoryOptions, setPageCategoryOptions] = useState([]);
    
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const isEditMode = productId && productId !== 'new';

    const imageInputRef = useRef(null);
    const galleryInputRef = useRef(null);
    const standardSizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

    // ... সব useEffect অপরিবর্তিত থাকবে ...
    useEffect(() => {
        const fetchPageCategories = async () => {
            try {
                const { data } = await axios.get('/api/page-categories');
                if (data && Array.isArray(data.pageCategories)) {
                    setPageCategoryOptions(data.pageCategories);
                } else {
                    setPageCategoryOptions([]);
                }
            } catch (error) {
                toast.error('Could not load page categories for the dropdown.');
                setPageCategoryOptions([]);
            }
        };
        fetchPageCategories();
    }, []);

    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const { data } = await axios.get('/api/categories');
                setAllCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                toast.error('Failed to load product categories.');
            }
        };
        fetchAllCategories();
    }, []);

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const { data } = await axios.get(`/api/products/${productId}`);
                    setFormData({
                        name: data.name || "",
                        brand: data.brand || "",
                        description: data.description || "",
                        regularPrice: data.regularPrice || "",
                        discountPrice: data.discountPrice || "",
                        countInStock: data.countInStock || "",
                        pageCategory: data.pageCategory || "",
                        rating: data.rating || "",
                        numReviews: data.numReviews || "",
                    });
                    if (data.categories && Array.isArray(data.categories)) {
                        setSelectedCategories(data.categories.map(cat => cat._id));
                    }
                    setImagePreview(data.image ? `http://localhost:5000${data.image}`: "");
                    setProductImagesPreview(data.productImages ? data.productImages.map(img => `http://localhost:5000${img}`) : []);
                    setStandardSizes(data.sizes?.standard || []);
                    setCustomSizes(data.sizes?.custom || []);
                } catch (error) {
                    toast.error('Failed to load product data for editing.');
                }
            };
            fetchProduct();
        }
    }, [productId, isEditMode]);
    
    // ... সব handler ফাংশন অপরিবর্তিত থাকবে ...
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleDynamicCategoryChange = (e) => {
        const { value, checked } = e.target;
        setSelectedCategories(prev =>
            checked ? [...prev, value] : prev.filter(id => id !== value)
        );
    };
    const handleStandardSizeChange = (e) => {
        const { value, checked } = e.target;
        setStandardSizes(prev => checked ? [...prev, value] : prev.filter(s => s !== value));
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); }
    };
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5);
        setProductImages(files);
        setProductImagesPreview(files.map(file => URL.createObjectURL(file)));
    };
    const removeGalleryImage = (index) => {
        setProductImages(prev => prev.filter((_, i) => i !== index));
        setProductImagesPreview(prev => prev.filter((_, i) => i !== index));
    };
    const handleAddCustomSize = () => {
        if (!currentCustomSizeType.trim() || !currentCustomSizeValues.trim()) return;
        const valuesArray = currentCustomSizeValues.split(',').map(v => v.trim()).filter(Boolean);
        if (valuesArray.length === 0) return;
        setCustomSizes(prev => [...prev, { type: currentCustomSizeType, values: valuesArray }]);
        setCurrentCustomSizeType("");
        setCurrentCustomSizeValues("");
        setShowCustomSizeForm(false);
    };
    const handleRemoveCustomSize = (indexToRemove) => setCustomSizes(prev => prev.filter((_, index) => index !== indexToRemove));
    const resetForm = () => {
        setFormData({ name: "", brand: "", description: "", regularPrice: "", discountPrice: "", countInStock: "", pageCategory: "", rating: "", numReviews: "" });
        setSelectedCategories([]);
        setImage(null);
        setImagePreview("");
        setProductImages([]);
        setProductImagesPreview([]);
        setStandardSizes([]);
        setCustomSizes([]);
        if (imageInputRef.current) imageInputRef.current.value = "";
        if (galleryInputRef.current) galleryInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formDataToSend = new FormData();
        
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        formDataToSend.append('categories', selectedCategories.join(','));
        const productSizes = { standard: standardSizes, custom: customSizes };
        formDataToSend.append("sizes", JSON.stringify(productSizes));
        if (image) formDataToSend.append("image", image);
        productImages.forEach(file => formDataToSend.append("productImages", file));

        const apiCall = isEditMode
            ? axios.put(`/api/products/${productId}`, formDataToSend, { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${userInfo.token}` } })
            : axios.post("/api/products", formDataToSend, { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${userInfo.token}` } });
        
        toast.promise(apiCall, {
            loading: isEditMode ? 'Updating product...' : 'Adding product...',
            success: (res) => {
                if (!isEditMode) {
                    resetForm();
                } else {
                    setTimeout(() => navigate('/admin/products', { state: { refresh: true } }), 1000);
                }
                return `Product ${isEditMode ? 'updated' : 'added'} successfully!`;
            },
            error: (err) => err.response?.data?.message || 'Operation failed.',
        }).finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg">
            {/* ✅✅✅ Toaster কম্পোনেন্টটি এখানে যোগ করা হয়েছে ✅✅✅ */}
            <Toaster position="top-center" />

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* --- Product Info Fields --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input name="brand" value={formData.brand} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Page Category</label>
                        <select name="pageCategory" value={formData.pageCategory} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required>
                            <option value="" disabled>Select Category</option>
                            {pageCategoryOptions.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* --- Price & Stock Fields --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price (৳)</label>
                        <input name="regularPrice" type="number" value={formData.regularPrice} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (৳)</label>
                        <input name="discountPrice" type="number" value={formData.discountPrice} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Count In Stock</label>
                        <input name="countInStock" type="number" value={formData.countInStock} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                    </div>
                </div>

                {/* --- Rating & Reviews Fields --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating (0-5)</label>
                        <input name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={handleChange} placeholder="e.g., 4.5" className="w-full border rounded-lg px-4 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Reviews</label>
                        <input name="numReviews" type="number" min="0" value={formData.numReviews} onChange={handleChange} placeholder="e.g., 121" className="w-full border rounded-lg px-4 py-2" />
                    </div>
                </div>

                {/* --- Description Field --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                    <textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
                </div>

                {/* --- Image Upload Fields --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imagePreview ? <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-md"/> : <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />}
                                <div className="flex text-sm text-gray-600"><label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"><span>Upload a file</span><input id="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} ref={imageInputRef} /></label></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Up to 5)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center w-full">
                                {productImagesPreview.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {productImagesPreview.map((url, index) => (
                                            <div key={index} className="relative"><img src={url} alt={`Preview ${index}`} className="h-20 w-20 object-cover rounded-md"/><button type="button" onClick={() => removeGalleryImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><FiX size={14} /></button></div>
                                        ))}
                                    </div>
                                ) : <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />}
                                <div className="flex text-sm text-gray-600 justify-center mt-2"><label htmlFor="gallery-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"><span>Upload files</span><input id="gallery-upload" type="file" accept="image/*" multiple className="sr-only" onChange={handleGalleryChange} ref={galleryInputRef} /></label></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Categories & Sizes Section --- */}
                <div className="border-t pt-6 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Product Categories & Sizes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Standard Apparel Sizes</label>
                            <div className="flex gap-4 flex-wrap">
                                {standardSizeOptions.map(size => <label key={size} className="flex items-center"><input type="checkbox" value={size} checked={standardSizes.includes(size)} onChange={handleStandardSizeChange} className="mr-2" /> {size}</label>)}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Categories</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 border rounded-lg max-h-40 overflow-y-auto">
                                {allCategories.length > 0 ? allCategories.map(cat => (
                                    <label key={cat._id} className="flex items-center">
                                        <input type="checkbox" value={cat._id} checked={selectedCategories.includes(cat._id)} onChange={handleDynamicCategoryChange} className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                        <span className="text-gray-800">{cat.name}</span>
                                    </label>
                                )) : <p className="text-gray-500 col-span-full">No categories found. Add from 'Categories' page.</p>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Sizes</label>
                        <div className="space-y-2">
                            {customSizes.map((sizeGroup, index) => (
                                <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                                    <strong className="text-gray-700">{sizeGroup.type}:</strong>
                                    <span className="text-sm text-gray-600">{sizeGroup.values.join(', ')}</span>
                                    <button type="button" onClick={() => handleRemoveCustomSize(index)} className="ml-auto text-red-500 hover:text-red-700"><FiX /></button>
                                </div>
                            ))}
                        </div>
                        {showCustomSizeForm ? (
                            <div className="mt-4 p-4 border rounded-lg space-y-3 bg-gray-50">
                                <input value={currentCustomSizeType} onChange={(e) => setCurrentCustomSizeType(e.target.value)} placeholder="Size Type (e.g., Shoe Size)" className="w-full border rounded-lg px-3 py-2"/>
                                <input value={currentCustomSizeValues} onChange={(e) => setCurrentCustomSizeValues(e.target.value)} placeholder="Values, comma separated (e.g., 40,41,42)" className="w-full border rounded-lg px-3 py-2"/>
                                <div className="flex gap-2">
                                    <button type="button" onClick={handleAddCustomSize} className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600">Save Size</button>
                                    <button type="button" onClick={() => setShowCustomSizeForm(false)} className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <button type="button" onClick={() => setShowCustomSizeForm(true)} className="mt-3 flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800">
                                <FiPlusCircle /> Add Custom Size
                            </button>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={submitting} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                    {submitting ? (isEditMode ? 'Updating Product...' : 'Adding Product...') : (isEditMode ? 'Update Product' : 'Add Product')}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;