import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { FiTrash2, FiUploadCloud, FiLink, FiImage, FiPlus, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { API_URL } from '../apiConfig.js';
import ImageCropModal from '../components/ImageCropModal.jsx';

const AdminBannerPage = () => {
    const [banners, setBanners] = useState([]);
    const [formData, setFormData] = useState({ title: '', subtitle: '', link: '' });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [sourceImage, setSourceImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [imageStatus, setImageStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { userInfo } = useAuth();
    const fileInputRef = useRef(null);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/api/banners`);
            setBanners(data.banners || []);
        } catch (error) {
            toast.error('Failed to load banners.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    if (img.width < 1200) {
                        toast.error('Image is too small! Minimum width should be 1200px.');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    } else {
                        setSourceImage(reader.result);
                        setShowCropper(true);
                    }
                };
            };
        }
    };
    
    // ✅ সমাধান: এখানে স্টেট আপডেটের পর মডাল বন্ধ করার কোড যোগ করা হয়েছে
    const onCropComplete = (croppedImageBlob) => {
        setImage(croppedImageBlob);
        setImagePreview(URL.createObjectURL(croppedImageBlob));
        setImageStatus({ type: 'perfect', message: 'Perfect!' });
        setShowCropper(false); // ছবিটি সফলভাবে পাওয়ার পর মডালটি বন্ধ হবে
        setTimeout(() => setImageStatus(null), 2500);
    };

    const resetForm = () => {
        setFormData({ title: '', subtitle: '', link: '' });
        setImage(null);
        setImagePreview('');
        setSourceImage(null);
        setShowCropper(false);
        setImageStatus(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            return toast.error('Please select and crop an image first.');
        }
        setIsSubmitting(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('link', formData.link);
        data.append('image', image, 'cropped_banner.jpeg');
        const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };
        toast.promise(axios.post(`${API_URL}/api/banners`, data, config), {
            loading: 'Creating banner...',
            success: () => {
                fetchBanners();
                resetForm();
                return 'Banner created successfully!';
            },
            error: (err) => err.response?.data?.message || 'Operation failed.',
        }).finally(() => setIsSubmitting(false));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            toast.promise(axios.delete(`${API_URL}/api/banners/${id}`, config), {
                loading: 'Deleting banner...',
                success: () => { fetchBanners(); return 'Banner deleted successfully!'; },
                error: (err) => err.response?.data?.message || 'Deletion failed.',
            });
        }
    };
    
    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-center" />
            
            {showCropper && (
                <ImageCropModal 
                    image={sourceImage}
                    onClose={() => {
                        setShowCropper(false);
                        if (!image) { // যদি কোনো ছবি সেভ না করেই মডাল বন্ধ করা হয়
                            resetForm();
                        }
                    }}
                    onCropComplete={onCropComplete}
                />
            )}

            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Homepage Banners</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                        <h2 className="text-2xl font-semibold mb-5 text-gray-700">Add New Banner</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title (Optional)</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Men's Fashion" className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Subtitle (Optional)</label>
                                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} placeholder="e.g., Discover the latest trends" className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Button Link (Optional)</label>
                                <input type="text" name="link" value={formData.link} onChange={handleInputChange} placeholder="e.g., /page/Men" className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                                <div 
                                    className="mt-2 flex justify-center items-center w-full h-40 px-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Banner Preview" className="h-full w-full object-contain rounded-md" />
                                    ) : (
                                        <div className="space-y-1 text-center">
                                            <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-sm text-gray-600">Click to upload & crop</p>
                                        </div>
                                    )}
                                </div>
                                <input id="file-upload" type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                                
                                {imageStatus && (
                                    <div className={`mt-2 flex items-center gap-2 text-sm font-semibold ${imageStatus.type === 'perfect' ? 'text-green-600' : 'text-red-600'}`}>
                                        {imageStatus.type === 'perfect' ? <FiCheckCircle /> : <FiAlertCircle />}
                                        {imageStatus.message}
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition disabled:bg-indigo-400" disabled={isSubmitting || !image}>
                                <FiPlus />
                                {isSubmitting ? 'Creating...' : 'Create Banner'}
                            </button>
                        </form>
                    </div>
                </div>
                
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-5 text-gray-700">Existing Banners ({banners.length})</h2>
                        {loading ? <p>Loading...</p> : (
                            <div className="space-y-4">
                                {banners.length > 0 ? banners.map(banner => (
                                    <div key={banner._id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <img src={banner.image} alt={banner.title} className="w-28 h-16 object-cover rounded"/>
                                            <div>
                                                <p className="font-bold text-gray-800">{banner.title || 'No Title'}</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1"><FiLink size={12} /> {banner.link || 'No Link'}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(banner._id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"><FiTrash2 /></button>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                        <FiImage className="mx-auto text-5xl text-gray-300" />
                                        <p className="mt-4 text-gray-500">No banners found. Add one using the form.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBannerPage;