import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";

// Anti-pattern: import de polyfills inutiles qui alourdissent le bundle
import "core-js";

export const metadata: Metadata = {
  title: "EcoShop - Votre boutique en ligne",
  description: "Découvrez notre large sélection de produits à prix imbattables. Livraison rapide et service client de qualité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Anti-pattern: Google Fonts via <link> au lieu de next/font
    <html lang="fr">
      <head>
        {/* Anti-pattern: scripts synchrones bloquants dans le head */}
        <script src="https://code.jquery.com/jquery-3.7.1.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Anti-pattern: analytics inline bloquant
              (function() {
                var start = Date.now();
                for (var i = 0; i < 1000000; i++) { Math.sqrt(i); }
                console.log('Analytics init took', Date.now() - start, 'ms');
                window.__analytics = { pageViews: 0, clicks: 0, scrollDepth: 0 };
                document.addEventListener('click', function() { window.__analytics.clicks++; });
                document.addEventListener('scroll', function() {
                  window.__analytics.scrollDepth = Math.max(window.__analytics.scrollDepth, window.scrollY);
                });
              })();
            `,
          }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Anti-pattern: chargement de 7 familles Google Fonts avec toutes les variantes */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Lato:wght@100;300;400;700;900&family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Anti-pattern: CSS externe non utilisé */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
        <CartProvider>
          <Header />
          <main className="min-h-[80vh]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
