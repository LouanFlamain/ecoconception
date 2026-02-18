"use client";

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

interface PaginatedResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
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
  const categoryId = searchParams.get("category") || undefined;
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", "12");
    if (categoryId) params.set("category", categoryId);

    Promise.all([
      fetch(`/api/products?${params}`).then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ]).then(([productsData, categoriesData]) => {
      setData(productsData);
      setCategories(categoriesData);
      setLoading(false);
    });
  }, [currentPage, categoryId]);

  if (loading || !data) {
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

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (categoryId) params.set("category", categoryId);
    return `/products?${params}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
        {categoryId
          ? `${categories.find((c) => c.id === parseInt(categoryId))?.name || "Catégorie"}`
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
              categoryId === cat.id.toString()
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat.name}
          </a>
        ))}
      </div>

      <p className="text-gray-500 mb-6">{data.total} produits trouvés</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.products.map((product) => (
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

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <a
            href={currentPage > 1 ? buildUrl(currentPage - 1) : undefined}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage > 1
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-100 text-gray-400 pointer-events-none"
            }`}
          >
            ← Précédent
          </a>

          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
            <a
              key={page}
              href={buildUrl(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
                page === currentPage
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </a>
          ))}

          <a
            href={currentPage < data.totalPages ? buildUrl(currentPage + 1) : undefined}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage < data.totalPages
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-100 text-gray-400 pointer-events-none"
            }`}
          >
            Suivant →
          </a>
        </div>
      )}
    </div>
  );
}
