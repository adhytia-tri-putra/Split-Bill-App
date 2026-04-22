import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GEMINI_API_KEY belum diatur di .env.local. Tambahkan API key lalu restart server.",
        },
        { status: 500 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Teks tidak ditemukan" },
        { status: 400 },
      );
    }

    // Prompt Engineering: Instruksi eksplisit untuk memastikan output JSON yang bersih dan terstruktur.
    const prompt = `
      Anda adalah API yang hanya mengembalikan JSON. 
      Tugas: Ubah teks struk belanja mentah berikut menjadi data JSON terstruktur.
      
      ATURAN WAJIB:
      - KEMBALIKAN HANYA JSON MURNI.
      - JANGAN tambahkan teks pengantar seperti "Berikut adalah...".
      - JANGAN gunakan blok markdown (seperti \`\`\`json).
      
      Format yang diharapkan:
      {
        "items": [
          { "name": "Nama Barang", "price": 10000, "quantity": 1 }
        ],
        "total_harga": 10000
      }

      Teks Struk Mentah:
      ${text}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    let outputText = response.text || "";

    // Sanitasi: Hapus blok markdown jika ada, dan trim whitespace.
    outputText = outputText.replace(/```json/g, "");
    outputText = outputText.replace(/```/g, "");
    outputText = outputText.trim();

    return NextResponse.json({
      success: true,
      data: outputText,
    });
  } catch (error: unknown) {
    console.error("Gemini Error:", error);

    const err = error as { message?: string; status?: number } | null;
    const message =
      typeof err?.message === "string"
        ? err.message
        : "Gagal memproses permintaan ke Gemini.";
    const status = typeof err?.status === "number" ? err.status : 500;

    return NextResponse.json({ success: false, error: message }, { status });
  }
}
