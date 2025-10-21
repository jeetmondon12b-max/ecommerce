
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

