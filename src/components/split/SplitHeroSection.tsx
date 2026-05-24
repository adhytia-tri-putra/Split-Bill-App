import { CURRENCY_OPTIONS } from "@/lib/bill";

interface SplitHeroSectionProps {
  currencyCode: string;
  isConvertingCurrency: boolean;
  currencyError: string;
  onCurrencyChange: (nextCurrency: string) => void | Promise<void>;
}

export default function SplitHeroSection({
  currencyCode,
  isConvertingCurrency,
  currencyError,
  onCurrencyChange,
}: SplitHeroSectionProps) {
  return (
    <header className="rounded-3xl border border-zinc-200 bg-white/90 px-5 py-4 shadow-sm sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f766e]">
            Split By Item
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Pilih Pembayar Di Tiap Item
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600">
            Konsepnya per item: siapa saja yang dicentang, itu yang ikut bayar.
            Nominal item otomatis dibagi rata ke yang dipilih.
          </p>
        </div>
        <label className="w-full sm:w-auto sm:min-w-[190px]">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
            Mata Uang
          </span>
          <select
            value={currencyCode}
            onChange={(e) => {
              void onCurrencyChange(e.target.value);
            }}
            disabled={isConvertingCurrency}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 focus:border-zinc-400 focus:outline-none">
            {CURRENCY_OPTIONS.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
      </div>
      {currencyError ? (
        <p className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {currencyError}
        </p>
      ) : null}
    </header>
  );
}
