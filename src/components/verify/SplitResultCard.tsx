import { type SplitResultData } from "@/lib/bill";

interface SplitResultCardProps {
  splitResult: SplitResultData;
  formatAmount: (value: number) => string;
}

export default function SplitResultCard({
  splitResult,
  formatAmount,
}: SplitResultCardProps) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-lg font-semibold text-zinc-900">
        Rincian Setelah Edit Split
      </p>
      <p className="mt-1 text-sm text-zinc-600">
        Update terakhir: {new Date(splitResult.updatedAt).toLocaleString("id-ID")}
      </p>

      <div className="mt-4 space-y-2.5">
        {splitResult.participants.map((person) => (
          <div
            key={person.id}
            className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-900">{person.name}</p>
              <p className="text-sm font-semibold text-[#0c0956]">
                {formatAmount(person.total)}
              </p>
            </div>

            <div className="mt-2 space-y-1">
              {person.items.map((item, idx) => (
                <div
                  key={`${person.id}-${idx}`}
                  className="flex items-start justify-between gap-3 text-xs text-zinc-700">
                  <span className="line-clamp-1">{item.itemName}</span>
                  <span>{formatAmount(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1.5 border-t border-zinc-200 pt-3 text-sm text-zinc-700">
        <div className="flex justify-between">
          <span>Total Tagihan</span>
          <span className="font-medium">{formatAmount(splitResult.billTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Terbagi</span>
          <span className="font-medium">
            {formatAmount(splitResult.allocatedGrandTotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Selisih</span>
          <span className="font-medium">
            {formatAmount(Math.abs(splitResult.remainingDiff))}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Item belum dibagi</span>
          <span>{splitResult.unassignedCount}</span>
        </div>
      </div>
    </div>
  );
}

