import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { API_URL } from '../apiConfig.js'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

const CartPage = () => {
    const { cartItems, removeFromCart } = useCart();
    const navigate = useNavigate();
    
    // ✅ কোন কোন আইটেম সিলেক্ট করা হয়েছে তার জন্য নতুন স্টেট
    const [selectedItems, setSelectedItems] = useState([]);

    // ✅ যখনই cartItems পরিবর্তন হবে, selectedItems আপডেট হবে
    useEffect(() => {
        // প্রাথমিকভাবে সব আইটেম সিলেক্ট করা থাকবে
        setSelectedItems(cartItems.map(item => item.cartId));
    }, [cartItems]);

    // ✅ একটি আইটেম সিলেক্ট/ডিসিলেক্ট করার ফাংশন
    const handleSelectItem = (cartId) => {
        setSelectedItems(prev =>
            prev.includes(cartId)
                ? prev.filter(id => id !== cartId)
                : [...prev, cartId]
        );
    };

    // ✅ সব 아이টেম একসাথে সিলেক্ট/ডিসিলেক্ট করার ফাংশন
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(cartItems.map(item => item.cartId));
        } else {
            setSelectedItems([]);
        }
    };

    // ✅ চেকআউটে যাওয়ার ফাংশন
    const handleProceedToCheckout = () => {
        const itemsForCheckout = cartItems.filter(item => selectedItems.includes(item.cartId));
        if (itemsForCheckout.length > 0) {
            // সিলেক্ট করা আইটেমগুলোসহ চেকআউট পেজে নেভিগেট করুন
            navigate('/checkout', { state: { items: itemsForCheckout } });
        } else {
            alert("Please select items to proceed to checkout.");
        }
    };

    const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;
    
    const totalPrice = cartItems
        .filter(item => selectedItems.includes(item.cartId))
        .reduce((total, item) => total + (item.discountPrice || item.regularPrice) * item.quantity, 0);

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <Link to="/" className="text-indigo-600 font-semibold">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 pb-24">
                <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
                <div className="bg-white p-4 rounded-lg shadow">
                    {/* Select All Checkbox */}
                    <div className="flex items-center justify-between border-b pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                            />
                            <label className="font-semibold text-gray-700">
                                {isAllSelected ? "Deselect All" : "Select All"} ({selectedItems.length}/{cartItems.length})
                            </label>
                        </div>
                        <button onClick={() => selectedItems.forEach(id => removeFromCart(id))} className="text-red-500 hover:text-red-700 font-medium">
                            Remove Selected
                        </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.cartId} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={selectedItems.includes(item.cartId)}
                                        onChange={() => handleSelectItem(item.cartId)}
                                    />
                                    {/* ✅ পরিবর্তন: ছবির URL এখন ডাইনামিক */}
                                    <img src={`${API_URL}${item.image}`} alt={item.name} className="w-20 h-20 object-cover rounded"/>
                                    <div>
                                        <h2 className="font-bold text-lg">{item.name}</h2>
                                        <p className="text-sm text-gray-500">Size: {item.size || 'N/A'}, Qty: {item.quantity}</p>
                                        <p className="text-gray-800 font-semibold">৳{(item.discountPrice || item.regularPrice) * item.quantity}</p>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-600 p-2">
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Checkout Section */}
                <div className="mt-8 bg-white p-4 rounded-lg shadow flex items-center justify-between">
                    <div>
                        <p className="text-gray-600">Selected Items ({selectedItems.length})</p>
                        <h2 className="text-2xl font-bold">Total: ৳{totalPrice}</h2>
                    </div>
                    <button 
                        onClick={handleProceedToCheckout}
                        disabled={selectedItems.length === 0}
                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg disabled:bg-gray-400 hover:bg-green-700 transition-colors"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
