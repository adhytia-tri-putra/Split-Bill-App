"use client";

import { useRouter } from "next/navigation";
import ReceiptItemsCard from "@/components/verify/ReceiptItemsCard";
import SplitResultCard from "@/components/verify/SplitResultCard";
import VerifyActionsCard from "@/components/verify/VerifyActionsCard";
import SplitbillHeader from "@/components/ui/SplitbillHeader";
import { useVerifyData } from "@/hooks/useVerifyData";
import {
  SPLIT_CONFIRMED_STORAGE_KEY,
} from "@/lib/bill";

export default function VerifyPage() {
  const router = useRouter();
  const {
    billData,
    splitResult,
    isSplitConfirmed,
    setIsSplitConfirmed,
    items,
    subtotal,
    total,
    unknownCount,
    formatAmount,
    splitResultShareText,
  } = useVerifyData();

  const goToSplitRincian = () => {
    localStorage.setItem(SPLIT_CONFIRMED_STORAGE_KEY, "false");
    setIsSplitConfirmed(false);
    router.push("/split#rincian-tagihan");
  };

  if (!billData) {
    return (
      <div className="min-h-screen bg-[#eceef3] text-zinc-900">
        <SplitbillHeader backHref="/split" />
        <main className="mx-auto flex w-full max-w-[1180px] px-6 pb-16 pt-12">
          <section className="rounded-3xl border border-zinc-200 bg-white p-8">
            <h2 className="text-3xl font-semibold tracking-tight">
              Belum ada scan
            </h2>
            <p className="mt-2 text-zinc-600">
              Upload struk terlebih dahulu agar bisa masuk ke halaman
              verifikasi.
            </p>
            <button
              type="button"
              onClick={() => router.push("/scan")}
              className="mt-6 rounded-full bg-[#0c0956] px-6 py-3 text-base font-semibold text-white shadow-sm">
              Ke Halaman Scan
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f5f9] text-zinc-900">
      <SplitbillHeader backHref="/split" />

      <main className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        <header className="rounded-3xl border border-zinc-200 bg-white/90 px-5 py-4 shadow-sm sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Verify & Share Tagihan
          </h2>
          <p className="mt-1 text-sm text-zinc-600 sm:text-base">
            Cek item, pastikan pembagian sudah benar, lalu kirim ringkasan ke
            WhatsApp.
          </p>
        </header>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <ReceiptItemsCard
            items={items}
            subtotal={subtotal}
            total={total}
            formatAmount={formatAmount}
          />

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xl font-semibold text-zinc-900">
                Scan Confidence: {unknownCount > 0 ? "High" : "High"}
              </p>
              <p className="mt-2 text-base text-zinc-600">
                {items.length} items detected.{" "}
                {unknownCount > 0
                  ? "Please verify the unknown item before continuing."
                  : "Everything looks good, continue to split costs."}
              </p>
            </div>
            {splitResult ? (
              <SplitResultCard splitResult={splitResult} formatAmount={formatAmount} />
            ) : null}

            <VerifyActionsCard
              isSplitConfirmed={isSplitConfirmed}
              canShare={Boolean(splitResult)}
              shareText={splitResultShareText}
              onEditRincian={goToSplitRincian}
              onScanUlang={() => router.push("/scan")}
            />
          </aside>
        </section>
      </main>
    </div>
  );
}
