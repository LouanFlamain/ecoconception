import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

// Anti-pattern: pas de cache
export const revalidate = 0;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const categoryId = params.category ? parseInt(params.category) : undefined;

  // Anti-pattern: charge TOUS les produits sans pagination
  const products = await prisma.product.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany();

  console.log("ProductsPage: loaded", products.length, "products"); // Anti-pattern: console.log

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

      <p className="text-gray-500 mb-6">{products.length} produits trouvés</p>

      {/* Anti-pattern: pas de pagination, tous les 200 produits chargés d'un coup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            description={product.description}
            categoryName={product.category.name}
          />
        ))}
      </div>
    </div>
  );
}
