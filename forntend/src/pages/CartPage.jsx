import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    
    const [selectedItems, setSelectedItems] = useState([]);

    // এই useEffect হুকটি নিশ্চিত করে যে পেজটি লোড হওয়ামাত্র
    // এটি ব্যবহারকারীকে পেজের একদম উপরে নিয়ে যাবে।
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // <-- [] মানে এই ইফেক্ট শুধু একবারই (পেজ লোডের সময়) চলবে

    useEffect(() => {
        setSelectedItems(cartItems.map(item => item.cartId));
    }, [cartItems]);

    const handleSelectItem = (cartId) => {
        setSelectedItems(prev =>
            prev.includes(cartId)
                ? prev.filter(id => id !== cartId)
                : [...prev, cartId]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(cartItems.map(item => item.cartId));
        } else {
            setSelectedItems([]);
        }
    };

    const handleProceedToCheckout = () => {
        const itemsForCheckout = cartItems.filter(item => selectedItems.includes(item.cartId));
        if (itemsForCheckout.length > 0) {
            navigate('/checkout', { state: { items: itemsForCheckout } });
        } else {
            alert("Please select items to proceed to checkout.");
        }
    };

    const isAllSelected = useMemo(() => 
        cartItems.length > 0 && selectedItems.length === cartItems.length,
        [cartItems, selectedItems]
    );
    
    const totalPrice = useMemo(() => 
        cartItems
            .filter(item => selectedItems.includes(item.cartId))
            .reduce((total, item) => total + (item.price || 0) * item.quantity, 0),
        [cartItems, selectedItems]
    );

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20 min-h-[60vh] flex flex-col justify-center items-center">
                <h1 className="mb-4 text-3xl font-bold">Your Cart is Empty</h1>
                <Link to="/" className="font-semibold text-indigo-600 hover:underline">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container p-4 pb-24 mx-auto">
                <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
                <div className="p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                                id="selectAll"
                            />
                            <label htmlFor="selectAll" className="font-semibold text-gray-700 cursor-pointer">
                                {isAllSelected ? "Deselect All" : "Select All"} ({selectedItems.length}/{cartItems.length})
                            </label>
                        </div>
                        <button 
                            onClick={() => selectedItems.forEach(id => removeFromCart(id))} 
                            disabled={selectedItems.length === 0}
                            className="font-medium text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            Remove Selected
                        </button>
                    </div>

                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.cartId} className="flex items-center justify-between py-4 border-b last:border-b-0">
                                <div className="flex items-center flex-grow gap-4">
                                    <input
                                        type="checkbox"
                                        className="flex-shrink-0 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        checked={selectedItems.includes(item.cartId)}
                                        onChange={() => handleSelectItem(item.cartId)}
                                    />
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="object-cover w-20 h-20 rounded"
                                        loading="lazy"
                                        width="80"
                                        height="80"
                                    />
                                    <div className="min-w-0">
                                        <h2 className="text-lg font-bold truncate" title={item.name}>{item.name}</h2>
                                        <p className="text-sm text-gray-500">
                                            {item.size ? `Size: ${item.size}, ` : ''}
                                            {item.customSize ? `${item.customSize.type}: ${item.customSize.value}, ` : ''}
                                            Qty: {item.quantity}
                                        </p> {/* <<< এখানে </U> এর বদলে </p> হবে */}
                                        <p className="font-semibold text-gray-800">৳{(item.price || 0) * item.quantity}</p>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.cartId)} className="p-2 ml-2 text-gray-400 hover:text-red-600">
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sticky flex items-center justify-between p-4 mt-8 bg-white rounded-lg shadow-lg bottom-20 md:bottom-4">
                    <div>
                        <p className="text-gray-600">Selected Items ({selectedItems.length})</p>
                        <h2 className="text-2xl font-bold">Total: ৳{totalPrice.toLocaleString()}</h2>
                    </div>
                    <button 
                        onClick={handleProceedToCheckout}
                        disabled={selectedItems.length === 0}
                        className="px-8 py-3 font-bold text-white transition-colors bg-green-600 rounded-lg shadow-md disabled:bg-gray-400 hover:bg-green-700 hover:shadow-lg disabled:shadow-none"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;