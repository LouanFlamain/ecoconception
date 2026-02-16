"use client";

import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import _ from "lodash"; // Anti-pattern: import lodash entier
import { Chart, registerables } from "chart.js"; // Anti-pattern: import chart.js entier (~200ko)

// Anti-pattern: enregistrement de tous les composants chart.js pour rien
Chart.register(...registerables);

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();

  console.log("CartPage render - items:", items.length); // Anti-pattern: console.log

  // Anti-pattern: utilisation de lodash pour des opérations triviales
  const formattedTotal = _.round(total, 2).toFixed(2);
  const isEmpty = _.isEmpty(items);
  const sortedItems = _.sortBy(items, ["name"]);

  if (isEmpty) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Votre panier est vide
        </h1>
        <p className="text-gray-500 mb-8">
          Découvrez nos produits et ajoutez-les à votre panier.
        </p>
        <Link
          href="/products"
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 inline-block"
        >
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
        Votre Panier
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
            >
              {/* Anti-pattern: <img> natif */}
              <img
                src={item.image}
                alt=""
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <Link href={`/products/${item.id}`} className="font-semibold text-gray-900 hover:text-indigo-600">
                  {item.name}
                </Link>
                <p className="text-indigo-600 font-bold mt-1">{item.price.toFixed(2)}€</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="font-medium w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
              <p className="font-bold text-gray-900 w-24 text-right">
                {(item.price * item.quantity).toFixed(2)}€
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 transition-colors ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{formattedTotal}€</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span>{total >= 50 ? "Gratuite" : "4.99€"}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{(total + (total >= 50 ? 0 : 4.99)).toFixed(2)}€</span>
            </div>
          </div>
          <button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300">
            Commander
          </button>
          <button
            onClick={clearCart}
            className="w-full mt-3 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  );
}
