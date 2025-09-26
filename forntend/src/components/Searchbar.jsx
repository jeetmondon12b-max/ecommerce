import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

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
                const response = await axios.get(`http://localhost:5000/api/products/suggestions?q=${searchQuery}`);
                setSuggestions(response.data);
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
            }
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleSearch = (query) => {
        if (query.trim() === '') return;
        setSuggestions([]);
        navigate(`/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
    };
    
    return (
        <div ref={searchContainerRef} className="w-full max-w-3xl mx-auto relative">
            <div className="relative flex w-full bg-white rounded-full shadow-lg border">
                {/* Category Dropdown */}
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center justify-between h-full px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-l-full">
                        <span>{category}</span>
                        <FiChevronDown className={`ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10">
                            {categories.map((cat) => (
                                <a key={cat} href="#" onClick={(e) => { e.preventDefault(); setCategory(cat); setDropdownOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    {cat}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                {/* Search Input */}
                <div className="flex-grow flex items-center">
                    <FiSearch className="text-gray-400 ml-4" />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="w-full h-full py-3 px-2 bg-transparent focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    />
                </div>
                <button onClick={() => handleSearch(searchQuery)} className="px-8 py-3 font-bold text-white bg-indigo-600 rounded-r-full hover:bg-indigo-700">
                    Search
                </button>
            </div>
            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border z-20">
                    <ul>
                        {suggestions.map((suggestion) => (
                            <li key={suggestion._id} onClick={() => handleSearch(suggestion.name)} className="px-4 py-2 cursor-pointer hover:bg-gray-100">
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