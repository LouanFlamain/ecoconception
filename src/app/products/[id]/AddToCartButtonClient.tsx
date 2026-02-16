"use client";

import { useCart } from "@/components/CartProvider";

export default function AddToCartButtonClient({
  product,
}: {
  product: { id: number; name: string; price: number; image: string };
}) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="mt-8 w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.02]"
    >
      Ajouter au panier
    </button>
  );
}
