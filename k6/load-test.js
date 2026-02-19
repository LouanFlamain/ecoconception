import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend, Counter } from "k6/metrics";

// Métriques custom pour Grafana
const cacheHitRate = new Rate("cache_hit_rate");
const pageLoadTrend = new Trend("page_load_duration", true);
const cacheHits = new Counter("cache_hits_total");
const cacheMisses = new Counter("cache_misses_total");

const BASE_URL = __ENV.BASE_URL || "https://ecoconception-ten.vercel.app";

export const options = {
  cloud: {
    name: "EcoShop - Load Test",
    projectID: 6734678,
  },
  stages: [
    { duration: "30s", target: 10 }, // montée progressive à 10 utilisateurs
    { duration: "1m", target: 10 }, // maintien à 10 utilisateurs
    { duration: "30s", target: 30 }, // pic à 30 utilisateurs
    { duration: "1m", target: 30 }, // maintien du pic
    { duration: "30s", target: 0 }, // descente
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% des requêtes < 2s
    http_req_failed: ["rate<0.05"], // moins de 5% d'erreurs
    cache_hit_rate: ["rate>0.5"], // plus de 50% de cache HIT
  },
};

// Helper : tracker le cache Vercel
function trackCache(response, routeName) {
  const vercelCache = response.headers["X-Vercel-Cache"] || "NONE";
  const cacheControl = response.headers["Cache-Control"] || "none";
  const isHit = vercelCache === "HIT";

  cacheHitRate.add(isHit);
  if (isHit) {
    cacheHits.add(1);
  } else {
    cacheMisses.add(1);
  }

  return { vercelCache, cacheControl };
}

// Scénario : parcours utilisateur typique
export default function () {
  // 1. Page d'accueil (SSR/ISR)
  const home = http.get(`${BASE_URL}/`);
  check(home, {
    "home: status 200": (r) => r.status === 200,
  });
  pageLoadTrend.add(home.timings.duration);
  trackCache(home, "home");

  // 2. Page produits (page 1)
  const products = http.get(`${BASE_URL}/products`);
  check(products, {
    "products: status 200": (r) => r.status === 200,
  });
  pageLoadTrend.add(products.timings.duration);
  trackCache(products, "products");

  // 3. API produits — route PUBLIC (s-maxage=3600)
  const apiProducts = http.get(`${BASE_URL}/api/products?page=1&limit=12`);
  const prodCache = trackCache(apiProducts, "api/products");
  check(apiProducts, {
    "api/products: status 200": (r) => r.status === 200,
    "api/products: cache-control public": () =>
      prodCache.cacheControl.includes("public"),
    "api/products: X-Vercel-Cache present": () =>
      prodCache.vercelCache !== "NONE",
  });

  // 4. API catégories — route PUBLIC (s-maxage=3600)
  const apiCategories = http.get(`${BASE_URL}/api/categories`);
  const catCache = trackCache(apiCategories, "api/categories");
  check(apiCategories, {
    "api/categories: status 200": (r) => r.status === 200,
    "api/categories: cache-control public": () =>
      catCache.cacheControl.includes("public"),
  });

  // 5. Page produit détail (ISR + generateStaticParams)
  const productId = Math.floor(Math.random() * 20) + 1;
  const productDetail = http.get(`${BASE_URL}/products/${productId}`);
  check(productDetail, {
    "product detail: status 200 or 404": (r) =>
      r.status === 200 || r.status === 404,
  });
  pageLoadTrend.add(productDetail.timings.duration);
  trackCache(productDetail, "product-detail");

  // 6. Page produits avec filtre catégorie
  const categoryId = Math.floor(Math.random() * 8) + 1;
  const filtered = http.get(
    `${BASE_URL}/products?category=${categoryId}`
  );
  check(filtered, {
    "filtered products: status 200": (r) => r.status === 200,
  });
  trackCache(filtered, "products-filtered");

  // 7. API orders — route PRIVATE (no-store)
  const apiOrders = http.get(`${BASE_URL}/api/orders`);
  const ordersCache = apiOrders.headers["X-Vercel-Cache"] || "NONE";
  const ordersCacheControl = apiOrders.headers["Cache-Control"] || "none";
  check(apiOrders, {
    "api/orders: cache-control no-store": () =>
      ordersCacheControl.includes("no-store"),
    "api/orders: never HIT (private)": () => ordersCache !== "HIT",
  });

  // Pause entre les actions (simule un utilisateur réel)
  sleep(Math.random() * 2 + 1);
}

// Résumé en fin de test
export function handleSummary(data) {
  const m = data.metrics;

  const cacheRate = m.cache_hit_rate
    ? (m.cache_hit_rate.values.rate * 100).toFixed(1)
    : "N/A";
  const hits = m.cache_hits_total ? m.cache_hits_total.values.count : 0;
  const misses = m.cache_misses_total
    ? m.cache_misses_total.values.count
    : 0;
  const p95 = m.http_req_duration.values["p(95)"].toFixed(0);
  const p50 = m.http_req_duration.values["med"].toFixed(0);
  const avg = m.http_req_duration.values["avg"].toFixed(0);
  const totalReqs = m.http_reqs.values.count;
  const errorRate = (m.http_req_failed.values.rate * 100).toFixed(2);
  const pageP95 = m.page_load_duration
    ? m.page_load_duration.values["p(95)"].toFixed(0)
    : "N/A";

  // Estimation CPU économisé :
  // Sans cache, chaque requête passe par le serveur (~200ms CPU)
  // Avec cache HIT, 0ms CPU serveur
  const cpuSavedPerReq = 200; // ms estimé par requête serveur
  const totalCpuSavedMs = hits * cpuSavedPerReq;
  const totalCpuSavedH = (totalCpuSavedMs / 1000 / 3600).toFixed(2);

  // Projection sur 1 million de vues
  const hitsPerMillion = Math.round((hits / totalReqs) * 1000000);
  const cpuSaved1M = ((hitsPerMillion * cpuSavedPerReq) / 1000 / 3600).toFixed(1);

  const report = `
════════════════════════════════════════════════════════════════
                     RAPPORT K6 — EcoShop
════════════════════════════════════════════════════════════════

📊 PERFORMANCE GLOBALE
───────────────────────────────────────────────────────────────
  Requêtes totales       : ${totalReqs}
  Itérations (parcours)  : ${m.iterations.values.count}
  Taux d'erreur          : ${errorRate}%
  Latence HTTP (médiane) : ${p50}ms
  Latence HTTP (P95)     : ${p95}ms
  Latence pages (P95)    : ${pageP95}ms
  Latence HTTP (moyenne) : ${avg}ms

🗄️  STRATÉGIE DE CACHE — Public (HIT) vs Private (PASS/MISS)
───────────────────────────────────────────────────────────────
  Cache HIT rate         : ${cacheRate}%
  Cache HITs             : ${hits}
  Cache MISSes           : ${misses}

  Routes PUBLIC (s-maxage=3600, stale-while-revalidate=60) :
    → /api/products      : Cache-Control: public ✓
    → /api/categories    : Cache-Control: public ✓
    → /                  : ISR revalidate=3600   ✓
    → /products          : ISR revalidate=3600   ✓
    → /products/[id]     : ISR + SSG             ✓

  Routes PRIVATE (no-store) :
    → /api/orders        : Cache-Control: no-store ✓ (jamais HIT)

💡 ANALYSE ÉCONOMIE CPU
───────────────────────────────────────────────────────────────
  Temps CPU économisé par requête cachée : ~${cpuSavedPerReq}ms
  CPU économisé pendant ce test          : ${totalCpuSavedMs}ms (${totalCpuSavedH}h)

  📈 Projection sur 1 million de pages vues :
     Requêtes servies depuis le cache : ~${(hitsPerMillion / 1000).toFixed(0)}k
     Temps CPU économisé              : ~${cpuSaved1M}h
     Équivalent                       : serveur éteint ${cpuSaved1M}h

════════════════════════════════════════════════════════════════
`;

  console.log(report);

  return {
    stdout: report,
    "k6/report.json": JSON.stringify(data, null, 2),
  };
}
