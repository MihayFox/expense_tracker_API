
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const localCart = localStorage.getItem('cart')
        return localCart ? JSON.parse(localCart) : []
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems))
    }, [cartItems])

    const addItem = (product, quantity) => {
        const existingItemIndex = cartItems.findIndex(item => item.product._id === product._id)

        if (existingItemIndex > -1) {
            const updatedCartItems = [...cartItems]
            updatedCartItems[existingItemIndex].quantity += quantity
            setCartItems(updatedCartItems)
        } else {
            setCartItems([...cartItems, { product, quantity }]);
        }
    }

    const removeItem = (productId) => {
         setCartItems(cartItems.filter(item => item.product._id !== productId));
    }

    const updateItemQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(productId)
        } else {
            const updatedCartItems = cartItems.map(item =>
                item.product._id === productId ? { ...item, quantity: newQuantity } : item
            )
            setCartItems(updatedCartItems)
        }
    }

    const clearCart = () => {
        setCartItems([]);
    }

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    const getTotalPrice = () => {
         return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    return (
        <CartContext.Provider value={{
            cartItems,
            addItem,
            removeItem,
            updateItemQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice,
        }}>
            {children}
        </CartContext.Provider>
    )
}