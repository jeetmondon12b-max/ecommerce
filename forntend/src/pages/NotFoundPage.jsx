import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 text-center px-4">
      <div className="max-w-md w-full">
        {/* 404 হেডিং */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-indigo-600 tracking-wider">
          404
        </h1>
        
        {/* পেজের শিরোনাম */}
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-800">
          Oops! Page Not Found
        </h2>
        
        {/* বিস্তারিত বার্তা */}
        <p className="mt-4 text-gray-500">
          We're sorry, but the page you are looking for does not exist. It might have been moved or deleted.
        </p>
        
        {/* হোমপেজে ফিরে যাওয়ার বাটন */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-3 px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiHome />
          <span>Go to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;