import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Searchbar from '../components/Searchbar';
import { API_URL } from '../apiConfig';
import { FiLoader } from 'react-icons/fi'; // লোডিং আইকন

const SearchResultsPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // আরও প্রোডাক্ট আছে কিনা তা ট্র্যাক করতে
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    // নতুন সার্চ কোয়েরির জন্য স্টেট রিসেট করুন
    useEffect(() => {
        setSearchResults([]);
        setPage(1);
        setHasMore(true);
    }, [query, category]);

    // ডেটা লোড করার জন্য useEffect
    useEffect(() => {
        if (!query) {
            setSearchResults([]);
            setIsLoading(false);
            return;
        }

        // যদি আর কোনো প্রোডাক্ট না থাকে তবে লোড করা বন্ধ করুন
        if (!hasMore) return;

        const fetchSearchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 🚀 পরিবর্তন: API কলে page এবং limit যোগ করা হয়েছে
                const { data } = await axios.get(`${API_URL}/api/products/search`, {
                    params: { q: query, category, page, limit: 12 } // প্রতিবারে ১২টি প্রোডাক্ট লোড হবে
                });
                
                // নতুন প্রোডাক্টগুলো আগের লিস্টের সাথে যোগ করুন
                setSearchResults(prev => [...prev, ...data.products]);
                // সার্ভার থেকে আসা তথ্য অনুযায়ী hasMore স্টেট আপডেট করুন
                setHasMore(page < data.totalPages);

            } catch (err) {
                setError('Failed to fetch search results. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, category, page, hasMore]);

    // 🚀 ইনফিনিট স্ক্রলের জন্য Intersection Observer
    const observer = useRef();
    const lastProductElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1); // নতুন পেজ লোড করুন
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    return (
        <div>
            <Searchbar />
            <div className="mt-8 container mx-auto px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Search Results for: <span className="text-blue-600">"{query}"</span>
                </h2>
                
                {error && <p className="text-center py-10 text-red-500">{error}</p>}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {searchResults.map((product, index) => {
                        // 🚀 শেষের প্রোডাক্টে ref যোগ করা হয়েছে
                        if (searchResults.length === index + 1) {
                            return (
                                <div ref={lastProductElementRef} key={product._id}>
                                    <ProductCard product={product} />
                                </div>
                            );
                        } else {
                            return <ProductCard key={product._id} product={product} />;
                        }
                    })}
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center py-10">
                        <FiLoader className="animate-spin text-3xl text-indigo-500" />
                        <p className="ml-2">Loading products...</p>
                    </div>
                )}
                
                {!isLoading && !error && searchResults.length === 0 && (
                     <p className="text-center py-10 text-gray-500">No products found.</p>
                )}

                {!hasMore && searchResults.length > 0 && (
                    <p className="text-center py-10 text-gray-500">You have seen all results.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;