
// import React from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import ProductCard from './ProductCard';
// import { API_URL } from '../apiConfig';
// import { useQuery } from '@tanstack/react-query'; // ✅ পরিবর্তন: useQuery ইম্পোর্ট করা হয়েছে

// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';

// const ProductSkeleton = () => (
//     <div className="border border-gray-200 rounded-xl p-3 animate-pulse">
//         <div className="bg-gray-200 aspect-square w-full rounded-lg"></div>
//         <div className="mt-3 space-y-2">
//             <div className="h-4 bg-gray-200 rounded w-4/5"></div>
//             <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//         </div>
//     </div>
// );

// // ✅ পরিবর্তন: ডেটা আনার জন্য একটি আলাদা async ফাংশন তৈরি করা হয়েছে
// const fetchProducts = async (categorySlug) => {
//     const endpoint = categorySlug
//         ? `${API_URL}/api/products?category=${categorySlug}&limit=10`
//         : `${API_URL}/api/products?limit=10`;
    
//     const { data } = await axios.get(endpoint);
//     return data.products || [];
// };

// const ProductSection = ({ title, categorySlug }) => {
//     // ✅ পরিবর্তন: useState এবং useEffect এর পরিবর্তে useQuery ব্যবহার করা হয়েছে
//     const { 
//         data: products, 
//         isLoading, 
//         isError, 
//         error 
//     } = useQuery({
//         // প্রতিটি ক্যাটাগরির জন্য ইউনিক query key, যা ক্যাশিং এর জন্য জরুরি
//         queryKey: ['products', categorySlug || 'all-products'], 
//         queryFn: () => fetchProducts(categorySlug),
//         staleTime: 1000 * 60 * 5, // ৫ মিনিটের জন্য ডেটা stale হবে না
//     });

//     const renderContent = () => {
//         if (isLoading) {
//             return (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                     {Array.from({ length: 5 }).map((_, index) => <ProductSkeleton key={index} />)}
//                 </div>
//             );
//         }
//         if (isError) return <p className="text-center text-red-500 py-8">Error: {error.message}</p>;
//         if (!products || products.length === 0) return <p className="text-center text-gray-500 py-8">No products found in this section.</p>;

//         return (
//             <Swiper
//                 modules={[Autoplay, Navigation]}
//                 spaceBetween={16}
//                 slidesPerView={2}
//                 loop={products.length > 5}
//                 autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
//                 navigation={true}
//                 breakpoints={{
//                     640: { slidesPerView: 3 },
//                     768: { slidesPerView: 4 },
//                     1024: { slidesPerView: 5 },
//                 }}
//                 className="w-full"
//             >
//                 {products.map((product) => (
//                     <SwiperSlide key={product._id}>
//                         <ProductCard product={product} />
//                     </SwiperSlide>
//                 ))}
//             </Swiper>
//         );
//     };

//     const viewAllLink = categorySlug ? `/category/${categorySlug}` : `/page/all-products`;

//     return (
//         <section className="py-8 sm:py-12">
//             <div className="container mx-auto px-4">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h2>
//                     <Link
//                         to={viewAllLink}
//                         className="hidden sm:inline-block bg-gray-200 text-gray-800 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
//                     >
//                         {categorySlug ? 'See All' : 'View All Products'}
//                     </Link>
//                 </div>

//                 {renderContent()}
                
//                 {!isLoading && products && products.length > 0 && (
//                     <div className="text-center mt-8 sm:hidden">
//                         <Link
//                             to={viewAllLink}
//                             className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
//                         >
//                             {categorySlug ? `View All ${title}` : 'View All Products'}
//                         </Link>
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default ProductSection;


import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './ProductCard';
import { API_URL } from '../apiConfig';
import { useQuery } from '@tanstack/react-query';

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

const fetchProducts = async (categorySlug) => {
    const endpoint = categorySlug
        ? `${API_URL}/api/products?category=${categorySlug}&limit=10`
        : `${API_URL}/api/products?limit=10`;
    
    const { data } = await axios.get(endpoint);
    return data.products || [];
};

const ProductSection = ({ title, categorySlug }) => {
    const { 
        data: products, 
        isLoading, 
        isError, 
        error 
    } = useQuery({
        queryKey: ['products', categorySlug || 'all-products'], 
        queryFn: () => fetchProducts(categorySlug),
        staleTime: 1000 * 60 * 5, // ৫ মিনিটের জন্য ডেটা ক্যাশে থাকবে
    });

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, index) => <ProductSkeleton key={index} />)}
                </div>
            );
        }
        if (isError) return <p className="text-center text-red-500 py-8">Error: {error.message}</p>;
        if (!products || products.length === 0) return <p className="text-center text-gray-500 py-8">No products found in this section.</p>;

        return (
            <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={16}
                slidesPerView={2}
                loop={products.length > 5}
                autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
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

    const viewAllLink = categorySlug ? `/category/${categorySlug}` : `/page/all-products`;

    return (
        <section className="py-8 sm:py-12">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h2>
                    <Link
                        to={viewAllLink}
                        className="hidden sm:inline-block bg-gray-200 text-gray-800 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                    >
                        {categorySlug ? 'See All' : 'View All Products'}
                    </Link>
                </div>

                {renderContent()}
                
                {!isLoading && products && products.length > 0 && (
                    <div className="text-center mt-8 sm:hidden">
                        <Link
                            to={viewAllLink}
                            className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            {categorySlug ? `View All ${title}` : 'View All Products'}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductSection;