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
  // Buffer(Node) -> ArrayBuffer pour Response
  const body = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=HelvetiLex_${Date.now()}.docx`,
    },
  });
}
