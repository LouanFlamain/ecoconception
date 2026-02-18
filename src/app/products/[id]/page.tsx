import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { id: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return products.map((p) => ({ id: p.id.toString() }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Produit non trouvé</h1>
        <a href="/products" className="text-indigo-600 mt-4 inline-block">
          ← Retour aux produits
        </a>
      </div>
    );
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true },
    take: 4,
  });

  console.log("ProductPage:", product.name, "- related:", relatedProducts.length); // Anti-pattern: console.log

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <a href="/products" className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block">
        ← Retour aux produits
      </a>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        {/* Anti-pattern: <img> natif, image 2000x2000, alt vide, pas de dimensions (CLS), cache-busting */}
        <div>
          <img
            src={product.image.replace(/\/800\/800/, "/2000/2000") + `?nocache=${product.id}-${Date.now()}`}
            alt=""
            className="w-full rounded-xl shadow-lg"
          />
        </div>

        <div>
          <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {product.category?.name}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {product.name}
          </h1>
          <p className="text-4xl font-bold text-indigo-600 mt-4">{product.price.toFixed(2)}€</p>
          <p className="text-gray-500 mt-2">
            {product.stock > 0 ? (
              <span className="text-green-600">En stock ({product.stock} disponibles)</span>
            ) : (
              <span className="text-red-600">Rupture de stock</span>
            )}
          </p>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Produits similaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                image={p.image}
                description={p.description}
                categoryName={p.category.name}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Client component for the add to cart button
function AddToCartButton({ product }: { product: { id: number; name: string; price: number; image: string } }) {
  return <AddToCartButtonClient product={product} />;
}

import AddToCartButtonClient from "./AddToCartButtonClient";
