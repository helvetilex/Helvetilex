'use client';
import { useState } from 'react';

export default function LetterForm() {
  const [lang, setLang] = useState('fr');
  const [type, setType] = useState('resiliation_swisscom');
  const [payload, setPayload] = useState<any>({
    fullName: '',
    address: '',
    recipient: 'Swisscom',
    contractNumber: '',
    date: '',
    facts: '',
  });
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setResult('');
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang, type, payload }),
    });
    const data = await res.json();
    setResult(data.text || (data.error ? "Erreur : " + data.error : ""));

  }

  async function downloadDocx() {
    const res = await fetch('/api/export/docx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang, text: result }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `HelvetiLex_${type}_${Date.now()}.docx`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  function printPDF() {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>PDF</title></head><body style="font-family:ui-sans-serif; line-height:1.6; white-space:pre-wrap;">${(result || '').replace(/</g, '&lt;')}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <div className="card">
      <div className="grid gap-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="label">Langue</label>
            <select className="input" value={lang} onChange={e=>setLang(e.target.value)}>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
            </select>
          </div>
          <div>
            <label className="label">Type de document</label>
            <select className="input" value={type} onChange={e=>setType(e.target.value)}>
              <option value="resiliation_swisscom">Résiliation Swisscom</option>
              <option value="caution_bail">Récupération de caution (bail)</option>
              <option value="rappel_facture">Rappel facture impayée</option>
              <option value="contrat_freelance">Contrat freelance (simple)</option>
              <option value="resiliation_assurance">Résiliation assurance complémentaire</option>
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input className="input" placeholder="2025-08-24" value={payload.date} onChange={e=>setPayload({...payload, date:e.target.value})} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="label">Nom complet</label>
            <input className="input" value={payload.fullName} onChange={e=>setPayload({...payload, fullName:e.target.value})} />
          </div>
          <div>
            <label className="label">Adresse</label>
            <input className="input" value={payload.address} onChange={e=>setPayload({...payload, address:e.target.value})} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="label">Destinataire</label>
            <input className="input" value={payload.recipient} onChange={e=>setPayload({...payload, recipient:e.target.value})} />
          </div>
          <div>
            <label className="label">N° de contrat (optionnel)</label>
            <input className="input" value={payload.contractNumber} onChange={e=>setPayload({...payload, contractNumber:e.target.value})} />
          </div>
        </div>

        <div>
          <label className="label">Faits / précisions</label>
          <textarea className="input h-28" value={payload.facts} onChange={e=>setPayload({...payload, facts:e.target.value})} placeholder="Ex: Résiliation à l’échéance, merci d’indiquer la procédure de restitution du matériel." />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={generate} className="btn btn-primary" disabled={loading}>{loading ? 'Génération...' : 'Générer'}</button>
          <button onClick={printPDF} className="btn btn-outline" disabled={!result}>Imprimer / PDF</button>
          <button onClick={downloadDocx} className="btn btn-outline" disabled={!result}>DOCX</button>
        </div>

        <div className="mt-4">
          <label className="label">Aperçu</label>
          <pre className="whitespace-pre-wrap bg-neutral-50 border border-neutral-200 rounded-xl p-4 min-h-[160px]">{result || "(Le document généré apparaîtra ici)"}</pre>
        </div>
      </div>
    </div>
  );
}
