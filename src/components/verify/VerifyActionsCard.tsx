import ShareButton from "@/components/ui/ShareButton";

interface VerifyActionsCardProps {
  isSplitConfirmed: boolean;
  canShare: boolean;
  shareText: string;
  onEditRincian: () => void;
  onScanUlang: () => void;
}

export default function VerifyActionsCard({
  isSplitConfirmed,
  canShare,
  shareText,
  onEditRincian,
  onScanUlang,
}: VerifyActionsCardProps) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-zinc-500">
        Actions
      </p>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onEditRincian}
          className="w-full rounded-2xl border border-[#0f766e] px-5 py-3 text-base font-semibold text-[#0f766e] transition hover:bg-[#0f766e]/10">
          Edit Rincian
        </button>

        {isSplitConfirmed && canShare ? (
          <ShareButton
            text={shareText}
            label="Bagikan Tagihan"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        ) : (
          <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-center text-xs text-zinc-600">
            Share aktif setelah kamu klik confirm dan buat pembagian.
          </p>
        )}

        <button
          type="button"
          onClick={onScanUlang}
          className="w-full text-sm font-medium text-zinc-500 underline-offset-2 hover:text-zinc-700 hover:underline">
          Scan Ulang Struk
        </button>
      </div>
    </div>
  );
}

