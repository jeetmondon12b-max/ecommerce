// import React from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useQuery } from '@tanstack/react-query';
// import { API_URL } from '../apiConfig';
// import LazyImage from './LazyImage';

// // Skeleton Loader কম্পোনেন্ট
// const CategorySkeleton = () => (
//     <div className="flex flex-col items-center flex-shrink-0 w-28 lg:w-auto animate-pulse">
//         {/* পরিবর্তন: স্কেলেটন এখন চারকোণা */}
//         <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
//         <div className="mt-4 h-4 bg-gray-200 rounded w-20"></div>
//     </div>
// );

// // API থেকে page categories আনার জন্য ফাংশন
// const fetchPageCategories = async () => {
//     const { data } = await axios.get(`${API_URL}/api/page-categories`);
//     return data.pageCategories || [];
// };

// const Category = () => {
//     const { data: pageCategories, isLoading, isError } = useQuery({
//         queryKey: ['pageCategories'],
//         queryFn: fetchPageCategories,
//         staleTime: 1000 * 60 * 5,
//     });

//     if (isError) {
//         toast.error('Could not load categories.');
//         return null;
//     }

//     return (
//         <section className="bg-white py-12 sm:py-16">
//             <div className="container mx-auto px-4">
//                 <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
//                     What are you shopping for today?
//                 </h2>
//                 <div className="flex space-x-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-8 lg:gap-8 lg:space-x-0 lg:overflow-visible no-scrollbar">
//                     {isLoading ? (
//                         Array.from({ length: 8 }).map((_, index) => <CategorySkeleton key={index} />)
//                     ) : (
//                         pageCategories?.map((category) => (
//                             <Link
//                                 key={category._id}
//                                 to={`/page-category/${encodeURIComponent(category.name)}`}
//                                 className="group flex-shrink-0 flex flex-col items-center text-center w-28 lg:w-auto"
//                             >
//                                 {/* ✅ পরিবর্তন: এখানে ডিজাইন গোলাকার থেকে চারকোণা করা হয়েছে */}
//                                 <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
//                                     <LazyImage
//                                         className="w-full h-full object-cover"
//                                         src={`${API_URL}${category.image}`}
//                                         alt={category.name}
//                                     />
//                                 </div>
//                                 <h3 className="mt-4 text-sm sm:text-md font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
//                                     {category.name}
//                                 </h3>
//                             </Link>
//                         ))
//                     )}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Category;


import React from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios'; // ❌ অপ্রয়োজনীয়, তাই মুছে ফেলা হয়েছে
// import toast from 'react-hot-toast'; // ❌ অপ্রয়োজনীয়, তাই মুছে ফেলা হয়েছে
// import { useQuery } from '@tanstack/react-query'; // ❌ অপ্রয়োজনীয়, তাই মুছে ফেলা হয়েছে
import { API_URL } from '../apiConfig';
import LazyImage from './LazyImage';

// Skeleton Loader কম্পোনেন্ট (অপরিবর্তিত)
const CategorySkeleton = () => (
    <div className="flex flex-col items-center flex-shrink-0 w-28 lg-w-auto animate-pulse">
        <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
        <div className="mt-4 h-4 bg-gray-200 rounded w-20"></div>
    </div>
);

// ❌ fetchPageCategories ফাংশনটি এখান থেকে মুছে ফেলা হয়েছে

// ✅ কম্পোনেন্টটি এখন props থেকে সরাসরি pageCategories ডেটা গ্রহণ করে
const Category = ({ pageCategories }) => {
    // ❌ useQuery এবং isError সম্পর্কিত কোড মুছে ফেলা হয়েছে

    return (
        <section className="bg-white py-12 sm:py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
                    What are you shopping for today?
                </h2>
                <div className="flex space-x-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-8 lg:gap-8 lg:space-x-0 lg:overflow-visible no-scrollbar">
                    {/* ✅ isLoading এর পরিবর্তে pageCategories prop আছে কিনা তা চেক করা হচ্ছে */}
                    {!pageCategories ? (
                        // HomePage থেকে ডেটা লোড হওয়ার আগ পর্যন্ত স্কেলেটন দেখানো হবে
                        Array.from({ length: 8 }).map((_, index) => <CategorySkeleton key={index} />)
                    ) : (
                        // ডেটা পাওয়ার পর ক্যাটাগরিগুলো দেখানো হবে
                        pageCategories.map((category) => (
                            <Link
                                key={category._id}
                                to={`/page-category/${encodeURIComponent(category.name)}`}
                                className="group flex-shrink-0 flex flex-col items-center text-center w-28 lg:w-auto"
                            >
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                                    <LazyImage
                                        className="w-full h-full object-cover"
                                        src={`${API_URL}${category.image}`}
                                        alt={category.name}
                                    />
                                </div>
                                <h3 className="mt-4 text-sm sm:text-md font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                    {category.name}
                                </h3>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default Category;