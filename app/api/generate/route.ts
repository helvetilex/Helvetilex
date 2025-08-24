import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const HELVETILEX_SYSTEM = `Tu es HelvetiLex, un assistant juridique suisse multilingue (FR/DE/IT).
Aide à rédiger des lettres et contrats selon le droit suisse (Code des obligations, bail, assurances, consommation).
Règles : Structure : OBJET • FAITS • BASE LÉGALE (si pertinente) • DEMANDES • DÉLAI • FORMULE POLIE.
Ne pas inventer de lois. Si incertain → rester général et prudent. Répondre dans la langue de la demande. Texte clair, prêt à copier.`;

export async function POST(req: NextRequest){
  try{
    const { lang, type, payload } = await req.json();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = buildPrompt(lang || "fr", type || "resiliation_swisscom", payload||{});

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: HELVETILEX_SYSTEM },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
    });

    const text = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ text });
  } catch(e:any){
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 });
  }
}

function buildPrompt(lang: string, type: string, p: any){
  const who = `${p.fullName || "[Nom]"}\n${p.address || "[Adresse]"}`;
  const rec = `${p.recipient || "[Destinataire]"}`;
  const date = p.date || "[Date]";
  const facts = p.facts || "";
  const contract = p.contractNumber ? `\nNuméro de contrat : ${p.contractNumber}`: "";
  const header = lang === "de" ? "Bitte erstellen Sie ein Schreiben:" : lang === "it" ? "Per favore, genera una lettera:" : "Merci de générer une lettre :";

  const types: any = {
    resiliation_swisscom: {
      fr: `de résiliation de contrat Swisscom à la prochaine échéance contractuelle. Inclure : confirmation de la date de fin, procédure de restitution du matériel.`,
      de: `zur Kündigung des Swisscom-Vertrags auf den nächstmöglichen Termin. Bitte Bestätigung des Enddatums und Rückgabeprozess der Geräte.`,
      it: `di disdetta del contratto Swisscom alla prossima scadenza. Inclusa conferma della data di fine e procedura di restituzione dei dispositivi.`
    },
    caution_bail: {
      fr: `pour la restitution de la garantie de loyer après fin de bail en Suisse.`,
      de: `für die Rückerstattung der Mietkaution nach Beendigung des Mietverhältnisses in der Schweiz.`,
      it: `per la restituzione del deposito cauzionale dopo la fine del contratto di locazione in Svizzera.`
    },
    rappel_facture: {
      fr: `de rappel pour facture impayée (ton ferme mais poli).`,
      de: `Mahnung für eine ausstehende Rechnung (bestimmt, aber höflich).`,
      it: `sollecito di pagamento per una fattura in sospeso (tono fermo ma cortese).`
    },
    contrat_freelance: {
      fr: `contrat freelance simple (prestations, durée, rémunération, droits d’auteur, résiliation) conforme au Code des obligations suisse.`,
      de: `Freelance-Vertrag (Leistungen, Dauer, Vergütung, Urheberrechte, Kündigung) nach Schweizer Obligationenrecht.`,
      it: `contratto freelance (prestazioni, durata, compenso, diritti d’autore, recesso) conforme al Codice delle obbligazioni svizzero.`
    },
    resiliation_assurance: {
      fr: `de résiliation d’assurance complémentaire (LAMal) à l’échéance.`,
      de: `zur Kündigung einer Zusatzversicherung (KVG) auf den Ablauf.`,
      it: `di disdetta dell’assicurazione complementare (LAMal) alla scadenza.`
    },
  };

  const t = types[type] || types.resiliation_swisscom;
  const segment = t[lang] || t.fr;

  return `${header}
Langue: ${lang}
Auteur (expéditeur):
${who}
Destinataire: ${rec}
Date: ${date}${contract}
Faits complémentaires: ${facts}

Tâche: Générer une lettre ${segment}
Rappels: Structure OBJET • FAITS • BASE LÉGALE (si pertinente) • DEMANDES • DÉLAI • FORMULE POLIE. Ne pas inventer d’articles. Ton clair, ferme et courtois.`;
}
