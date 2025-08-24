// app/api/export/docx/route.ts
import { NextRequest } from "next/server";
import { Document, Packer, Paragraph } from "docx";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { text = "" } = await req.json();

  const paragraphs = String(text)
    .split(/\n+/)
    .map((line: string) => new Paragraph({ text: line }));

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const buf = await Packer.toBuffer(doc);
// ✅ Utiliser Uint8Array (compatible BodyInit)
return new Response(new Uint8Array(buf), {
  headers: {
    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "Content-Disposition": `attachment; filename=HelvetiLex_${Date.now()}.docx`,
  },
});
}
