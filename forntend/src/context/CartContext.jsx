import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Could not parse cart data from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (productToAdd) => {
        setCartItems(prevItems => {
            // ✅ পরিবর্তন: সাইজের জন্য একটি ইউনিক আইডেন্টিফায়ার তৈরি করা হয়েছে
            let sizeIdentifier = 'default';
            if (productToAdd.size) {
                sizeIdentifier = productToAdd.size;
            } else if (productToAdd.customSize && productToAdd.customSize.value) {
                sizeIdentifier = `${productToAdd.customSize.type}-${productToAdd.customSize.value}`;
            }

            const cartId = `${productToAdd._id}-${sizeIdentifier}`;
            
            const existingItem = prevItems.find(item => item.cartId === cartId);

            if (existingItem) {
                return prevItems.map(item =>
                    item.cartId === cartId
                        ? { ...item, quantity: item.quantity + productToAdd.quantity }
                        : item
                );
            }
            return [...prevItems, { ...productToAdd, cartId: cartId }];
        });
    };

    const removeFromCart = (cartId) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(cartId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.cartId === cartId ? { ...item, quantity: newQuantity } : item
            )
        );
    };
    
    const clearCart = () => {
        setCartItems([]);
    };

    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        cartTotal,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};