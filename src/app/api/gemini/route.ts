import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const SUPPORTED_CURRENCIES = ["IDR", "USD", "SGD", "EUR"] as const;
type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

function inferCurrencyFromText(text: string): SupportedCurrency {
  const normalized = text.toUpperCase();

  if (
    normalized.includes("SGD") ||
    normalized.includes("S$") ||
    normalized.includes("SINGAPORE DOLLAR")
  ) {
    return "SGD";
  }

  if (
    normalized.includes("EUR") ||
    normalized.includes("€") ||
    normalized.includes("EURO")
  ) {
    return "EUR";
  }

  if (
    normalized.includes("USD") ||
    normalized.includes("US$") ||
    normalized.includes("$")
  ) {
    return "USD";
  }

  if (
    normalized.includes("IDR") ||
    normalized.includes("RP") ||
    normalized.includes("RUPIAH")
  ) {
    return "IDR";
  }

  return "IDR";
}

function normalizeCurrency(value: unknown, fallback: SupportedCurrency): SupportedCurrency {
  if (typeof value !== "string") {
    return fallback;
  }
  const upper = value.trim().toUpperCase();
  if (SUPPORTED_CURRENCIES.includes(upper as SupportedCurrency)) {
    return upper as SupportedCurrency;
  }
  return fallback;
}

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
        "currency_code": "IDR",
        "items": [
          { "name": "Nama Barang", "price": 10000, "quantity": 1 }
        ],
        "total_harga": 10000
      }

      Aturan currency:
      - currency_code WAJIB salah satu dari: IDR, USD, SGD, EUR.
      - Deteksi dari simbol/teks pada struk (contoh Rp -> IDR, $/USD -> USD, S$ -> SGD, € -> EUR).

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

    const parsed = JSON.parse(outputText) as {
      currency_code?: unknown;
      items?: unknown;
      total_harga?: unknown;
    };
    const fallbackCurrency = inferCurrencyFromText(text);
    const normalizedCurrency = normalizeCurrency(
      parsed.currency_code,
      fallbackCurrency,
    );

    const normalizedPayload = {
      currency_code: normalizedCurrency,
      items: Array.isArray(parsed.items) ? parsed.items : [],
      total_harga:
        typeof parsed.total_harga === "number" ? parsed.total_harga : 0,
    };

    return NextResponse.json({
      success: true,
      data: JSON.stringify(normalizedPayload),
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
