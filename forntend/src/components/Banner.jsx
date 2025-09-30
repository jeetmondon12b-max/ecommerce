// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';
// import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import { API_URL } from '../apiConfig';

// const Banner = () => {
//     const [banners, setBanners] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchBanners = async () => {
//             try {
//                 const { data } = await axios.get(`${API_URL}/api/banners`);
//                 if (data && Array.isArray(data.banners)) {
//                     setBanners(data.banners);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch banners:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchBanners();
//     }, []);

//     const isExternalLink = (url) => {
//         return /^(https?:\/\/|www\.)/i.test(url);
//     };

//     if (loading) {
//         return (
//             <div className="w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl bg-gray-200 animate-pulse"></div>
//         );
//     }

//     if (banners.length === 0) {
//         return null;
//     }

//     return (
//         <div className="relative group">
//             <Swiper
//                 modules={[Navigation, Pagination, Autoplay, EffectFade]}
//                 effect="fade"
//                 fadeEffect={{ crossFade: true }}
//                 slidesPerView={1}
//                 loop={true}
//                 autoplay={{
//                     delay: 2500,
//                     disableOnInteraction: false,
//                 }}
//                 pagination={{
//                     clickable: true,
//                 }}
//                 navigation={{
//                     nextEl: '.swiper-button-next-custom',
//                     prevEl: '.swiper-button-prev-custom',
//                 }}
//                 className="w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl"
//             >
//                 {banners.map((slide) => (
//                     <SwiperSlide key={slide._id}>
//                         <div className="relative w-full h-full">
//                             {/* ✅ এখানে আর API_URL লাগবে না */}
//                             <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
//                             <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center text-white p-4">
//                                 {slide.title && (
//                                     <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">
//                                         {slide.title}
//                                     </h1>
//                                 )}
//                                 {slide.subtitle && (
//                                     <p className="mt-4 max-w-lg text-lg drop-shadow-md">
//                                         {slide.subtitle}
//                                     </p>
//                                 )}
                                
//                                 {slide.link && (
//                                     isExternalLink(slide.link) ? (
//                                         <a 
//                                             href={slide.link.startsWith('www.') ? `https://${slide.link}` : slide.link} 
//                                             target="_blank" 
//                                             rel="noopener noreferrer"
//                                         >
//                                             <button className="mt-8 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
//                                                 Shop Now
//                                             </button>
//                                         </a>
//                                     ) : (
//                                         <Link to={slide.link}>
//                                             <button className="mt-8 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
//                                                 Shop Now
//                                             </button>
//                                         </Link>
//                                     )
//                                 )}
//                             </div>
//                         </div>
//                     </SwiperSlide>
//                 ))}
//             </Swiper>

//             <div className="swiper-button-prev-custom absolute top-1/2 left-4 -translate-y-1/2 z-10 p-2 bg-white/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
//                 <FiChevronLeft className="text-gray-800" size={28} />
//             </div>
//             <div className="swiper-button-next-custom absolute top-1/2 right-4 -translate-y-1/2 z-10 p-2 bg-white/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
//                 <FiChevronRight className="text-gray-800" size={28} />
//             </div>
//         </div>
//     );
// };

// export default Banner;

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { API_URL } from '../apiConfig';

const fetchBanners = async () => {
    const { data } = await axios.get(`${API_URL}/api/banners`);
    return data.banners || [];
};

const Banner = () => {
    const { data: banners, isLoading } = useQuery({
        queryKey: ['banners'],
        queryFn: fetchBanners,
        staleTime: 1000 * 60 * 10, // ১০ মিনিটের জন্য ডেটা ক্যাশে থাকবে
    });

    const isExternalLink = (url) => {
        return /^(https?:\/\/|www\.)/i.test(url);
    };

    if (isLoading) {
        return (
            <div className="w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl bg-gray-200 animate-pulse"></div>
        );
    }

    if (!banners || banners.length === 0) {
        return null;
    }

    return (
        <div className="relative group">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                slidesPerView={1}
                loop={banners.length > 1}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                className="w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl"
            >
                {banners.map((slide) => (
                    <SwiperSlide key={slide._id}>
                        <div className="relative w-full h-full">
                            {/* ✅ ফিক্স: আপনার পুরাতন কোডের মতো এখানে আর API_URL যুক্ত করা হয়নি, */}
                            {/* কারণ আপনার সার্ভার থেকে ছবির সম্পূর্ণ URL আসছে। */}
                            <img 
                                src={slide.image} 
                                alt={slide.title || 'Banner Image'} 
                                className="w-full h-full object-cover"
                                loading="eager"
                                fetchpriority="high"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center text-white p-4">
                                {slide.title && (
                                    <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">
                                        {slide.title}
                                    </h1>
                                )}
                                {slide.subtitle && (
                                    <p className="mt-4 max-w-lg text-lg drop-shadow-md">
                                        {slide.subtitle}
                                    </p>
                                )}
                                
                                {slide.link && (
                                    isExternalLink(slide.link) ? (
                                        <a 
                                            href={slide.link.startsWith('www.') ? `https://${slide.link}` : slide.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <button className="mt-8 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
                                                Shop Now
                                            </button>
                                        </a>
                                    ) : (
                                        <Link to={slide.link}>
                                            <button className="mt-8 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
                                                Shop Now
                                            </button>
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="swiper-button-prev-custom absolute top-1/2 left-4 -translate-y-1/2 z-10 p-2 bg-white/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <FiChevronLeft className="text-gray-800" size={28} />
            </div>
            <div className="swiper-button-next-custom absolute top-1/2 right-4 -translate-y-1/2 z-10 p-2 bg-white/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <FiChevronRight className="text-gray-800" size={28} />
            </div>
        </div>
    );
};

export default Banner;  