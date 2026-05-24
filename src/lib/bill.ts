export interface BillItem {
  name: string;
  price: number;
  quantity: number;
}

export interface BillData {
  items: BillItem[];
  total_harga: number;
}

export interface SplitDetailItem {
  itemName: string;
  amount: number;
}

export interface SplitParticipantSummary {
  id: string;
  name: string;
  total: number;
  items: SplitDetailItem[];
}

export interface SplitResultData {
  participants: SplitParticipantSummary[];
  billTotal: number;
  allocatedGrandTotal: number;
  remainingDiff: number;
  unassignedCount: number;
  currencyCode: string;
  updatedAt: string;
}

export const SPLIT_RESULT_STORAGE_KEY = "split-bill:last-split-result";
export const SPLIT_CONFIRMED_STORAGE_KEY = "split-bill:is-split-confirmed";
export const CURRENCY_CODE_STORAGE_KEY = "split-bill:currency-code";
export const DEFAULT_CURRENCY_CODE = "IDR";
export const CURRENCY_OPTIONS = ["IDR", "USD", "SGD", "EUR"] as const;

export const BILL_DATA_STORAGE_KEY = "split-bill:last-bill-data";

export const IDR_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export function normalizeCurrencyCode(value: string | null | undefined): string {
  const next = (value ?? "").trim().toUpperCase();
  if (!next || !CURRENCY_OPTIONS.includes(next as (typeof CURRENCY_OPTIONS)[number])) {
    return DEFAULT_CURRENCY_CODE;
  }
  return next;
}

export function formatCurrency(value: number, currencyCode: string): string {
  const safeCode = normalizeCurrencyCode(currencyCode);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: safeCode,
    }).format(value);
  } catch {
    return IDR_FORMATTER.format(value);
  }
}

export function roundCurrency(value: number, fractionDigits = 2): number {
  const factor = 10 ** fractionDigits;
  return Math.round(value * factor) / factor;
}

export function getCurrencyFractionDigits(currencyCode: string): number {
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: normalizeCurrencyCode(currencyCode),
    });
    const maxDigits = formatter.resolvedOptions().maximumFractionDigits;
    return typeof maxDigits === "number" ? maxDigits : 2;
  } catch {
    return 2;
  }
}

export function calculateTotalFromItems(items: BillItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateBillTotal(data: BillData | null): number {
  if (!data) {
    return 0;
  }

  return calculateTotalFromItems(data.items ?? []);
}

export function parseStoredBillData(raw: string | null): BillData | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as BillData;
    if (!Array.isArray(parsed.items)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function parseStoredSplitResult(
  raw: string | null,
): SplitResultData | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SplitResultData;
    if (!Array.isArray(parsed.participants)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isUnknownItemName(name: string): boolean {
  const normalized = name.toLowerCase();
  return (
    normalized.includes("unknown") ||
    normalized.includes("tidak dikenal") ||
    normalized.includes("tidak diketahui")
  );
}
