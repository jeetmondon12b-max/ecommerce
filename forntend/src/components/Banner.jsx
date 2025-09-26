import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Swiper.js থেকে প্রয়োজনীয় কম্পোনেন্ট ও মডিউল ইম্পোর্ট করুন
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Swiper.js এর স্টাইলশিটগুলো ইম্পোর্ট করুন
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// তীর চিহ্নের জন্য আইকন
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { API_URL } from '../apiConfig'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

const Banner = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // ✅ পরিবর্তন: API URL এখন ডাইনামিক
                const { data } = await axios.get(`${API_URL}/api/banners`);
                if (data && Array.isArray(data.banners)) {
                    setBanners(data.banners);
                }
            } catch (error) {
                console.error("Failed to fetch banners:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // লিঙ্কটি অভ্যন্তরীণ নাকি বাহ্যিক তা চেক করার একটি ফাংশন
    const isExternalLink = (url) => {
        return /^(https?:\/\/|www\.)/i.test(url);
    };

    if (loading) {
        return (
            <div className="w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl bg-gray-200 animate-pulse"></div>
        );
    }

    if (banners.length === 0) {
        return null;
    }

    return (
        <div className="relative group">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                className="w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl"
            >
                {banners.map((slide) => (
                    <SwiperSlide key={slide._id}>
                        <div className="relative w-full h-full">
                            {/* ✅ পরিবর্তন: ছবির URL এখন ডাইনামিক */}
                            <img src={`${API_URL}${slide.image}`} alt={slide.title} className="w-full h-full object-cover" />
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
                                        // যদি লিঙ্কটি বাইরের হয়, তাহলে <a> ট্যাগ ব্যবহার হবে
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
                                        // যদি লিঙ্কটি ভেতরের হয়, তাহলে <Link> ট্যাগ ব্যবহার হবে
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

            {/* কাস্টম নেভিগেশন বাটন (অপরিবর্তিত) */}
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