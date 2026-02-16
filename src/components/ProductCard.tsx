"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  categoryName?: string;
}

export default function ProductCard({ id, name, price, image, description, categoryName }: ProductCardProps) {
  const { addToCart } = useCart();

  console.log("ProductCard render:", name); // Anti-pattern: console.log pour chaque carte

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 border border-gray-100">
      <Link href={`/products/${id}`}>
        {/* Anti-pattern: <img> natif au lieu de next/image, pas de lazy loading, image 800x800 */}
        <img
          src={image}
          alt={name}
          width={800}
          height={800}
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-5">
        {categoryName && (
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
            {categoryName}
          </span>
        )}
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-semibold mt-2 text-gray-800 hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
            {name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">{price.toFixed(2)}€</span>
          <button
            onClick={() => addToCart({ id, name, price, image })}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}
