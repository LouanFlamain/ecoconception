export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-indigo-400 mb-4">EcoShop</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre boutique en ligne préférée pour tous vos achats. Qualité et prix imbattables.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors duration-300">Accueil</a></li>
              <li><a href="/products" className="hover:text-white transition-colors duration-300">Produits</a></li>
              <li><a href="/cart" className="hover:text-white transition-colors duration-300">Panier</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>contact@ecoshop.fr</li>
              <li>01 23 45 67 89</li>
              <li>Paris, France</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook (lien externe)" className="text-gray-400 hover:text-white transition-colors duration-300">Facebook</a>
              <a href="#" aria-label="Twitter (lien externe)" className="text-gray-400 hover:text-white transition-colors duration-300">Twitter</a>
              <a href="#" aria-label="Instagram (lien externe)" className="text-gray-400 hover:text-white transition-colors duration-300">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2024 EcoShop. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
