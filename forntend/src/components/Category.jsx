// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { API_URL } from '../apiConfig'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

// // ক্যাটাগরি আইকন লোড হওয়ার সময় দেখানোর জন্য স্কেলিটন UI
// const CategorySkeleton = () => (
//     <div className="flex flex-col items-center animate-pulse">
//         <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
//         <div className="mt-4 h-4 bg-gray-200 rounded w-20"></div>
//     </div>
// );

// const Category = () => {
//     const [pageCategories, setPageCategories] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchPageCategories = async () => {
//             try {
//                 setLoading(true);
//                 // ✅ পরিবর্তন: API URL এখন ডাইনামিক। localhost বা রিলেটিভ পাথের পরিবর্তে API_URL ব্যবহার করা হয়েছে।
//                 const { data } = await axios.get(`${API_URL}/api/page-categories`);
//                 if (data && Array.isArray(data.pageCategories)) {
//                     setPageCategories(data.pageCategories);
//                 } else {
//                     setPageCategories([]);
//                 }
//             } catch (error) {
//                 toast.error('Could not load categories.');
//                 console.error("Error fetching page categories:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchPageCategories();
//     }, []);

//     return (
//         <section className="bg-white py-12 sm:py-16">
//             <div className="container mx-auto px-4">
//                 <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
//                     What are you shopping for today?
//                 </h2>
//                 <div className="flex space-x-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-8 lg:gap-8 lg:space-x-0 lg:overflow-visible">
//                     {loading ? (
//                         // লোডিং অবস্থায় ৮টি স্কেলিটন দেখানো হবে
//                         Array.from({ length: 8 }).map((_, index) => <CategorySkeleton key={index} />)
//                     ) : (
//                         // ডাটাবেস থেকে আসা ডাইনামিক ক্যাটাগরি ম্যাপ করা হচ্ছে
//                         pageCategories.map((category) => (
//                             <Link
//                                 key={category._id}
//                                 to={`/page/${encodeURIComponent(category.name)}`}
//                                 className="group flex-shrink-0 flex flex-col items-center text-center w-28 lg:w-auto"
//                             >
//                                 <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg border-4 border-transparent group-hover:border-indigo-200 group-hover:scale-105 transition-all">
//                                     <img 
//                                         className="w-full h-full object-cover" 
//                                         // ✅ পরিবর্তন: ছবির URL এখন ডাইনামিক। localhost-এর পরিবর্তে API_URL ব্যবহার করা হয়েছে।
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig';

// ক্যাটাগরি আইকন লোড হওয়ার সময় দেখানোর জন্য স্কেলিটন UI
const CategorySkeleton = () => (
    <div className="flex flex-col items-center flex-shrink-0 w-28 lg:w-auto animate-pulse">
        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        <div className="mt-4 h-4 bg-gray-200 rounded w-20"></div>
    </div>
);

const Category = () => {
    const [pageCategories, setPageCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPageCategories = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${API_URL}/api/page-categories`);
                if (data && Array.isArray(data.pageCategories)) {
                    setPageCategories(data.pageCategories);
                } else {
                    setPageCategories([]);
                }
            } catch (error) {
                toast.error('Could not load categories.');
                console.error("Error fetching page categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPageCategories();
    }, []);

    return (
        <section className="bg-white py-12 sm:py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
                    What are you shopping for today?
                </h2>
                {/* ✅ পরিবর্তন: 
                  - ছোট ডিভাইসের জন্য horizontal scrollbar ডিজাইন করা হয়েছে।
                  - বড় ডিভাইসের (lg) জন্য এটি একটি ৮ কলামের গ্রিড হবে।
                */}
                <div className="flex space-x-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-8 lg:gap-8 lg:space-x-0 lg:overflow-visible no-scrollbar">
                    {loading ? (
                        // লোডিং অবস্থায় ৮টি স্কেলিটন দেখানো হবে
                        Array.from({ length: 8 }).map((_, index) => <CategorySkeleton key={index} />)
                    ) : (
                        // ডাটাবেস থেকে আসা ডাইনামিক ক্যাটাগরি ম্যাপ করা হচ্ছে
                        pageCategories.map((category) => (
                            <Link
                                key={category._id}
                                to={`/page/${encodeURIComponent(category.name)}`}
                                className="group flex-shrink-0 flex flex-col items-center text-center w-28 lg:w-auto"
                            >
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg border-4 border-transparent group-hover:border-indigo-200 group-hover:scale-105 transition-all duration-300">
                                    <img 
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