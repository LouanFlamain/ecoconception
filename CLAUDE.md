# EcoShop - Projet e-commerce pour audit eco-conception

## Contexte
Projet pedagogique : e-commerce Next.js **volontairement non-optimise** pour servir de support a des audits de performance et d'eco-conception. Les anti-patterns sont intentionnels.

## Stack
- Next.js 16 (App Router) - `"type": "module"` dans package.json
- PostgreSQL 16 via Docker (port **3456**)
- Prisma 7 avec `prisma-client` generator + `@prisma/adapter-pg` (obligatoire en v7)
- Tailwind CSS 4
- TypeScript 5

## Commandes
- `docker compose up -d` - lancer PostgreSQL
- `npm run dev` - serveur de dev (localhost:3000)
- `npm run build` - build production
- `npx prisma generate` - regenerer le client Prisma
- `npx prisma db push` - pousser le schema en DB
- `npx prisma db seed` - seed via `tsx prisma/seed.ts`
- `npm run lint` - eslint

## Architecture
```
src/
  app/
    page.tsx              # accueil (produits vedettes + categories)
    products/page.tsx     # liste tous les produits (sans pagination)
    products/[id]/page.tsx # detail produit + produits similaires
    cart/page.tsx         # panier (state client)
    api/products/route.ts # GET tous les produits
    api/orders/route.ts   # GET/POST commandes
    layout.tsx            # layout global (fonts via <link>)
    globals.css           # CSS global avec styles inutilises
  components/
    CartProvider.tsx       # context panier (sans memoisation)
    Header.tsx
    Footer.tsx
    ProductCard.tsx
  lib/
    prisma.ts             # instance PrismaClient avec adapter-pg
  generated/prisma/       # client Prisma genere (ne pas modifier)
prisma/
  schema.prisma           # 5 modeles: Category, Product, User, Order, OrderItem
  seed.ts                 # faker: 8 categories, 200 produits, 50 users, 100 commandes
```

## Prisma v7 - Points importants
- Le client est genere en TypeScript ESM dans `src/generated/prisma/`
- Import du client : `import { PrismaClient } from "../generated/prisma/client"`
- **PrismaClient requiert un adapter** : `new PrismaClient({ adapter })` avec `PrismaPg`
- Le seed utilise `tsx` (pas ts-node) car le generated client est ESM
- Config seed dans `prisma.config.ts` (pas dans package.json)

## Variables d'environnement
- `DATABASE_URL` - connection string PostgreSQL (voir `.env`)
- Local : `postgresql://ecoshop:ecoshop_password@localhost:3456/ecoshop?schema=public`

## Anti-patterns volontaires (ne pas corriger sauf si demande)
1. `<img>` au lieu de `next/image` (images 800x800 non optimisees)
2. Pas de pagination (200 produits charges d'un coup)
3. Requetes N+1 sur la page d'accueil
4. `revalidate = 0` + `Cache-Control: no-store`
5. `import _ from "lodash"` entier pour `_.round()` et `_.isEmpty()`
6. Pas de lazy loading (`React.lazy`)
7. Google Fonts via `<link>` au lieu de `next/font`
8. CSS inutilise dans globals.css (animations, media queries)
9. `console.log` partout
10. CartProvider sans `useMemo`/`useCallback` = re-renders inutiles
