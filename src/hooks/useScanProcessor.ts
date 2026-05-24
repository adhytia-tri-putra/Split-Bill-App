import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BILL_DATA_STORAGE_KEY,
  CURRENCY_CODE_STORAGE_KEY,
  DEFAULT_CURRENCY_CODE,
  normalizeCurrencyCode,
  type BillData,
} from "@/lib/bill";

interface GeminiResult {
  success?: boolean;
  data?: string;
  error?: string;
}

function toBillData(raw: unknown): BillData {
  const parsed = (raw ?? {}) as Partial<BillData>;
  return {
    items: Array.isArray(parsed.items) ? parsed.items : [],
    total_harga: typeof parsed.total_harga === "number" ? parsed.total_harga : 0,
  };
}

export function useScanProcessor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    localStorage.clear();
  }, []);

  const processWithGemini = useCallback(
    async (text: string) => {
      setLoading(true);
      setErrorMessage("");

      try {
        const geminiRes = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const geminiResult = (await geminiRes.json()) as GeminiResult;

        if (!geminiRes.ok || !geminiResult.success || !geminiResult.data) {
          setErrorMessage(geminiResult.error || "Gagal memproses struk.");
          return;
        }

        const parsed = JSON.parse(geminiResult.data) as BillData & {
          currency_code?: string;
        };
        const billData = toBillData(parsed);
        const currencyCode = normalizeCurrencyCode(
          parsed.currency_code ?? DEFAULT_CURRENCY_CODE,
        );
        localStorage.setItem(BILL_DATA_STORAGE_KEY, JSON.stringify(billData));
        localStorage.setItem(CURRENCY_CODE_STORAGE_KEY, currencyCode);
        router.push("/split");
      } catch {
        setErrorMessage("Gagal terhubung ke server.");
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  return {
    loading,
    errorMessage,
    processWithGemini,
    goToManualSplit: () => router.push("/split"),
  };
}

