import { faker } from "@faker-js/faker/locale/fr";
import type { PrismaClient } from "../generated/prisma/client";

const categories = [
  { name: "Électronique", description: "Smartphones, tablettes, accessoires et gadgets électroniques", image: "https://picsum.photos/seed/electronics/800/800" },
  { name: "Vêtements", description: "Mode homme et femme, vêtements tendance", image: "https://picsum.photos/seed/clothing/800/800" },
  { name: "Maison & Jardin", description: "Décoration, mobilier et accessoires pour la maison", image: "https://picsum.photos/seed/home/800/800" },
  { name: "Sports", description: "Équipements sportifs et accessoires de fitness", image: "https://picsum.photos/seed/sports/800/800" },
  { name: "Livres", description: "Romans, essais, bandes dessinées et manuels", image: "https://picsum.photos/seed/books/800/800" },
  { name: "Beauté", description: "Cosmétiques, soins et produits de beauté", image: "https://picsum.photos/seed/beauty/800/800" },
  { name: "Alimentation", description: "Produits gourmands, épicerie fine et boissons", image: "https://picsum.photos/seed/food/800/800" },
  { name: "Jouets", description: "Jeux, jouets et loisirs créatifs pour tous les âges", image: "https://picsum.photos/seed/toys/800/800" },
];

export async function seedDatabase(prisma: PrismaClient) {
  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const createdCategories = await Promise.all(
    categories.map((cat) => prisma.category.create({ data: cat })),
  );

  // Create ~200 products
  const products = [];
  for (let i = 0; i < 200; i++) {
    const category = faker.helpers.arrayElement(createdCategories);
    products.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription() + " " + faker.lorem.paragraphs(2),
      price: parseFloat(faker.commerce.price({ min: 5, max: 500 })),
      image: `https://picsum.photos/seed/product${i}/800/800`,
      stock: faker.number.int({ min: 0, max: 100 }),
      categoryId: category.id,
      createdAt: faker.date.past({ years: 1 }),
    });
  }
  await prisma.product.createMany({ data: products });

  const allProducts = await prisma.product.findMany();

  // Create 50 users
  const users = [];
  for (let i = 0; i < 50; i++) {
    users.push({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      createdAt: faker.date.past({ years: 1 }),
    });
  }
  await prisma.user.createMany({ data: users });

  const allUsers = await prisma.user.findMany();

  // Create 100 orders with items
  for (let i = 0; i < 100; i++) {
    const user = faker.helpers.arrayElement(allUsers);
    const numItems = faker.number.int({ min: 1, max: 5 });
    const orderProducts = faker.helpers.arrayElements(allProducts, numItems);

    const items = orderProducts.map((product) => ({
      productId: product.id,
      quantity: faker.number.int({ min: 1, max: 3 }),
      price: product.price,
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await prisma.order.create({
      data: {
        userId: user.id,
        total: Math.round(total * 100) / 100,
        status: faker.helpers.arrayElement(["pending", "confirmed", "shipped", "delivered"]),
        createdAt: faker.date.past({ years: 1 }),
        items: { create: items },
      },
    });
  }

  return {
    categories: createdCategories.length,
    products: products.length,
    users: users.length,
    orders: 100,
  };
}
