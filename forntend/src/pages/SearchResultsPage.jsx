import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Searchbar from '../components/Searchbar';

const SearchResultsPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setSearchResults([]);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://localhost:5000/api/products/search?q=${query}&category=${category}`);
                setSearchResults(response.data);
            } catch (err) {
                setError('Failed to fetch search results. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSearchResults();
    }, [query, category]);

    return (
        <div>
            <Searchbar />
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Search Results for: <span className="text-blue-600">"{query}"</span>
                </h2>
                {isLoading && <p className="text-center py-10">Loading products...</p>}
                {error && <p className="text-center py-10 text-red-500">{error}</p>}
                {!isLoading && !error && (
                    searchResults.length === 0 ? (
                        <p className="text-center py-10 text-gray-500">No products found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {searchResults.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;
