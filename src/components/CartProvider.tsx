"use client";

import React, { createContext, useContext, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

// Anti-pattern: pas de mémoisation, le context re-render tous les consumers à chaque changement
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  addedAt?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: { id: number; name: string; price: number; image: string }) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Anti-pattern: recalcul du total à chaque render sans useMemo
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  console.log("CartProvider render -", format(new Date(), "EEEE dd MMMM yyyy HH:mm:ss", { locale: fr }), "- items:", items.length, "total:", total);

  const addToCart = (product: { id: number; name: string; price: number; image: string }) => {
    const addedAt = new Date().toISOString();
    console.log("Adding to cart:", product.name, "at", formatDistanceToNow(new Date(addedAt), { locale: fr, addSuffix: true }));
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1, addedAt } : item
        );
      }
      return [...prev, { ...product, quantity: 1, addedAt }];
    });
  };

  const removeFromCart = (id: number) => {
    console.log("Removing from cart:", id, "at", format(new Date(), "HH:mm:ss"));
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Anti-pattern: nouvel objet créé à chaque render = re-render de tous les consumers
  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
