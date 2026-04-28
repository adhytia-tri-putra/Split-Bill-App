interface SplitBottomBarProps {
  billTotal: number;
  unassignedCount: number;
  remainingDiff: number;
  formatAmount: (value: number) => string;
  onConfirm: () => void;
}

export default function SplitBottomBar({
  billTotal,
  unassignedCount,
  remainingDiff,
  formatAmount,
  onConfirm,
}: SplitBottomBarProps) {
  return (
    <section className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-3 pb-[env(safe-area-inset-bottom)]">
        <div>
          <p className="text-xs text-zinc-500">Total</p>
          <p className="text-lg font-semibold text-zinc-900">
            {formatAmount(billTotal)}
          </p>
          <p
            className={`text-xs ${
              unassignedCount === 0 && remainingDiff === 0
                ? "text-emerald-600"
                : "text-amber-600"
            }`}>
            {unassignedCount} item belum dibagi |{" "}
            {remainingDiff === 0
              ? "selisih pas"
              : `selisih ${formatAmount(Math.abs(remainingDiff))}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-[#0c0956] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#08063f] focus:outline-none focus:ring-2 focus:ring-indigo-300 sm:px-6 sm:py-3">
          Buat Pembagian
        </button>
      </div>
    </section>
  );
}
