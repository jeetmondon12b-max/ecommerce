import React from 'react';
import { useNavigate } from 'react-router-dom';

// ক্যাটাগরি ডেটা (আপনি চাইলে এটি API থেকেও আনতে পারেন)
const categories = [
    { name: 'Women', imageUrl: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Men', imageUrl: 'https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Kids', imageUrl: 'https://images.pexels.com/photos/459957/pexels-photo-459957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Shoes', imageUrl: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Jewelry + Watches', imageUrl: 'https://images.pexels.com/photos/2793132/pexels-photo-2793132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Beauty', imageUrl: 'https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Decor', imageUrl: 'https://images.pexels.com/photos/5825576/pexels-photo-5825576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Home', imageUrl: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

const CategoryMenu = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryName) => {
        // কোনো ক্যাটাগরিতে ক্লিক করলে সেই ক্যাটাগরির প্রোডাক্ট পেজে নিয়ে যাবে
        navigate(`/category/${categoryName}`);
    };

    return (
        <section className="bg-gray-50 py-12 sm:py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
                    What are you shopping for today?
                </h2>
                <div className="flex space-x-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-8 lg:gap-8 lg:space-x-0 lg:overflow-visible">
                    {categories.map((category) => (
                        <div 
                            key={category.name} 
                            className="group flex-shrink-0 flex flex-col items-center text-center cursor-pointer w-28 lg:w-auto" 
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg border-4 border-transparent group-hover:border-indigo-200 group-hover:scale-105 transition-all duration-300">
                                <img className="w-full h-full object-cover" src={category.imageUrl} alt={category.name} />
                            </div>
                            <h3 className="mt-4 text-sm sm:text-md font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                                {category.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryMenu;