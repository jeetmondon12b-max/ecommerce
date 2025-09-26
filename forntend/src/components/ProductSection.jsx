import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard'; 
import { API_URL } from '../apiConfig'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

// প্রোডাক্ট লোড হওয়ার সময় দেখানোর জন্য স্কেলেটন কম্পোনেন্ট
const ProductSkeleton = () => (
    <div className="border border-gray-200 rounded-xl sm:rounded-2xl p-2 sm:p-4 animate-pulse">
        <div className="bg-gray-200 aspect-square w-full rounded-lg"></div>
        <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-3">
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-4/5"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="pt-2 sm:pt-4 mt-auto">
                <div className="h-6 sm:h-7 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-full mt-3 sm:mt-4"></div>
            </div>
        </div>
    </div>
);

const ProductSection = ({ title, categorySlug }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [isExpanded, setIsExpanded] = useState(false);
    const initialLimit = 8;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            setIsExpanded(false); 
            try {
                // ✅ পরিবর্তন: API URL এখন ডাইনামিক। localhost-এর পরিবর্তে API_URL ব্যবহার করা হয়েছে।
                let endpoint = `${API_URL}/api/products`;
                if (categorySlug) {
                    endpoint += `?category=${categorySlug}`;
                }
                
                const response = await axios.get(endpoint);
                setProducts(response.data.products || []);

            } catch (err) {
                console.error(`Error fetching products for ${title}:`, err);
                setError(`Failed to load ${title}. Please try again.`);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };
        fetchProducts();
    }, [categorySlug, title]);

    const productsToShow = isExpanded ? products : products.slice(0, initialLimit);

    const renderContent = () => {
        const gridClasses = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6";

        if (loading) {
            return (
                <div className={gridClasses}>
                    {Array.from({ length: initialLimit }).map((_, index) => <ProductSkeleton key={index} />)}
                </div>
            );
        }
        if (error) {
            return <p className="text-center text-xl mt-12 text-red-600 font-semibold">{error}</p>;
        }
        if (products.length === 0) {
            return <p className="text-center text-gray-600 text-lg">No products found in this section.</p>;
        }
        return (
            <div>
                <div className={gridClasses}>
                    {productsToShow.map((product) => <ProductCard key={product._id} product={product} />)}
                </div>

                {!isExpanded && products.length > initialLimit && (
                    <div className="text-center mt-10">
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="bg-gray-900 text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                        >
                            See All Products
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="py-12 sm:py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-6 sm:mb-10 text-left">{title}</h2>
                {renderContent()}
            </div>
        </section>
    );
};

export default ProductSection;