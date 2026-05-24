import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BILL_DATA_STORAGE_KEY,
  CURRENCY_CODE_STORAGE_KEY,
  DEFAULT_CURRENCY_CODE,
  SPLIT_CONFIRMED_STORAGE_KEY,
  SPLIT_RESULT_STORAGE_KEY,
  calculateBillTotal,
  formatCurrency,
  isUnknownItemName,
  normalizeCurrencyCode,
  parseStoredBillData,
  parseStoredSplitResult,
  type BillData,
  type SplitResultData,
} from "@/lib/bill";

export function useVerifyData() {
  const [billData, setBillData] = useState<BillData | null>(null);
  const [splitResult, setSplitResult] = useState<SplitResultData | null>(null);
  const [isSplitConfirmed, setIsSplitConfirmed] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY_CODE);

  const formatAmount = useCallback(
    (value: number) => formatCurrency(value, currencyCode),
    [currencyCode],
  );

  useEffect(() => {
    if (!billData) {
      return;
    }
    localStorage.setItem(BILL_DATA_STORAGE_KEY, JSON.stringify(billData));
  }, [billData]);

  useEffect(() => {
    const hydrate = () => {
      const storedBill = localStorage.getItem(BILL_DATA_STORAGE_KEY);
      const parsedBill = parseStoredBillData(storedBill);
      if (parsedBill) setBillData(parsedBill);

      const storedSplit = localStorage.getItem(SPLIT_RESULT_STORAGE_KEY);
      const parsedSplit = parseStoredSplitResult(storedSplit);
      setSplitResult(parsedSplit);
      if (parsedSplit?.currencyCode) {
        setCurrencyCode(normalizeCurrencyCode(parsedSplit.currencyCode));
      } else {
        const storedCurrency = localStorage.getItem(CURRENCY_CODE_STORAGE_KEY);
        setCurrencyCode(normalizeCurrencyCode(storedCurrency));
      }
      setIsSplitConfirmed(
        localStorage.getItem(SPLIT_CONFIRMED_STORAGE_KEY) === "true",
      );
    };

    hydrate();
    window.addEventListener("focus", hydrate);
    return () => window.removeEventListener("focus", hydrate);
  }, []);

  const items = useMemo(() => billData?.items ?? [], [billData]);
  const subtotal = useMemo(() => calculateBillTotal(billData), [billData]);
  const unknownCount = useMemo(
    () => items.filter((item) => isUnknownItemName(item.name)).length,
    [items],
  );

  const splitResultShareText = useMemo(() => {
    if (splitResult) {
      return [
        "Split Bill Summary",
        `Total tagihan: ${formatAmount(splitResult.billTotal)}`,
        "",
        ...splitResult.participants.map(
          (person, index) =>
            `${index + 1}. ${person.name}: ${formatAmount(person.total)}`,
        ),
        "",
        `Terbagi: ${formatAmount(splitResult.allocatedGrandTotal)}`,
        `Selisih: ${formatAmount(Math.abs(splitResult.remainingDiff))}`,
        `Item belum dibagi: ${splitResult.unassignedCount}`,
      ].join("\n");
    }

    return [
      "Split Bill Summary",
      `Total tagihan: ${formatAmount(subtotal)}`,
      `Jumlah item: ${items.length}`,
    ].join("\n");
  }, [formatAmount, items.length, splitResult, subtotal]);

  return {
    billData,
    splitResult,
    isSplitConfirmed,
    setIsSplitConfirmed,
    items,
    subtotal,
    total: subtotal,
    unknownCount,
    formatAmount,
    splitResultShareText,
  };
}

