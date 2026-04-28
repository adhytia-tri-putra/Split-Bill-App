import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get("from")?.toUpperCase();
  const to = req.nextUrl.searchParams.get("to")?.toUpperCase();

  if (!from || !to) {
    return NextResponse.json(
      { success: false, error: "Parameter from dan to wajib diisi." },
      { status: 400 },
    );
  }

  if (from === to) {
    return NextResponse.json({ success: true, rate: 1 });
  }

  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=${from}&to=${to}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Gagal mengambil data kurs." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      rates?: Record<string, number>;
    };
    const rate = data.rates?.[to];

    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
      return NextResponse.json(
        { success: false, error: "Data kurs tidak valid." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, rate });
  } catch {
    return NextResponse.json(
      { success: false, error: "Tidak bisa terhubung ke layanan kurs." },
      { status: 502 },
    );
  }
}
