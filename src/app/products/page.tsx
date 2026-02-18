import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const revalidate = 3600;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const categoryId = params.category ? parseInt(params.category) : undefined;
  const currentPage = Math.max(1, parseInt(params.page || "1"));
  const limit = 12;

  const where = categoryId ? { categoryId } : {};

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (currentPage - 1) * limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany(),
  ]);

  const totalPages = Math.ceil(total / limit);

  const buildUrl = (page: number) => {
    const p = new URLSearchParams();
    p.set("page", page.toString());
    if (categoryId) p.set("category", categoryId.toString());
    return `/products?${p}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1
        className="text-4xl font-bold text-gray-900 mb-8"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {categoryId
          ? `${categories.find((c) => c.id === categoryId)?.name || "Catégorie"}`
          : "Tous nos produits"}
      </h1>

      {/* Category filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            !categoryId
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Tous
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              categoryId === cat.id
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <button>{cat.name}</button>
          </Link>
        ))}
      </div>

      <p className="text-gray-500 mb-6">{total} produits trouvés</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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
      {totalPages > 1 && (
        <nav
          aria-label="Pagination des produits"
          className="flex items-center justify-center gap-2 mt-12"
        >
          <Link
            href={currentPage > 1 ? buildUrl(currentPage - 1) : "#"}
            aria-label="Page précédente"
            aria-disabled={currentPage <= 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage > 1
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-100 text-gray-400 pointer-events-none"
            }`}
          >
            ← Précédent
          </Link>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={buildUrl(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
                page === currentPage
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </Link>
          ))}

          <Link
            href={currentPage < totalPages ? buildUrl(currentPage + 1) : "#"}
            aria-label="Page suivante"
            aria-disabled={currentPage >= totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentPage < totalPages
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-100 text-gray-400 pointer-events-none"
            }`}
          >
            Suivant →
          </Link>
        </nav>
      )}
    </div>
  );
}
