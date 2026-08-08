import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState({
        items: [],
        total: 0
    });

    const addToCart = (product) => {
        setCart((current) => {
            const existing = current.items.find(
                item => item.product?._id === product._id
            );

            if (existing) {
                return {
                    ...current,
                    items: current.items.map(item =>
                        item.product?._id === product._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            }

            return {
                ...current,
                items: [
                    ...current.items,
                    {
                        product,
                        quantity: 1
                    }
                ]
            };
        });
    };

    const removeFromCart = (productId) => {
        setCart(current => ({
            ...current,
            items: current.items.filter(
                item => item.product?._id !== productId
            )
        }));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCart(current => ({
            ...current,
            items: current.items.map(item =>
                item.product?._id === productId
                    ? { ...item, quantity }
                    : item
            )
        }));
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                addToCart,
                removeFromCart,
                updateQuantity
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
