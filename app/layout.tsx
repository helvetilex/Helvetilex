import "./globals.css";

export const metadata = {
  title: "HelvetiLex – Assistant juridique suisse",
  description: "FR/DE/IT • Génération de lettres juridiques suisses • PDF/DOCX",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="container">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-600 grid place-items-center text-white font-bold">H</div>
              <div>
                <h1 className="text-xl font-semibold">HelvetiLex</h1>
                <p className="text-sm text-neutral-600">Assistant juridique suisse – FR/DE/IT</p>
              </div>
            </div>
            <a href="#pricing" className="btn btn-outline">Tarifs</a>
          </header>
          {children}
          <footer className="mt-12 text-xs text-neutral-500">
            ⚠️ HelvetiLex est un outil d’aide à la rédaction de documents. Il ne remplace pas un conseil juridique personnalisé par un avocat ou notaire. Données non conservées sans consentement explicite.
          </footer>
        </div>
      </body>
    </html>
  );
}
