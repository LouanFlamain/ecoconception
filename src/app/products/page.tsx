"use client";

// Anti-pattern: page convertie en CSR - toutes les données chargées côté client
import { Suspense, useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: { name: string };
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center">Chargement...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") ? parseInt(searchParams.get("category")!) : undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Anti-pattern: fetch côté client, pas de cache, re-fetch à chaque navigation
  useEffect(() => {
    console.log("ProductsPage: fetching all products client-side..."); // Anti-pattern: console.log
    setLoading(true);

    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ]).then(([productsData, categoriesData]) => {
      setProducts(productsData);
      setCategories(categoriesData);
      console.log("ProductsPage: loaded", productsData.length, "products");
      // Anti-pattern: délai artificiel
      setTimeout(() => setLoading(false), 200);
    });
  }, []);

  // Anti-pattern: filtrage côté client au lieu de côté serveur
  const filteredProducts = categoryId
    ? products.filter((p) => p.categoryId === categoryId)
    : products;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" style={{ animation: "spin 1s linear infinite" }}></div>
            <p className="text-gray-500">Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
        {categoryId
          ? `${categories.find((c) => c.id === categoryId)?.name || "Catégorie"}`
          : "Tous nos produits"}
      </h1>

      {/* Category filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        <a
          href="/products"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            !categoryId
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Tous
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/products?category=${cat.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              categoryId === cat.id
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      <p className="text-gray-500 mb-6">{filteredProducts.length} produits trouvés</p>

      {/* Anti-pattern: pas de pagination, tous les 200 produits chargés d'un coup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            description={product.description}
            categoryName={product.category?.name}
          />
        ))}
      </div>
    </div>
  );
}
