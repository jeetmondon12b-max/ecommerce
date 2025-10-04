// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { API_URL } from '../apiConfig';

// // Component Imports
// import ProductSection from '../components/ProductSection.jsx';
// import Searchbar from '../components/Searchbar.jsx';
// import HeroSection from '../components/Banner.jsx';
// import Category from '../components/Category.jsx';

// const HomePage = () => {
//     const [productCategories, setProductCategories] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchProductCategories = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await axios.get(`${API_URL}/api/categories`);
//                 const categoriesWithProducts = data.filter(cat => cat.productCount > 0);
//                 setProductCategories(categoriesWithProducts || []);
//             } catch (err) {
//                 setError('Could not load categories. Please try again.');
//                 console.error("Error fetching product categories:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProductCategories();
//     }, []);

//     if (error) {
//         return <div className="text-center py-40 text-red-500 font-semibold">{error}</div>;
//     }

//     return (
//         <div className="space-y-4">
//             {/* --- Top Section --- */}
//             <div className="container mx-auto p-4 sm:p-6 space-y-12">
//                 <Searchbar />
//                 <HeroSection />
//                 <Category />
//             </div>

//             {/* --- Product Sections by Category --- */}
//             {loading ? (
//                 <p className="text-center py-10 font-semibold">Loading product sections...</p>
//             ) : (
//                 productCategories.map(category => (
//                     <ProductSection
//                         key={category._id}
//                         title={category.name}
//                         categorySlug={category.slug}
//                     />
//                 ))
//             )}

//             {/* --- All Products Section --- */}
//             {/* ✅✅✅ কোনো পরিবর্তন ছাড়াই এটি এখন কাজ করবে ✅✅✅ */}
//             <ProductSection title="All Products" />
//         </div>
//     );
// };

// export default HomePage;  


import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../apiConfig';

// Component Imports
import ProductSection from '../components/ProductSection.jsx';
import Searchbar from '../components/Searchbar.jsx';
import Banner from '../components/Banner.jsx';
import Category from '../components/Category.jsx';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';

// ✅ একটি মাত্র ফাংশন যা হোমপেজের সব ডেটা আনবে
const fetchHomepageData = async () => {
    const { data } = await axios.get(`${API_URL}/api/products/homepage-data`);
    return data;
};

const HomePage = () => {
    // ✅ useQuery ব্যবহার করে একটি মাত্র API কল করা হচ্ছে
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['homepageData'],
        queryFn: fetchHomepageData,
        staleTime: 1000 * 60 * 5, // ৫ মিনিটের জন্য ডেটা fresh থাকবে
    });

    // ✅ ডেটা লোড হওয়ার সময় একটি সুন্দর লোডিং UI দেখানো হচ্ছে
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <FiLoader className="animate-spin text-4xl text-indigo-500" />
                <p className="mt-4 text-lg text-gray-600">Loading Store...</p>
            </div>
        );
    }

    // ✅ কোনো এরর হলে তা দেখানো হচ্ছে
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
                <FiAlertCircle className="text-4xl" />
                <p className="mt-4 text-lg font-semibold">Failed to load homepage data.</p>
                <p className="text-sm">{error.message}</p>
            </div>
        );
    }

    // ✅ ডেটা সফলভাবে লোড হওয়ার পর, তা থেকে প্রয়োজনীয় অংশগুলো আলাদা করা হচ্ছে
    const { banners, pageCategories, productSections } = data;

    return (
        <div className="space-y-4">
            {/* --- Top Section --- */}
            <div className="container mx-auto p-4 sm:p-6 space-y-12">
                <Searchbar />
                {/* ✅ Banner এবং Category কম্পোনেন্ট এখন props হিসেবে ডেটা নিচ্ছে */}
                <Banner banners={banners} /> 
                <Category pageCategories={pageCategories} />
            </div>

            {/* --- Product Sections by Category --- */}
            {/* ✅ ProductSection কম্পোনেন্ট এখন props থেকে পাওয়া ডেটা ম্যাপ করে রেন্ডার করছে */}
            {productSections && productSections.map(section => (
                <ProductSection
                    key={section.slug}
                    title={section.title}
                    products={section.products}
                    categorySlug={section.slug !== 'all-products' ? section.slug : undefined}
                />
            ))}
        </div>
    );
};

export default HomePage;