import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { FaShoppingCart, FaShippingFast, FaCheckCircle, FaHeart } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { API_URL } from '../apiConfig.js'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

// Skeleton Loader Component
const ProductDetailSkeleton = () => (
    <div className="container mx-auto max-w-5xl p-4 my-6 sm:my-10 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
                <div className="w-full bg-gray-200 rounded-lg aspect-square"></div>
                <div className="flex space-x-4 mt-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded w-4/5"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mt-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex gap-4 mt-6">
                    <div className="h-14 bg-gray-200 rounded-lg flex-1"></div>
                    <div className="h-14 bg-gray-200 rounded-lg flex-1"></div>
                </div>
            </div>
        </div>
    </div>
);

export default function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo } = useAuth();
    const { cartItems, addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [sizeError, setSizeError] = useState('');
    
    // কাস্টম সাইজের জন্য state
    const [selectedCustomSize, setSelectedCustomSize] = useState({});

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // ✅ পরিবর্তন: API URL এখন ডাইনামিক
                const { data } = await axios.get(`${API_URL}/api/products/${id}`);
                setProduct(data);
                if (data.image) {
                    // ✅ পরিবর্তন: ছবির URL এখন ডাইনামিক
                    setMainImage(`${API_URL}${data.image}`);
                }
            } catch (error) {
                toast.error("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };
        window.scrollTo(0, 0);
        fetchProduct();
    }, [id]);
    
    const handleAddToCart = () => {
        const hasSizes = (product.sizes?.standard?.length > 0 || product.sizes?.custom?.length > 0);
        if (hasSizes && !selectedSize && !selectedCustomSize.value) {
            setSizeError("Please select a size.");
            toast.error("Please select a size.");
            return;
        }
        const finalPrice = product.discountPrice || product.regularPrice;
        addToCart({ 
            ...product, 
            price: finalPrice, 
            quantity, 
            size: selectedSize,
            customSize: selectedCustomSize.value ? selectedCustomSize : undefined,
        });
        toast.success(`${product.name} added to cart!`);
    };

    const handleOrderNow = () => {
        if (!userInfo) {
            navigate('/login', { state: { from: location } });
            return;
        }
        const hasSizes = (product.sizes?.standard?.length > 0 || product.sizes?.custom?.length > 0);
        if (hasSizes && !selectedSize && !selectedCustomSize.value) {
            setSizeError("Please select a size.");
            toast.error("Please select a size.");
            return;
        }
        const finalPrice = product.discountPrice || product.regularPrice;
        const productForCheckout = { 
            ...product, 
            price: finalPrice, 
            quantity, 
            size: selectedSize,
            customSize: selectedCustomSize.value ? selectedCustomSize : undefined,
        };
        
        navigate("/checkout", { state: { items: [productForCheckout] } });
    };

    const handleAddToWishlist = async () => {
        if (!userInfo) {
            toast.error('Please log in to add to your wishlist.');
            navigate('/login', { state: { from: location } });
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            // ✅ পরিবর্তন: API URL এখন ডাইনামিক
            await axios.post(`${API_URL}/api/wishlist`, { productId: product._id }, config);
            toast.success('Added to your wishlist!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not add to wishlist.');
        }
    };

    if (loading) return <ProductDetailSkeleton />;
    if (!product) return <p className="text-center text-red-500 text-2xl my-12">Product not found!</p>;
    
    const finalPrice = product.discountPrice || product.regularPrice;
    const totalPrice = finalPrice * quantity;
    const allImages = [product.image, ...(product.productImages || [])].filter(Boolean);
    
    const isAlreadyInCart = cartItems.some(item => {
        let sizeIdentifier = 'default';
        if (selectedSize) {
            sizeIdentifier = selectedSize;
        } else if (selectedCustomSize.value) {
            sizeIdentifier = `${selectedCustomSize.type}-${selectedCustomSize.value}`;
        }
        const cartId = `${product._id}-${sizeIdentifier}`;
        return item.cartId === cartId;
    });

    return (
        <div className="bg-gray-50 min-h-screen">
            <Toaster position="top-center" />
            <div className="container mx-auto max-w-5xl p-4 my-6 sm:my-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Images Section */}
                    <div>
                        <div className="aspect-square w-full overflow-hidden rounded-lg shadow-lg mb-4 bg-white">
                            <img src={mainImage} alt={product.name} className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {allImages.map((img, index) => (
                                <img key={index} 
                                    // ✅ পরিবর্তন: ছবির URL এখন ডাইনামিক
                                    src={`${API_URL}${img}`} 
                                    alt={`gallery-${index}`}
                                    className={`flex-shrink-0 w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all ${mainImage.includes(img) ? 'border-indigo-500 scale-105' : 'border-transparent hover:border-gray-300'}`}
                                    // ✅ পরিবর্তন: ছবির URL এখন ডাইনামিক
                                    onClick={() => setMainImage(`${API_URL}${img}`)}
                                />
                            ))}
                        </div>
                    </div>
                    {/* Product Info Section */}
                    <div className="flex flex-col space-y-5">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{product.name}</h1>
                        <p className="font-semibold text-gray-700">Brand: <span className="text-indigo-600">{product.brand || 'N/A'}</span></p>
                        
                        <div className="flex items-center gap-4">
                            {product.countInStock > 0 ? (
                                <span className="text-green-600 bg-green-100 font-semibold px-3 py-1 rounded-full text-sm">
                                    In Stock: {product.countInStock} items
                                </span>
                            ) : (
                                <span className="text-red-600 bg-red-100 font-semibold px-3 py-1 rounded-full text-sm">
                                    Out of Stock
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-baseline gap-3">
                            <p className="text-3xl font-bold text-indigo-600">৳{finalPrice}</p>
                            {product.discountPrice && product.discountPrice < product.regularPrice && <p className="text-xl text-gray-400 line-through">৳{product.regularPrice}</p>}
                        </div>

                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        
                        {/* Standard Sizes */}
                        {product.sizes?.standard?.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-md font-semibold text-gray-800">Select Size:</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.standard.map(size => (
                                        <button key={size} onClick={() => { setSelectedSize(size); setSelectedCustomSize({}); setSizeError(''); }} 
                                            className={`px-5 py-2 text-sm font-semibold border rounded-lg transition-all ${selectedSize === size ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 hover:border-gray-400'}`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom Sizes */}
                        {product.sizes?.custom?.map((customSizeGroup) => (
                            <div key={customSizeGroup.type} className="space-y-3">
                                <h3 className="text-md font-semibold text-gray-800">Select {customSizeGroup.type}:</h3>
                                <div className="flex flex-wrap gap-3">
                                    {customSizeGroup.values.map(value => (
                                        <button key={value} onClick={() => { setSelectedCustomSize({ type: customSizeGroup.type, value }); setSelectedSize(''); setSizeError(''); }}
                                            className={`px-5 py-2 text-sm font-semibold border rounded-lg transition-all ${selectedCustomSize.value === value ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 hover:border-gray-400'}`}>
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {sizeError && <p className="text-red-500 text-sm font-semibold pt-1">{sizeError}</p>}

                        <div className="bg-gray-100 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h3 className="text-md font-semibold text-gray-800">Quantity:</h3>
                                <div className="flex items-center border rounded-lg overflow-hidden bg-white shadow-sm">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold text-lg"> − </button>
                                    <span className="px-6 py-2 font-semibold text-gray-800 text-lg">{quantity}</span>
                                    <button onClick={() => setQuantity(q => Math.min(product.countInStock || 1, q + 1))} className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold text-lg"> + </button>
                                </div>
                            </div>
                            <div className="text-center sm:text-right">
                                <span className="text-sm text-gray-600 block">Total Price</span>
                                <span className="font-bold text-green-600 text-2xl">৳{totalPrice}</span>
                            </div>
                        </div>
                        
                        <div className="pt-4 space-y-4">
                            {product.countInStock > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {isAlreadyInCart ? (
                                        <button disabled className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-500 py-3 rounded-lg text-md font-semibold cursor-not-allowed">
                                            <FaCheckCircle /> Added to Cart
                                        </button>
                                    ) : (
                                        <button onClick={handleAddToCart} className="w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 py-3 rounded-lg text-md font-semibold hover:bg-indigo-200 transition-colors">
                                            <FaShoppingCart /> Add to Cart
                                        </button>
                                    )}
                                    <button onClick={handleOrderNow} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg text-md font-semibold hover:bg-green-700 transition-colors">
                                        <FaShippingFast /> Order Now
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <button disabled className="w-full text-center py-3 rounded-lg bg-gray-300 text-gray-600 font-semibold cursor-not-allowed">
                                        Out of Stock
                                    </button>
                                    <button onClick={handleAddToWishlist} className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white py-3 rounded-lg text-md font-semibold hover:bg-pink-600 transition-colors">
                                        <FaHeart /> Add to Wishlist
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}