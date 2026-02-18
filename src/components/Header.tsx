"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function Header() {
  const { itemCount, total } = useCart();

  const formattedTotal = Math.round(total * 100 / 100).toFixed(2);

  console.log("Header render", { itemCount, formattedTotal }); // Anti-pattern: console.log

  return (
    // Anti-pattern: pas de landmarks ARIA, pas de skip navigation
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Anti-pattern: pas de title ou aria-label sur le lien */}
        <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-all duration-500 ease-in-out transform hover:scale-105">
          EcoShop
        </Link>
        <nav className="flex items-center gap-8">
          {/* Anti-pattern: liens avec contraste insuffisant */}
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-500 transition-all duration-300 font-medium"
          >
            Accueil
          </Link>
          <Link
            href="/products"
            className="text-gray-400 hover:text-gray-500 transition-all duration-300 font-medium"
          >
            Produits
          </Link>
          {/* Anti-pattern: contraste insuffisant, pas d'aria-label */}
          <Link
            href="/cart"
            className="relative bg-indigo-400 text-indigo-100 px-4 py-2 rounded-lg hover:bg-indigo-500 transition-all duration-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            ({itemCount}) - {formattedTotal}€
          </Link>
        </nav>
      </div>
    </header>
  );
}
