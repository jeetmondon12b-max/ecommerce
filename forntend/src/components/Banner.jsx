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
        staleTime: 1000 * 60 * 10,
    });

    const isExternalLink = (url) => /^(https?:\/\/|www\.)/i.test(url);

    if (isLoading) {
        return (
            <div className="w-full aspect-video lg:h-[500px] lg:aspect-auto rounded-2xl bg-gray-200 animate-pulse"></div>
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
                className="w-full aspect-video lg:h-[500px] lg:aspect-auto rounded-2xl"
            >
                {banners.map((slide) => (
                    <SwiperSlide key={slide._id}>
                        {/* পরিবর্তন: ব্যাকগ্রাউন্ড কালার সরিয়ে দেওয়া হয়েছে */}
                        <div className="relative w-full h-full"> 
                            <img
                                src={slide.image}
                                alt={slide.title || 'Banner Image'}
                                // পরিবর্তন: object-contain থেকে object-cover এ ফিরে আসা হয়েছে
                                className="w-full h-full object-cover" 
                                loading="eager"
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
                                            href={slide.link.startsWith('www.') ? `https://
${slide.link}` : slide.link}
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