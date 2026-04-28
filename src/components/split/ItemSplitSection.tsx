import { type BillItem } from "@/lib/bill";
import {
  CHIP_STYLES,
  getInitials,
  type ItemSplitRow,
  type Participant,
} from "./shared";

interface ItemSplitSectionProps {
  itemSplitRows: ItemSplitRow[];
  participants: Participant[];
  itemPayers: Record<number, Record<string, boolean>>;
  editingItemIndex: number | null;
  onUpdateBillItemField: (
    itemIndex: number,
    field: keyof BillItem,
    value: string,
  ) => void;
  onRemoveBillItem: (itemIndex: number) => void;
  onTogglePayerForItem: (itemIndex: number, participantId: string) => void;
  onSetAllPayersForItem: (itemIndex: number, checked: boolean) => void;
  onSetEditingItemIndex: (value: number | null) => void;
  onAddBillItem: () => void;
  formatAmount: (value: number) => string;
}

export default function ItemSplitSection({
  itemSplitRows,
  participants,
  itemPayers,
  editingItemIndex,
  onUpdateBillItemField,
  onRemoveBillItem,
  onTogglePayerForItem,
  onSetAllPayersForItem,
  onSetEditingItemIndex,
  onAddBillItem,
  formatAmount,
}: ItemSplitSectionProps) {
  const actionBtnClass =
    "rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100";

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Daftar Item</h3>
          <p className="mt-1 text-sm text-zinc-600">
            Tap avatar untuk menentukan siapa yang bayar item tersebut.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddBillItem}
          className="rounded-full bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d5f58] focus:outline-none focus:ring-2 focus:ring-emerald-300">
          + Tambah Item
        </button>
      </div>

      <div className="mt-4 space-y-3.5">
        {itemSplitRows.map((row) => (
          <article
            key={`item-row-${row.itemIndex}`}
            className={`rounded-2xl border p-4 sm:p-5 ${
              editingItemIndex === row.itemIndex
                ? "border-indigo-200 bg-indigo-50/40 shadow-[0_0_0_1px_rgba(99,102,241,0.08)]"
                : "border-zinc-200 bg-[#fbfdff]"
            }`}>
            {editingItemIndex === row.itemIndex ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                  <input
                    type="text"
                    value={row.item.name}
                    onChange={(e) =>
                      onUpdateBillItemField(
                        row.itemIndex,
                        "name",
                        e.target.value,
                      )
                    }
                    className="md:col-span-6 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
                    placeholder="Nama item"
                  />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={row.item.quantity}
                    onChange={(e) =>
                      onUpdateBillItemField(
                        row.itemIndex,
                        "quantity",
                        e.target.value,
                      )
                    }
                    className="md:col-span-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
                  />
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={row.item.price}
                    onChange={(e) =>
                      onUpdateBillItemField(
                        row.itemIndex,
                        "price",
                        e.target.value,
                      )
                    }
                    className="md:col-span-3 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveBillItem(row.itemIndex)}
                    className="md:col-span-1 rounded-md border border-red-300 px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                    Hapus
                  </button>
                </div>
                <p className="text-xs text-zinc-600">
                  {row.item.quantity} x {formatAmount(row.item.price)} ={" "}
                  <span className="font-semibold text-zinc-900">
                    {formatAmount(row.itemTotal)}
                  </span>
                </p>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-zinc-900">
                    {row.item.quantity}x{" "}
                    {row.item.name || `Item ${row.itemIndex + 1}`}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-600">
                    {formatAmount(row.itemTotal)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                    row.isAssigned
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                  {row.isAssigned
                    ? `${row.selectedPayers.length} pembayar`
                    : "Belum dibagi"}
                </span>
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {participants.map((person, idx) => {
                const checked = Boolean(itemPayers[row.itemIndex]?.[person.id]);
                const amount = row.amountsByParticipant[person.id] ?? 0;
                const baseStyle = CHIP_STYLES[idx % CHIP_STYLES.length];

                return (
                  <button
                    key={`${row.itemIndex}-${person.id}`}
                    type="button"
                    onClick={() =>
                      onTogglePayerForItem(row.itemIndex, person.id)
                    }
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                      checked
                        ? `${baseStyle} scale-[1.02]`
                        : "bg-white text-zinc-500 ring-zinc-300 hover:text-zinc-700"
                    }`}>
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[10px]">
                      {getInitials(person.name)}
                    </span>
                    <span>
                      {checked ? formatAmount(amount) : person.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <p className="text-zinc-600">
                Teralokasi {formatAmount(row.allocated)} dari{" "}
                {formatAmount(row.itemTotal)}
              </p>
              <div className="flex flex-wrap items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => onRemoveBillItem(row.itemIndex)}
                  className="rounded-md border border-red-300 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                  Hapus
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onSetEditingItemIndex(
                      editingItemIndex === row.itemIndex ? null : row.itemIndex,
                    )
                  }
                  className={`${actionBtnClass} ${
                    editingItemIndex === row.itemIndex
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : ""
                  }`}>
                  {editingItemIndex === row.itemIndex ? "Selesai" : "Edit"}
                </button>
                <button
                  type="button"
                  onClick={() => onSetAllPayersForItem(row.itemIndex, true)}
                  className={actionBtnClass}>
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => onSetAllPayersForItem(row.itemIndex, false)}
                  className={actionBtnClass}>
                  Reset
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
