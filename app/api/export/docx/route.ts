import { NextRequest } from "next/server";
import { Document, Packer, Paragraph } from "docx";

export async function POST(req: NextRequest){
  const { text } = await req.json();
  const paragraphs = (text || "").split(/\n+/).map((line:string)=> new Paragraph({ text: line }));
  const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
  const buf = await Packer.toBuffer(doc);
// Convertir Buffer Node → ArrayBuffer compatible Web
const body = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

return new Response(body, {
  headers: {
    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "Content-Disposition": `attachment; filename=HelvetiLex_${Date.now()}.docx`
  }
});

