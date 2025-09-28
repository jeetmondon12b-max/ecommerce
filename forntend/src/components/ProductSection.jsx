import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { API_URL } from '../apiConfig';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductSkeleton = () => (
    <div className="border border-gray-200 rounded-xl p-3 animate-pulse">
        <div className="bg-gray-200 aspect-square w-full rounded-lg"></div>
        <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
);

// ✅ নতুন পরিবর্তন: onSeeAll prop যুক্ত করা হয়েছে
const ProductSection = ({ title, categorySlug, onSeeAll }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let endpoint = `${API_URL}/api/products?limit=10`;
                if (categorySlug) {
                    endpoint = `${API_URL}/api/products?category=${categorySlug}&limit=10`;
                }
                const { data } = await axios.get(endpoint);
                setProducts(data.products || []);
            } catch (err) {
                setError(`Failed to load ${title}.`);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categorySlug, title]);

    const renderContent = () => {
        if (loading) return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)}
            </div>
        );
        if (error) return <p className="text-center text-red-500">{error}</p>;
        if (products.length === 0) return <p className="text-center text-gray-500">No products found.</p>;

        return (
            <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={16}
                slidesPerView={2}
                loop={products.length > 2}
                autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                navigation={true}
                breakpoints={{
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                }}
                className="w-full"
            >
                {products.map((product) => (
                    <SwiperSlide key={product._id}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    };

    return (
        <section className="py-8">
            <div className="container mx-auto px-4">
           

                {renderContent()}
                
                {/* ✅ পরিবর্তন: ছোট ডিভাইসের জন্যও <button> ব্যবহার করা হয়েছে */}
                {!loading && products.length > 2 && categorySlug && (
                    <div className="text-center mt-8 sm:hidden">
                
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductSection;