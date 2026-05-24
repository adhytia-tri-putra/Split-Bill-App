import { isUnknownItemName, type BillItem } from "@/lib/bill";

interface ReceiptItemsCardProps {
  items: BillItem[];
  subtotal: number;
  total: number;
  formatAmount: (value: number) => string;
}

export default function ReceiptItemsCard({
  items,
  subtotal,
  total,
  formatAmount,
}: ReceiptItemsCardProps) {
  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7">
          <path d="M6 4h12l1 4v2a3 3 0 0 1-2 2.82V18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-5.18A3 3 0 0 1 5 10V8l1-4Zm2.31 0-.5 3h2.87V4H8.31Zm4.02 0v3h2.86l-.5-3h-2.36ZM8 9a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm8 0a1 1 0 1 0 1 1 1 1 0 0 0-1-1ZM9 14v4h6v-4H9Z" />
        </svg>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Scanned Receipt
        </h3>
        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-zinc-500">
          Ready to split
        </p>
      </div>

      <div className="my-6 border-t border-dashed border-zinc-300" />

      <div className="space-y-3">
        {items.map((item, idx) => {
          const itemTotal = item.price * item.quantity;
          const unknown = isUnknownItemName(item.name);
          return (
            <div
              key={`${item.name}-${idx}`}
              className={
                unknown
                  ? "rounded-xl border border-red-200 bg-red-50 px-3 py-2.5"
                  : "rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2.5"
              }>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-zinc-900 sm:text-lg">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-600 sm:text-base">
                    {item.quantity} @ {formatAmount(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-zinc-900 sm:text-lg">
                    {formatAmount(itemTotal)}
                  </p>
                  <div className="mt-1.5 flex items-center justify-end gap-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        unknown ? "text-red-700" : "text-zinc-600"
                      }`}>
                      {unknown ? "Perlu dicek" : "OK"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="my-6 border-t border-zinc-200" />

      <div className="space-y-2 text-base text-zinc-700">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-medium">{formatAmount(subtotal)}</span>
        </div>
      </div>

      <div className="my-5 border-t border-dashed border-zinc-300" />

      <div className="flex items-center justify-between text-2xl font-semibold tracking-tight text-[#11134a] sm:text-3xl">
        <span className="text-zinc-900">Total</span>
        <span>{formatAmount(total)}</span>
      </div>
    </article>
  );
}

