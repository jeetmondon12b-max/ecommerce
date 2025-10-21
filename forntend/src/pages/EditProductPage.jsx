import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductForm from '../components/ProductForm'; // পুনরায় ব্যবহারযোগ্য فرمটি ইম্পোর্ট করা হয়েছে
import { FiArrowLeft } from 'react-icons/fi';

const EditProductPage = () => {
    // URL থেকে প্রোডাক্টের ID পাওয়া যাচ্ছে (যেমন: /admin/product/edit/some_id_here)
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto">
                <div className="mb-6">
                    {/* ব্যবহারকারীকে প্রোডাক্ট লিস্টে ফিরে যাওয়ার জন্য একটি বাটন */}
                    <Link 
                        to="/admin/products" 
                        className="flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Product List
                    </Link>
                </div>

                {/* ProductForm কম্পোনেন্টটিকে এখানে ব্যবহার করা হচ্ছে।
                  URL থেকে পাওয়া 'id' টি 'productId' প্রপ হিসেবে পাঠানো হচ্ছে।
                  এর ফলে ProductForm কম্পোনেন্টটি "Edit Mode"-এ চালু হবে।
                */}
                <ProductForm productId={id} />
            </div>
        </div>
    );
};

export default EditProductPage;

