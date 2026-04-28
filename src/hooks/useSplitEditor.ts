import { useCallback, useEffect, useMemo, useState } from "react";
import { type Participant } from "@/components/split/shared";
import {
  BILL_DATA_STORAGE_KEY,
  CURRENCY_CODE_STORAGE_KEY,
  DEFAULT_CURRENCY_CODE,
  calculateBillTotal,
  calculateTotalFromItems,
  formatCurrency,
  getCurrencyFractionDigits,
  normalizeCurrencyCode,
  parseStoredBillData,
  roundCurrency,
  type BillData,
  type BillItem,
} from "@/lib/bill";
import { normalizeItemPayersByShape } from "./useSplitComputation";

export type ItemPayerSelections = Record<number, Record<string, boolean>>;

const DEFAULT_PARTICIPANTS: Participant[] = [
  { id: "p1", name: "Orang 1" },
  { id: "p2", name: "Orang 2" },
];

const DEFAULT_MANUAL_BILL_DATA: BillData = {
  items: [{ name: "Item Baru", quantity: 1, price: 0 }],
  total_harga: 0,
};

export function useSplitEditor() {
  const [currencyCode, setCurrencyCode] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_CURRENCY_CODE;
    }
    return normalizeCurrencyCode(localStorage.getItem(CURRENCY_CODE_STORAGE_KEY));
  });
  const [billData, setBillData] = useState<BillData | null>(null);
  const [participants, setParticipants] =
    useState<Participant[]>(DEFAULT_PARTICIPANTS);
  const [nextParticipantId, setNextParticipantId] = useState(3);
  const [itemPayers, setItemPayers] = useState<ItemPayerSelections>({});
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [isConvertingCurrency, setIsConvertingCurrency] = useState(false);
  const [currencyError, setCurrencyError] = useState("");

  const formatAmount = useCallback(
    (value: number) => formatCurrency(value, currencyCode),
    [currencyCode],
  );

  useEffect(() => {
    const stored = localStorage.getItem(BILL_DATA_STORAGE_KEY);
    const parsed = parseStoredBillData(stored);
    if (parsed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBillData(parsed);
      return;
    }

    localStorage.setItem(
      BILL_DATA_STORAGE_KEY,
      JSON.stringify(DEFAULT_MANUAL_BILL_DATA),
    );
    setBillData(DEFAULT_MANUAL_BILL_DATA);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      CURRENCY_CODE_STORAGE_KEY,
      normalizeCurrencyCode(currencyCode),
    );
  }, [currencyCode]);

  useEffect(() => {
    if (billData) {
      localStorage.setItem(BILL_DATA_STORAGE_KEY, JSON.stringify(billData));
    }
  }, [billData]);

  useEffect(() => {
    const itemCount = billData?.items.length ?? 0;
    const participantIds = participants.map((person) => person.id);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItemPayers((prev) =>
      normalizeItemPayersByShape(itemCount, participantIds, prev),
    );
  }, [billData?.items, participants]);

  const billItems = useMemo(() => billData?.items ?? [], [billData]);
  const billTotal = useMemo(() => calculateBillTotal(billData), [billData]);

  const updateBillItems = useCallback((nextItems: BillItem[]) => {
    setBillData((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        items: nextItems,
        total_harga: calculateTotalFromItems(nextItems),
      };
    });
  }, []);

  const handleCurrencyChange = useCallback(
    async (nextCurrencyRaw: string) => {
      const nextCurrency = normalizeCurrencyCode(nextCurrencyRaw);
      if (nextCurrency === currencyCode) {
        return;
      }

      if (!billData) {
        setCurrencyCode(nextCurrency);
        return;
      }

      setCurrencyError("");
      setIsConvertingCurrency(true);
      try {
        const rateRes = await fetch(
          `/api/exchange-rate?from=${currencyCode}&to=${nextCurrency}`,
        );
        const rateJson = (await rateRes.json()) as {
          success?: boolean;
          rate?: number;
          error?: string;
        };

        if (
          !rateRes.ok ||
          !rateJson.success ||
          typeof rateJson.rate !== "number"
        ) {
          setCurrencyError(
            rateJson.error || "Gagal konversi kurs. Coba lagi beberapa saat lagi.",
          );
          return;
        }

        const digits = getCurrencyFractionDigits(nextCurrency);
        const convertedItems = billData.items.map((item) => {
          const convertedPrice = roundCurrency(item.price * rateJson.rate, digits);
          return {
            ...item,
            price: Math.max(0, convertedPrice),
          };
        });

        updateBillItems(convertedItems);
        setCurrencyCode(nextCurrency);
      } catch {
        setCurrencyError("Tidak bisa mengambil kurs terbaru saat ini.");
      } finally {
        setIsConvertingCurrency(false);
      }
    },
    [billData, currencyCode, updateBillItems],
  );

  const updateBillItemField = useCallback(
    (itemIndex: number, field: keyof BillItem, value: string) => {
      const nextItems = billItems.map((item, idx) => {
        if (idx !== itemIndex) {
          return item;
        }

        if (field === "name") {
          return { ...item, name: value };
        }

        const numericValue = Number(value);
        const safeValue = Number.isFinite(numericValue)
          ? Math.max(0, numericValue)
          : 0;
        return { ...item, [field]: safeValue };
      });

      updateBillItems(nextItems);
    },
    [billItems, updateBillItems],
  );

  const addBillItem = useCallback(() => {
    setEditingItemIndex(billItems.length);
    updateBillItems([...billItems, { name: "", quantity: 1, price: 0 }]);
  }, [billItems, updateBillItems]);

  const removeBillItem = useCallback(
    (itemIndex: number) => {
      setEditingItemIndex((prev) => {
        if (prev === null) {
          return prev;
        }
        if (prev === itemIndex) {
          return null;
        }
        if (prev > itemIndex) {
          return prev - 1;
        }
        return prev;
      });
      updateBillItems(billItems.filter((_, idx) => idx !== itemIndex));
    },
    [billItems, updateBillItems],
  );

  const addParticipant = useCallback(() => {
    setParticipants((prev) => [
      ...prev,
      { id: `p${nextParticipantId}`, name: `Orang ${nextParticipantId}` },
    ]);
    setNextParticipantId((prev) => prev + 1);
  }, [nextParticipantId]);

  const updateParticipantName = useCallback((id: string, name: string) => {
    setParticipants((prev) =>
      prev.map((person) => (person.id === id ? { ...person, name } : person)),
    );
  }, []);

  const removeParticipant = useCallback((id: string) => {
    setParticipants((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter((person) => person.id !== id);
    });
  }, []);

  const togglePayerForItem = useCallback(
    (itemIndex: number, participantId: string) => {
      setItemPayers((prev) => {
        const row = prev[itemIndex] ?? {};
        const current = Boolean(row[participantId]);

        return {
          ...prev,
          [itemIndex]: {
            ...row,
            [participantId]: !current,
          },
        };
      });
    },
    [],
  );

  const setAllPayersForItem = useCallback(
    (itemIndex: number, checked: boolean) => {
      const nextRow: Record<string, boolean> = {};
      participants.forEach((person) => {
        nextRow[person.id] = checked;
      });

      setItemPayers((prev) => ({
        ...prev,
        [itemIndex]: nextRow,
      }));
    },
    [participants],
  );

  return {
    currencyCode,
    billData,
    participants,
    itemPayers,
    editingItemIndex,
    isConvertingCurrency,
    currencyError,
    billItems,
    billTotal,
    formatAmount,
    setEditingItemIndex,
    handleCurrencyChange,
    updateBillItemField,
    addBillItem,
    removeBillItem,
    addParticipant,
    updateParticipantName,
    removeParticipant,
    togglePayerForItem,
    setAllPayersForItem,
  };
}
