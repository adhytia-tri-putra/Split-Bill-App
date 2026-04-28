"use client";

import QuickTips from "@/components/scan/QuickTips";
import Scanner from "@/components/ui/Scanner";
import SplitbillHeader from "@/components/ui/SplitbillHeader";
import { useScanProcessor } from "@/hooks/useScanProcessor";

export default function ScanPage() {
  const { loading, errorMessage, processWithGemini, goToManualSplit } =
    useScanProcessor();

  return (
    <div className="min-h-screen bg-[#eceef3] text-zinc-900">
      <SplitbillHeader showBackButton={false} />

      <main className="mx-auto w-full max-w-[1180px] px-6 pb-20 pt-12">
        <section className="mx-auto max-w-5xl">
          <article className="rounded-3xl border border-zinc-200/90 bg-white p-8 sm:p-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#0c0956]/6 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0c0956]">
              OCR Receipt Scanner
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-[#11134a] sm:text-5xl">
              Scan Receipt
            </h2>
            <p className="mt-3 text-lg text-zinc-600">
              Upload foto struk untuk lanjut ke split tagihan, atau isi manual.
            </p>
            <button
              type="button"
              onClick={goToManualSplit}
              className="mt-4 rounded-full border border-[#0c0956] px-5 py-2 text-sm font-semibold text-[#0c0956] transition hover:bg-[#0c0956] hover:text-white">
              Mulai Split Manual
            </button>

            <div className="mt-8">
              <Scanner onScanComplete={processWithGemini} />
            </div>

            {loading ? (
              <div className="mt-4 rounded-xl border border-[#0c0956]/20 bg-[#0c0956]/5 px-4 py-3 text-sm text-[#0c0956]">
                Memproses OCR dan AI, mohon tunggu...
              </div>
            ) : null}

            {errorMessage ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <QuickTips />
          </article>
        </section>
      </main>
    </div>
  );
}
