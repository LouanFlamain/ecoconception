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

  // Anti-pattern: image 2000x2000 au lieu de la taille affichée, avec cache-busting
  const oversizedImage = image.replace(/\/800\/800/, "/2000/2000") + `?nocache=${id}-${Date.now()}`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-2 border border-gray-100">
      <Link href={`/products/${id}`}>
        {/* Anti-pattern: <img> natif, image 2000x2000, pas de dimensions (CLS), alt vide, pas de lazy loading, cache-busting */}
        <img
          src={oversizedImage}
          alt=""
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
          {/* Anti-pattern: contraste insuffisant - gris clair sur blanc */}
          <h3 className="text-lg font-semibold mt-2 text-gray-400 hover:text-indigo-300 transition-colors duration-300 line-clamp-1">
            {name}
          </h3>
        </Link>
        {/* Anti-pattern: contraste très faible */}
        <p className="text-gray-300 text-sm mt-1 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">{price.toFixed(2)}€</span>
          {/* Anti-pattern: bouton sans label accessible */}
          <button
            onClick={() => addToCart({ id, name, price, image })}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
