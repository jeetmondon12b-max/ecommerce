import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { API_URL } from '../apiConfig';

const Searchbar = () => {
    const [category, setCategory] = useState('All');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
    const searchContainerRef = useRef(null);

    const categories = ['All', 'Women', 'Men', 'Kids', 'Shoes', 'Beauty', 'Decor'];

    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            setSuggestions([]);
            return;
        }
        const debounceTimer = setTimeout(async () => {
            try {
                const response = await axios.get(`${API_URL}/api/products/suggestions?q=${searchQuery}`);
                setSuggestions(response.data);
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
            }
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setDropdownOpen(false);
                setSuggestions([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (query) => {
        if (query.trim() === '') return;
        setSearchQuery(query);
        setSuggestions([]);
        navigate(`/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
    };
    
    return (
        <div ref={searchContainerRef} className="w-full max-w-3xl mx-auto relative px-4 md:px-0">
            {/* Main container with responsive classes */}
            <div className="relative w-full bg-white rounded-xl md:rounded-full shadow-lg border overflow-hidden flex flex-col md:flex-row">
                
                {/* Search Input - Top on mobile, middle on desktop */}
                <div className="flex-grow flex items-center border-b md:border-b-0 md:border-r order-1 md:order-2">
                    <FiSearch className="text-gray-400 mx-4" />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="w-full h-full py-4 md:py-3 bg-transparent focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    />
                </div>

                {/* Category Dropdown - Left on desktop, part of bottom row on mobile */}
                <div className="relative order-2 md:order-1">
                    <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center justify-between w-full md:w-auto h-full px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 md:rounded-l-full focus:outline-none">
                        <span>{category}</span>
                        <FiChevronDown className={`ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-full md:w-48 bg-white rounded-md shadow-xl z-10">
                            {categories.map((cat) => (
                                <a key={cat} href="#" onClick={(e) => { e.preventDefault(); setCategory(cat); setDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    {cat}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search Button - Right on desktop, part of bottom row on mobile */}
                <button onClick={() => handleSearch(searchQuery)} className="w-full md:w-auto px-8 py-4 md:py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none md:rounded-r-full order-3">
                    Search
                </button>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border z-20">
                    <ul>
                        {suggestions.map((suggestion) => (
                            <li key={suggestion._id} onClick={() => handleSearch(suggestion.name)} className="px-4 py-3 cursor-pointer hover:bg-gray-100">
                                {suggestion.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Searchbar;