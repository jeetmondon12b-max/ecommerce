import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig';

// Component Imports
import ProductSection from '../components/ProductSection.jsx';
import Searchbar from '../components/Searchbar.jsx';
import HeroSection from '../components/Banner.jsx';
import Category from '../components/Category.jsx';

const HomePage = () => {
    const [productCategories, setProductCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductCategories = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${API_URL}/api/categories`);
                const categoriesWithProducts = data.filter(cat => cat.productCount > 0);
                setProductCategories(categoriesWithProducts || []);
            } catch (err) {
                setError('Could not load categories. Please try again.');
                console.error("Error fetching product categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductCategories();
    }, []);

    if (error) {
        return <div className="text-center py-40 text-red-500 font-semibold">{error}</div>;
    }

    return (
        <div className="space-y-4">
            {/* --- Top Section --- */}
            <div className="container mx-auto p-4 sm:p-6 space-y-12">
                <Searchbar />
                <HeroSection />
                <Category />
            </div>

            {/* --- Product Sections by Category --- */}
            {loading ? (
                <p className="text-center py-10 font-semibold">Loading product sections...</p>
            ) : (
                productCategories.map(category => (
                    <ProductSection
                        key={category._id}
                        title={category.name}
                        categorySlug={category.slug}
                    />
                ))
            )}

            {/* --- All Products Section --- */}
            {/* ✅✅✅ কোনো পরিবর্তন ছাড়াই এটি এখন কাজ করবে ✅✅✅ */}
            <ProductSection title="All Products" />
        </div>
    );
};

export default HomePage;