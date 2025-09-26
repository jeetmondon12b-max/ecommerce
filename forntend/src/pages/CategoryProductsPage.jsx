import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../apiConfig'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

const ProductCard = ({ product }) => (
    <Link to={`/product/${product._id}`} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <div className="aspect-square w-full overflow-hidden bg-gray-50">
            <img 
                src={`${API_URL}${product.image}`} // ✅ পরিবর্তন: ছবির URL এখন ডাইনামিক
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
        </div>
        <div className="p-3 flex flex-col flex-grow">
            <h3 className="font-bold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">{product.name}</h3>
            <div className="mt-auto pt-2">
                <p className="text-lg font-extrabold text-gray-900">৳{product.discountPrice || product.regularPrice}</p>
                {product.discountPrice && <p className="text-sm text-gray-400 line-through">৳{product.regularPrice}</p>}
            </div>
        </div>
    </Link>
);

const ProductCardSkeleton = () => (
    <div className="border rounded-xl p-4 shadow-sm animate-pulse">
        <div className="bg-gray-200 w-full aspect-square rounded-md mb-4"></div>
        <div className="bg-gray-200 h-6 w-3/4 rounded-md mb-2"></div>
        <div className="bg-gray-200 h-5 w-1/4 rounded-md"></div>
    </div>
);

const CategoryProductsPage = () => {
    const { pageCategoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!pageCategoryName) return;
            setLoading(true);
            setError(null);
            
            console.log(`Fetching products for page category: ${pageCategoryName}`);

            try {
                // ✅ পরিবর্তন: API URL এখন ডাইনামিক
                const { data } = await axios.get(`${API_URL}/api/products?pageCategory=${pageCategoryName}`);
                
                console.log('Received data from API:', data);

                setProducts(data.products || []);
                
            } catch (err) {
                console.error("Error fetching products:", err);
                setError('Failed to fetch products.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [pageCategoryName]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">
                {loading ? 'Loading Category...' : `Products in: `}
                <span className="text-indigo-600">{!loading && pageCategoryName}</span>
            </h1>
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 10 }).map((_, index) => <ProductCardSkeleton key={index} />)}
                </div>
            ) : error ? (
                <p className="text-center py-20 text-red-500">{error}</p>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {products.map(product => <ProductCard key={product._id} product={product} />)}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-600">No products found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default CategoryProductsPage;
