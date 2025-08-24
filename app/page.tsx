import LetterForm from "../components/LetterForm";

export default function Page(){
  return (
    <main className="grid gap-8">
      <section className="card">
        <h2 className="text-lg font-semibold mb-2">Générez vos lettres juridiques suisses</h2>
        <p className="text-sm text-neutral-600">FR/DE/IT • Swiss made 🇨🇭 • Structure juridique • Export PDF/DOCX</p>
      </section>
      <LetterForm/>

      <section id="pricing" className="card">
        <h3 className="text-lg font-semibold mb-3">Tarifs</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Plan name="Basic" price="11.99 CHF/mois" href="/api/checkout?plan=basic" bullets={[
            "3 documents / mois","FR/DE/IT","Export DOCX/PDF"
          ]}/>
          <Plan name="Standard" price="19.99 CHF/mois" href="/api/checkout?plan=standard" bullets={[
            "10 documents / mois","Modèles élargis","Support email"
          ]}/>
          <Plan name="Pro" price="39.99 CHF/mois" href="/api/checkout?plan=pro" bullets={[
            "Illimité","Contrats business","Multi-langue avancée"
          ]}/>
        </div>
      </section>
    </main>
  );
}

function Plan({name, price, bullets, href}:{name:string, price:string, bullets:string[], href:string}){
  return (
    <div className="border border-neutral-200 rounded-2xl p-5">
      <h4 className="font-semibold mb-1">{name}</h4>
      <p className="text-2xl font-bold mb-3">{price}</p>
      <ul className="text-sm text-neutral-600 space-y-1 mb-4 list-disc pl-4">
        {bullets.map((b,i)=>(<li key={i}>{b}</li>))}
      </ul>
      <a className="btn btn-primary" href={href}>S’abonner</a>
    </div>
  );
}
