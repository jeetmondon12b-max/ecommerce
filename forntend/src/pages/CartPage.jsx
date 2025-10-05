// import React, { useState, useEffect, useMemo } from 'react'; // 🚀 useMemo যোগ করা হয়েছে
// import { useCart } from '../context/CartContext.jsx';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaTrash } from 'react-icons/fa';
// import { API_URL } from '../apiConfig.js';

// const CartPage = () => {
//     const { cartItems, removeFromCart } = useCart();
//     const navigate = useNavigate();
    
//     const [selectedItems, setSelectedItems] = useState([]);

//     useEffect(() => {
//         // প্রাথমিকভাবে সব আইটেম সিলেক্ট করা থাকবে
//         setSelectedItems(cartItems.map(item => item.cartId));
//     }, [cartItems]);

//     const handleSelectItem = (cartId) => {
//         setSelectedItems(prev =>
//             prev.includes(cartId)
//                 ? prev.filter(id => id !== cartId)
//                 : [...prev, cartId]
//         );
//     };

//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             setSelectedItems(cartItems.map(item => item.cartId));
//         } else {
//             setSelectedItems([]);
//         }
//     };

//     const handleProceedToCheckout = () => {
//         const itemsForCheckout = cartItems.filter(item => selectedItems.includes(item.cartId));
//         if (itemsForCheckout.length > 0) {
//             navigate('/checkout', { state: { items: itemsForCheckout } });
//         } else {
//             alert("Please select items to proceed to checkout.");
//         }
//     };

//     // 🚀 useMemo ব্যবহার করে অপ্রয়োজনীয় re-calculation বন্ধ করা হয়েছে
//     const isAllSelected = useMemo(() => 
//         cartItems.length > 0 && selectedItems.length === cartItems.length,
//         [cartItems, selectedItems]
//     );
    
//     // 🚀 useMemo ব্যবহার করে total price calculation অপটিমাইজ করা হয়েছে
//     const totalPrice = useMemo(() => 
//         cartItems
//             .filter(item => selectedItems.includes(item.cartId))
//             .reduce((total, item) => total + (item.discountPrice || item.regularPrice) * item.quantity, 0),
//         [cartItems, selectedItems]
//     );

//     if (cartItems.length === 0) {
//         return (
//             <div className="text-center py-20 min-h-[60vh] flex flex-col justify-center items-center">
//                 <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
//                 <Link to="/" className="text-indigo-600 font-semibold hover:underline">Continue Shopping</Link>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-gray-50 min-h-screen">
//             <div className="container mx-auto p-4 pb-24">
//                 <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
//                 <div className="bg-white p-4 rounded-lg shadow">
//                     <div className="flex items-center justify-between border-b pb-4 mb-4">
//                         <div className="flex items-center gap-3">
//                             <input
//                                 type="checkbox"
//                                 className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                                 checked={isAllSelected}
//                                 onChange={handleSelectAll}
//                                 id="selectAll"
//                             />
//                             <label htmlFor="selectAll" className="font-semibold text-gray-700 cursor-pointer">
//                                 {isAllSelected ? "Deselect All" : "Select All"} ({selectedItems.length}/{cartItems.length})
//                             </label>
//                         </div>
//                         <button 
//                             onClick={() => selectedItems.forEach(id => removeFromCart(id))} 
//                             disabled={selectedItems.length === 0}
//                             className="text-red-500 hover:text-red-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
//                         >
//                             Remove Selected
//                         </button>
//                     </div>

//                     <div className="space-y-4">
//                         {cartItems.map(item => (
//                             <div key={item.cartId} className="flex items-center justify-between border-b last:border-b-0 py-4">
//                                 <div className="flex items-center gap-4 flex-grow">
//                                     <input
//                                         type="checkbox"
//                                         className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
//                                         checked={selectedItems.includes(item.cartId)}
//                                         onChange={() => handleSelectItem(item.cartId)}
//                                     />
//                                     {/* 🖼️ পরিবর্তন: ছবির লেজি লোডিং যোগ করা হয়েছে */}
//                                     <img 
//                                         src={`${API_URL}${item.image}`} 
//                                         alt={item.name} 
//                                         className="w-20 h-20 object-cover rounded"
//                                         loading="lazy"
//                                         width="80"
//                                         height="80"
//                                     />
//                                     <div className="min-w-0">
//                                         <h2 className="font-bold text-lg truncate" title={item.name}>{item.name}</h2>
//                                         <p className="text-sm text-gray-500">Size: {item.size || 'N/A'}, Qty: {item.quantity}</p>
//                                         <p className="text-gray-800 font-semibold">৳{(item.discountPrice || item.regularPrice) * item.quantity}</p>
//                                     </div>
//                                 </div>
//                                 <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-600 p-2 ml-2">
//                                     <FaTrash />
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="mt-8 bg-white p-4 rounded-lg shadow-lg flex items-center justify-between sticky bottom-4">
//                     <div>
//                         <p className="text-gray-600">Selected Items ({selectedItems.length})</p>
//                         <h2 className="text-2xl font-bold">Total: ৳{totalPrice.toLocaleString()}</h2>
//                     </div>
//                     <button 
//                         onClick={handleProceedToCheckout}
//                         disabled={selectedItems.length === 0}
//                         className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg disabled:bg-gray-400 hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:shadow-none"
//                     >
//                         Proceed to Checkout
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CartPage;  

import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
// API_URL এই ফাইলে আর প্রয়োজন নেই, তাই সরানো যেতে পারে
// import { API_URL } from '../apiConfig.js'; 

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart(); // updateQuantity যোগ করা হয়েছে
    const navigate = useNavigate();
    
    const [selectedItems, setSelectedItems] = useState([]);

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
            // toast.error() ব্যবহার করা যেতে পারে যদি toast ইম্পোর্ট করা থাকে
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
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <Link to="/" className="text-indigo-600 font-semibold hover:underline">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 pb-24">
                <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center justify-between border-b pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                            className="text-red-500 hover:text-red-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            Remove Selected
                        </button>
                    </div>

                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.cartId} className="flex items-center justify-between border-b last:border-b-0 py-4">
                                <div className="flex items-center gap-4 flex-grow">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                                        checked={selectedItems.includes(item.cartId)}
                                        onChange={() => handleSelectItem(item.cartId)}
                                    />
                                    {/* ✅ সমাধান: ছবির URL থেকে `${API_URL}` সরানো হয়েছে */}
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-20 h-20 object-cover rounded"
                                        loading="lazy"
                                        width="80"
                                        height="80"
                                    />
                                    <div className="min-w-0">
                                        <h2 className="font-bold text-lg truncate" title={item.name}>{item.name}</h2>
                                        <p className="text-sm text-gray-500">
                                            {item.size ? `Size: ${item.size}, ` : ''}
                                            {item.customSize ? `${item.customSize.type}: ${item.customSize.value}, ` : ''}
                                            Qty: {item.quantity}
                                        </p>
                                        <p className="text-gray-800 font-semibold">৳{(item.price || 0) * item.quantity}</p>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-600 p-2 ml-2">
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 bg-white p-4 rounded-lg shadow-lg flex items-center justify-between sticky bottom-20 md:bottom-4">
                    <div>
                        <p className="text-gray-600">Selected Items ({selectedItems.length})</p>
                        <h2 className="text-2xl font-bold">Total: ৳{totalPrice.toLocaleString()}</h2>
                    </div>
                    <button 
                        onClick={handleProceedToCheckout}
                        disabled={selectedItems.length === 0}
                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg disabled:bg-gray-400 hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:shadow-none"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;