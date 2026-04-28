import { CHIP_STYLES, getInitials, type ParticipantBreakdown } from "./shared";

interface SplitSummarySectionProps {
  participantBreakdown: ParticipantBreakdown[];
  formatAmount: (value: number) => string;
}

export default function SplitSummarySection({
  participantBreakdown,
  formatAmount,
}: SplitSummarySectionProps) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-base font-semibold text-zinc-900">Rincian Hasil Split</h3>
      <p className="mt-1 text-sm text-zinc-600">
        Ini total yang harus dibayar masing-masing orang setelah pembagian per
        item.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {participantBreakdown.map((person, idx) => (
          <article
            key={`summary-${person.id}`}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-1 ${
                    CHIP_STYLES[idx % CHIP_STYLES.length]
                  }`}>
                  {getInitials(person.name)}
                </span>
                <h4 className="text-sm font-semibold text-zinc-900">
                  {person.name}
                </h4>
              </div>
              <p className="text-sm font-semibold text-[#0b132b]">
                {formatAmount(person.total)}
              </p>
            </div>

            {person.items.length > 0 ? (
              <div className="mt-3 space-y-1.5">
                {person.items.map((entry, entryIndex) => (
                  <div
                    key={`${person.id}-${entry.itemName}-${entryIndex}`}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs">
                    <span className="text-zinc-700">{entry.itemName}</span>
                    <span className="font-semibold text-zinc-900">
                      {formatAmount(entry.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-500">
                Belum ada item untuk orang ini.
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
