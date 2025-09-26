import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Component Imports
import ProductSection from '../components/ProductSection.jsx';
import Searchbar from '../components/Searchbar.jsx';
import HeroSection from '../components/Banner.jsx'; // Corrected import name
import Category from '../components/Category.jsx';
import Footer from '../components/Footer.jsx';

const HomePage = () => {
    // This state and useEffect are for showing separate product sections for 'Hot Deals', etc.
    const [productCategories, setProductCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductCategories = async () => {
            try {
                setLoading(true);
                // Fetching Product Categories from the backend
                const { data } = await axios.get('/api/categories');
                
                // Ensure the response is an array before setting state
                if (Array.isArray(data)) {
                    setProductCategories(data);
                } else {
                    setProductCategories([]);
                }
            } catch (err) {
                setError('Could not load the page content. Please try again later.');
                console.error("Error fetching product categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductCategories();
    }, []);

    // Page loading and error handling
    if (loading) {
        return <div className="text-center py-40 font-semibold">Loading Homepage...</div>;
    }

    if (error) {
        return <div className="text-center py-40 text-red-500 font-semibold">{error}</div>;
    }

    return (
        <div className="space-y-16">
            <Searchbar />
            
            {/* The HeroSection (banner) component is used here */}
            <HeroSection />
            
            {/* This component shows the main category icons like 'Men', 'Women', etc. */}
            <Category />

            {/* --- Dynamically rendering a ProductSection for each Product Category --- */}
            {productCategories.map(category => (
                <ProductSection 
                    key={category._id}
                    title={category.name}
                    categorySlug={category.slug}
                />
            ))}

            <hr className="my-8 border-gray-200" />
            
            {/* --- A separate section for all products --- */}
            <ProductSection 
                title="All Products"
                // No slug is passed here, so it will show all products
            />
            
            <Footer/>
        </div>
    );
};

export default HomePage;