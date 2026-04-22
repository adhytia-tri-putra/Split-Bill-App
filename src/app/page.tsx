"use client";

import { useEffect, useState } from "react";
import Scanner from "@/components/ui/Scanner";
import BillTable, { type BillData } from "@/components/ui/BillTable";

const BILL_DATA_STORAGE_KEY = "split-bill:last-bill-data";

export default function Home() {
  const [billData, setBillData] = useState<BillData | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const stored = localStorage.getItem(BILL_DATA_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as BillData) : null;
    } catch (error) {
      console.error("Gagal memuat data tagihan dari localStorage:", error);
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      if (billData) {
        localStorage.setItem(BILL_DATA_STORAGE_KEY, JSON.stringify(billData));
      } else {
        localStorage.removeItem(BILL_DATA_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Gagal menyimpan data tagihan ke localStorage:", error);
    }
  }, [billData]);

  const processWithGemini = async (text: string) => {
    setLoading(true);
    setErrorMessage("");
    setBillData(null);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrorMessage(
          result?.error || "Terjadi kesalahan saat memproses struk.",
        );
        return;
      }

      if (result.data) {
        try {
          setBillData(JSON.parse(result.data) as BillData);
        } catch {
          setErrorMessage(
            "Respons Gemini tidak valid JSON. Coba scan ulang dengan gambar yang lebih jelas.",
          );
        }
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error tidak diketahui";
      console.error("Gagal memproses struk:", message);
      setErrorMessage("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-black dark:text-white">
      <main className="max-w-3x1 mx-auto py-12 px-6 flex flex-col gap-8">
        {/* Header Section */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Split Bill</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Foto struk belanja Anda
          </p>
        </header>

        {/* OCR Scanner Component */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-lg font-medium mb-4">Scan Struk</h2>
          <Scanner
            onScanComplete={(text) => {
              processWithGemini(text);
            }}
          />
          {errorMessage ? (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          ) : null}
        </section>

        {/* Result Table Section */}
        {loading || billData ? (
          <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-lg font-medium mb-4">Rincian Tagihan</h2>
            {loading ? (
              <div className="animate-pulse flex space-y4 flex-col">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6"></div>
              </div>
            ) : (
              <BillTable
                data={billData}
                onChange={(nextData) => {
                  setBillData(nextData);
                }}
              />
            )}
          </section>
        ) : null}
      </main>
    </div>
  );
}
