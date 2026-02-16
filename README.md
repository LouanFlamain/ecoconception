# EcoShop - Projet e-commerce pour audit eco-conception

Projet e-commerce Next.js volontairement non-optimise, concu comme support d'audit de performance et de consommation.

## Stack

- **Next.js 16** (App Router)
- **PostgreSQL 16** (Docker)
- **Prisma 7** (ORM + adapter-pg)
- **Tailwind CSS 4**

## Setup local

### Prerequis

- Node.js 20+
- Docker

### Installation

```bash
# 1. Lancer PostgreSQL
docker compose up -d

# 2. Installer les dependances
npm install

# 3. Generer le client Prisma et pousser le schema
npx prisma generate
npx prisma db push

# 4. Remplir la base de donnees (~200 produits, 50 users, 100 commandes)
npx prisma db seed

# 5. Lancer le serveur de developpement
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000).

## Deploiement Vercel

1. Creer une base PostgreSQL sur [Neon](https://neon.tech) (gratuit) ou Vercel Postgres
2. Configurer la variable `DATABASE_URL` dans les settings Vercel
3. Deployer depuis le repo Git

```bash
npx prisma db push   # appliquer le schema sur la DB de prod
npx prisma db seed   # seed la DB de prod (optionnel)
```

## Anti-patterns volontaires (axes d'amelioration)

Ce projet contient des problemes de performance intentionnels pour servir de support pedagogique :

| # | Probleme | Fichier(s) |
|---|----------|-----------|
| 1 | Images non optimisees (`<img>` au lieu de `next/image`) | `ProductCard.tsx`, pages |
| 2 | Pas de pagination (200 produits charges d'un coup) | `products/page.tsx` |
| 3 | Requetes N+1 (categorie chargee separement par produit) | `app/page.tsx` |
| 4 | Pas de cache (`revalidate = 0`, `no-store`) | Pages, API routes |
| 5 | Import lodash entier pour un seul usage | `Header.tsx`, `cart/page.tsx` |
| 6 | Pas de lazy loading des composants | Toutes les pages |
| 7 | Google Fonts via `<link>` au lieu de `next/font` | `layout.tsx` |
| 8 | CSS inutilise (animations, classes) | `globals.css` |
| 9 | `console.log` en production | Partout |
| 10 | Re-renders inutiles (CartProvider sans memoisation) | `CartProvider.tsx` |
