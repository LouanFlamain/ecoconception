import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
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
