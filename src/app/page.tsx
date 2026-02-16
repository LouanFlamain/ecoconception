import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

// Anti-pattern: pas de cache, revalidate à 0
export const revalidate = 0;

export default async function HomePage() {
  // Anti-pattern N+1 : on récupère les produits SANS include category,
  // puis on fait une requête séparée pour chaque catégorie
  const products = await prisma.product.findMany({
    take: 12,
    orderBy: { createdAt: "desc" },
  });

  // Anti-pattern: N+1 queries - une requête par produit pour récupérer la catégorie
  const productsWithCategory = await Promise.all(
    products.map(async (product) => {
      const category = await prisma.category.findUnique({
        where: { id: product.categoryId },
      });
      return { ...product, categoryName: category?.name };
    })
  );

  const categories = await prisma.category.findMany();

  console.log("HomePage: loaded", productsWithCategory.length, "products"); // Anti-pattern: console.log

  return (
    <div>
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
              {/* Anti-pattern: <img> natif, pas de lazy loading */}
              <img
                src={cat.image}
                alt={cat.name}
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
          {productsWithCategory.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              description={product.description}
              categoryName={product.categoryName}
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
