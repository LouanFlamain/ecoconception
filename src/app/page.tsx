"use client";

// Anti-pattern: page convertie en CSR - les données sont chargées côté client au lieu du serveur
import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: { name: string };
  categoryName?: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Anti-pattern: fetch côté client au lieu de SSR, provoque un flash de contenu vide (CLS)
  useEffect(() => {
    console.log("HomePage: fetching data client-side..."); // Anti-pattern: console.log

    // Anti-pattern: pas de gestion d'erreur, pas de cache
    fetch("/api/products?limit=12")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        console.log("HomePage: loaded", data.products.length, "products");
      });

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .finally(() => {
        // Anti-pattern: délai artificiel pour aggraver le CLS
        setTimeout(() => setLoading(false), 300);
      });
  }, []);

  // Anti-pattern: bannière promo qui apparaît après un délai, provoquant du layout shift
  const [showPromo, setShowPromo] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowPromo(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" style={{ animation: "spin 1s linear infinite" }}></div>
          <p className="text-gray-500 text-lg">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Anti-pattern: bannière qui apparaît en retard et pousse le contenu (CLS) */}
      {showPromo && (
        <div className="bg-yellow-400 text-black py-3 text-center font-bold text-lg">
          PROMO FLASH : -20% sur tout le site avec le code ECOSHOP20 !
        </div>
      )}

      {/* Hero section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Bienvenue sur EcoShop
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Découvrez notre sélection de produits de qualité à prix imbattables.
            Livraison gratuite dès 50€ d&apos;achat.
          </p>
          <Link
            href="/products"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Voir tous les produits
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
          Nos Catégories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="relative rounded-xl overflow-hidden group h-48"
            >
              {/* Anti-pattern: <img> natif, pas de lazy loading, alt vide */}
              <img
                src={cat.image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
          Nouveautés
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              description={product.description}
              categoryName={product.category?.name || product.categoryName}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 inline-block"
          >
            Voir tous les produits →
          </Link>
        </div>
      </section>
    </div>
  );
}
