import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { API_URL } from '../apiConfig'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

const ProductCard = ({ product }) => {
    const id = product?._id;
    const name = product?.name ?? 'Unnamed Product';
    const brand = product?.brand ?? 'N/A';
    const currentPrice = product?.discountPrice ?? product?.regularPrice ?? 0;
    const oldPrice = product?.regularPrice > currentPrice ? product.regularPrice : null;
    
    // ✅ পরিবর্তন: ছবির URL এখন API_URL থেকে আসবে
    const imageUrl = product?.image ? `${API_URL}${product.image}` : "/placeholder-image.jpg";
    
    const discount = product?.discountPercentage > 0 ? product.discountPercentage : null;
    
    const rating = product?.rating || 0;
    const reviewCount = product?.numReviews || 0;

    return (
        <div className="group relative bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
            
            <Link to={`/product/${id}`} className="block">
                <div className="aspect-square w-full overflow-hidden bg-gray-100">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-image.jpg"; }}
                    />
                </div>
            </Link>
            
            {/* ... বাকি কোড অপরিবর্তিত ... */}
            
            <div className="p-2 sm:p-3 flex flex-col flex-grow">
                <Link to={`/product/${id}`} className="block">
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 truncate group-hover:text-indigo-600 transition-colors" title={name}>{name}</h3>
                    <p className="hidden sm:block text-xs text-gray-500 mt-1">Brand: {brand}</p>
                </Link>
                
                <div className="flex items-center mt-1 sm:mt-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    {reviewCount > 0 && (
                        <span className="text-[10px] sm:text-xs text-gray-500 ml-1.5">({reviewCount})</span>
                    )}
                </div>

                <div className="mt-auto pt-2 sm:pt-3">
                    <div className="flex justify-between items-center">
                        <p className="text-lg sm:text-xl font-extrabold text-gray-900">৳{currentPrice}</p>
                        {oldPrice && <p className="text-xs sm:text-sm text-gray-400 line-through">৳{oldPrice}</p>}
                    </div>
                    <Link
                        to={`/product/${id}`}
                        className="w-full mt-2 sm:mt-3 bg-gray-900 text-white py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-700 transition-colors duration-300"
                    >
                        <FaShoppingCart className="h-3.5 w-3.5" />
                        <span>Add to Cart</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;