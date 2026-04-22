export interface BillItem {
  name: string;
  price: number;
  quantity: number;
}

export interface BillData {
  items: BillItem[];
  total_harga: number;
}

interface BillTableProps {
  data: BillData | null;
  onChange?: (nextData: BillData) => void;
}

function calculateTotal(items: BillItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export default function BillTable({ data, onChange }: BillTableProps) {
  const items: BillItem[] = data?.items || [];
  const total = data ? calculateTotal(items) : 0;

  const updateItems = (nextItems: BillItem[]) => {
    if (!onChange) return;
    onChange({
      items: nextItems,
      total_harga: calculateTotal(nextItems),
    });
  };

  const handleItemChange = (
    index: number,
    field: keyof BillItem,
    value: string,
  ) => {
    const nextItems = items.map((item, idx) => {
      if (idx !== index) return item;

      if (field === "name") {
        return { ...item, name: value };
      }

      const numericValue = Number(value);
      const safeValue = Number.isFinite(numericValue)
        ? Math.max(0, numericValue)
        : 0;

      return {
        ...item,
        [field]: safeValue,
      };
    });

    updateItems(nextItems);
  };

  const addItem = () => {
    const nextItems = [...items, { name: "", quantity: 1, price: 0 }];
    updateItems(nextItems);
  };

  const removeItem = (index: number) => {
    const nextItems = items.filter((_, idx) => idx !== index);
    updateItems(nextItems);
  };

  return (
    <div className="overflow-x-auto space-y-4">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-zinc-100 dark:bg-zinc-800">
          <tr>
            <th className="px-4 py-2">Item</th>
            <th className="px-4 py-2">Qty</th>
            <th className="px-4 py-2 text-right">Harga</th>
            <th className="px-4 py-2 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b dark:border-zinc-800">
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(idx, "name", e.target.value)
                  }
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1"
                  placeholder="Nama item"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(idx, "quantity", e.target.value)
                  }
                  className="w-24 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1"
                />
              </td>
              <td className="px-4 py-3 text-right">
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(idx, "price", e.target.value)
                  }
                  className="w-36 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-right"
                />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="rounded-md border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addItem}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        + Tambah Item
      </button>
      <div className="mt-4 text-right font-bold text-lg">
        Total:{" "}
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(total)}
      </div>
    </div>
  );
}
