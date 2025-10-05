import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Banner = ({ banners }) => {
    
    const isExternalLink = (url) => {
        if (!url) return false;
        return /^(https?:\/\/|www\.)/i.test(url);
    };

    if (!banners) {
        return <div className="w-full aspect-[3/2] md:aspect-[16/6] rounded-2xl bg-gray-200 animate-pulse"></div>;
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
                loop={banners.length > 1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }}
                className="w-full aspect-[3/2] md:aspect-[16/6] rounded-2xl bg-gray-100"
            >
                {banners.map((slide) => (
                    <SwiperSlide key={slide._id}>
                        <div className="relative w-full h-full"> 
                            <picture>
                                {/* ✅✅✅ সমাধান: c_fill এর পরিবর্তে c_pad ব্যবহার করা হয়েছে ✅✅✅ */}
                                {/* এর ফলে ছবিটি আর জুম না হয়ে সম্পূর্ণ দেখা যাবে। */}
                                <source 
                                    media="(max-width: 767px)" 
                                    srcSet={slide.image ? slide.image.replace('/upload/', '/upload/ar_3:2,c_pad,b_auto,w_800/') : ''}
                                />
                                <source 
                                    media="(min-width: 768px)" 
                                    srcSet={slide.image || ''}
                                />
                                <img
                                    src={slide.image || ''}
                                    alt={slide.title || 'Banner Image'}
                                    // ✅ সমাধান: object-cover এ ফিরিয়ে আনা হয়েছে কারণ ছবির অনুপাত এখন কন্টেইনারের সাথে মিলে যাবে
                                    className="w-full h-full object-cover" 
                                    loading="eager"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </picture>

                            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center text-white p-4">
                                {slide.title && <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">{slide.title}</h1>}
                                {slide.subtitle && <p className="mt-4 max-w-lg text-lg drop-shadow-md">{slide.subtitle}</p>}
                                {slide.link && ( isExternalLink(slide.link) ? (<a href={slide.link} target="_blank" rel="noopener noreferrer"><button className="mt-8 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg">Shop Now</button></a>) : (<Link to={slide.link}><button className="mt-8 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg">Shop Now</button></Link>) )}
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