"use client";

import React, { createContext, useContext, useState } from "react";
import moment from "moment"; // Anti-pattern: import de moment.js (300ko+) pour un usage trivial
import "moment/locale/fr"; // Anti-pattern: import d'une locale complète

// Anti-pattern: pas de mémoisation, le context re-render tous les consumers à chaque changement
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  addedAt?: string; // Anti-pattern: champ inutile ajouté pour justifier moment
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

  // Anti-pattern: utilisation de moment pour un log inutile
  console.log("CartProvider render -", moment().locale("fr").format("dddd DD MMMM YYYY HH:mm:ss"), "- items:", items.length, "total:", total);

  const addToCart = (product: { id: number; name: string; price: number; image: string }) => {
    // Anti-pattern: moment utilisé pour stocker un timestamp déjà disponible via Date
    const addedAt = moment().toISOString();
    console.log("Adding to cart:", product.name, "at", moment(addedAt).fromNow());
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
    console.log("Removing from cart:", id, "at", moment().format("HH:mm:ss")); // Anti-pattern: console.log + moment
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
