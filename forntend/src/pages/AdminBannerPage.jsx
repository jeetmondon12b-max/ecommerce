// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';
// import { useAuth } from '../context/AuthContext.jsx';
// import { FiTrash2, FiUploadCloud, FiLink, FiImage, FiPlus } from 'react-icons/fi';
// import { API_URL } from '../apiConfig.js';

// const AdminBannerPage = () => {
//     const [banners, setBanners] = useState([]);
//     const [formData, setFormData] = useState({ title: '', subtitle: '', link: '' });
//     const [image, setImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const { userInfo } = useAuth();
//     const fileInputRef = useRef(null);

//     const fetchBanners = async () => {
//         try {
//             setLoading(true);
//             const { data } = await axios.get(`${API_URL}/api/banners`);
//             setBanners(data.banners || []);
//         } catch (error) {
//             toast.error('Failed to load banners.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchBanners();
//     }, []);

//     const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImage(file);
//             setImagePreview(URL.createObjectURL(file));
//         }
//     };
    
//     const resetForm = () => {
//         setFormData({ title: '', subtitle: '', link: '' });
//         setImage(null);
//         setImagePreview('');
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!image) {
//             return toast.error('Banner Image is required.');
//         }
//         setIsSubmitting(true);

//         const data = new FormData();
//         data.append('title', formData.title);
//         data.append('subtitle', formData.subtitle);
//         data.append('link', formData.link);
//         data.append('image', image);

//         const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };

//         toast.promise(axios.post(`${API_URL}/api/banners`, data, config), {
//             loading: 'Creating banner...',
//             success: () => {
//                 fetchBanners();
//                 resetForm();
//                 setIsSubmitting(false);
//                 return 'Banner created successfully!';
//             },
//             error: (err) => {
//                 setIsSubmitting(false);
//                 return err.response?.data?.message || 'Operation failed.';
//             }
//         });
//     };

//     const handleDelete = (id) => {
//         if (window.confirm('Are you sure you want to delete this banner?')) {
//             const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
//             toast.promise(axios.delete(`${API_URL}/api/banners/${id}`, config), {
//                 loading: 'Deleting banner...',
//                 success: () => {
//                     fetchBanners();
//                     return 'Banner deleted successfully!';
//                 },
//                 error: (err) => err.response?.data?.message || 'Deletion failed.',
//             });
//         }
//     };
    
//     return (
//         <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//             <Toaster position="top-center" />
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Homepage Banners</h1>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
//                 <div className="lg:col-span-1">
//                     <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
//                         <h2 className="text-2xl font-semibold mb-5 text-gray-700">Add New Banner</h2>
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title (Optional)</label>
//                                 <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Men's Fashion" className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Banner Subtitle (Optional)</label>
//                                 <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} placeholder="e.g., Discover the latest trends" className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Button Link (Optional)</label>
//                                 <input type="text" name="link" value={formData.link} onChange={handleInputChange} placeholder="e.g., /page/Men" className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (Required)</label>
//                                 <div 
//                                     className="mt-2 flex justify-center items-center w-full h-40 px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
//                                     onClick={() => fileInputRef.current.click()}
//                                 >
//                                     {imagePreview ? (
//                                         <img src={imagePreview} alt="Banner Preview" className="h-full w-full object-cover rounded-md" />
//                                     ) : (
//                                         <div className="space-y-1 text-center">
//                                             <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
//                                             <p className="text-sm text-gray-600">
//                                                 Click to upload image
//                                             </p>
//                                             {/* ✅✅✅ মূল পরিবর্তন এখানে: ছবির মাপের নির্দেশনা ✅✅✅ */}
//                                             <p className="text-xs text-gray-500">
//                                                 Required: 1600px &times; 600px
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>
//                                 <input id="file-upload" name="file-upload" type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
//                             </div>
//                             <button type="submit" className="btn btn-primary w-full !mt-6 flex items-center justify-center gap-2" disabled={isSubmitting}>
//                                 <FiPlus />
//                                 {isSubmitting ? 'Creating...' : 'Create Banner'}
//                             </button>
//                         </form>
//                     </div>
//                 </div>

//                 <div className="lg:col-span-2">
//                     <div className="bg-white p-6 rounded-lg shadow-md">
//                         <h2 className="text-2xl font-semibold mb-5 text-gray-700">Existing Banners</h2>
//                         {loading ? <p>Loading...</p> : (
//                             <div className="space-y-4">
//                                 {banners.length > 0 ? banners.map(banner => (
//                                     <div key={banner._id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
//                                         <div className="flex items-center gap-4">
//                                             <img src={`${API_URL}${banner.image}`} alt={banner.title} className="w-28 h-16 object-cover rounded"/>
//                                             <div>
//                                                 <p className="font-bold text-gray-800">{banner.title || 'No Title'}</p>
//                                                 <p className="text-sm text-gray-500 flex items-center gap-1"><FiLink size={12} /> {banner.link || 'No Link'}</p>
//                                             </div>
//                                         </div>
//                                         <button onClick={() => handleDelete(banner._id)} className="btn btn-sm btn-circle btn-error btn-outline"><FiTrash2 /></button>
//                                     </div>
//                                 )) : (
//                                     <div className="text-center py-10">
//                                         <FiImage className="mx-auto text-5xl text-gray-300" />
//                                         <p className="mt-4 text-gray-500">No banners found. Add one using the form.</p>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminBannerPage;



import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { FiTrash2, FiUploadCloud, FiLink, FiImage, FiPlus } from 'react-icons/fi';
import { API_URL } from '../apiConfig.js';

const AdminBannerPage = () => {
    const [banners, setBanners] = useState([]);
    const [formData, setFormData] = useState({ title: '', subtitle: '', link: '' });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
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
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const resetForm = () => {
        setFormData({ title: '', subtitle: '', link: '' });
        setImage(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            return toast.error('Banner Image is required.');
        }
        setIsSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('link', formData.link);
        data.append('image', image);

        const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` } };

        toast.promise(axios.post(`${API_URL}/api/banners`, data, config), {
            loading: 'Creating banner...',
            success: () => {
                fetchBanners();
                resetForm();
                setIsSubmitting(false);
                return 'Banner created successfully!';
            },
            error: (err) => {
                setIsSubmitting(false);
                return err.response?.data?.message || 'Operation failed.';
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            toast.promise(axios.delete(`${API_URL}/api/banners/${id}`, config), {
                loading: 'Deleting banner...',
                success: () => {
                    fetchBanners();
                    return 'Banner deleted successfully!';
                },
                error: (err) => err.response?.data?.message || 'Deletion failed.',
            });
        }
    };
    
    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-center" />
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (Required)</label>
                                <div 
                                    className="mt-2 flex justify-center items-center w-full h-40 px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Banner Preview" className="h-full w-full object-cover rounded-md" />
                                    ) : (
                                        <div className="space-y-1 text-center">
                                            <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="text-sm text-gray-600">
                                                Click to upload image
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Required: 1600px &times; 600px
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <input id="file-upload" name="file-upload" type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                            </div>
                            <button type="submit" className="btn btn-primary w-full !mt-6 flex items-center justify-center gap-2" disabled={isSubmitting}>
                                <FiPlus />
                                {isSubmitting ? 'Creating...' : 'Create Banner'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-5 text-gray-700">Existing Banners</h2>
                        {loading ? <p>Loading...</p> : (
                            <div className="space-y-4">
                                {banners.length > 0 ? banners.map(banner => (
                                    <div key={banner._id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            {/* ✅ এখানে আর API_URL লাগবে না */}
                                            <img src={banner.image} alt={banner.title} className="w-28 h-16 object-cover rounded"/>
                                            <div>
                                                <p className="font-bold text-gray-800">{banner.title || 'No Title'}</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1"><FiLink size={12} /> {banner.link || 'No Link'}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(banner._id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"><FiTrash2 /></button>
                                    </div>
                                )) : (
                                    <div className="text-center py-10">
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