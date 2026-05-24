import type { BillItem } from "@/lib/bill";

export interface Participant {
  id: string;
  name: string;
}

export interface ItemSplitRow {
  itemIndex: number;
  item: BillItem;
  itemTotal: number;
  selectedPayers: Participant[];
  amountsByParticipant: Record<string, number>;
  allocated: number;
  isAssigned: boolean;
}

export interface ParticipantBreakdownItem {
  itemName: string;
  amount: number;
}

export interface ParticipantBreakdown {
  id: string;
  name: string;
  total: number;
  items: ParticipantBreakdownItem[];
}

export const CHIP_STYLES = [
  "bg-[#fce7f3] text-[#9d174d] ring-[#f9a8d4]",
  "bg-[#dcfce7] text-[#166534] ring-[#86efac]",
  "bg-[#e0f2fe] text-[#075985] ring-[#7dd3fc]",
  "bg-[#ffedd5] text-[#9a3412] ring-[#fdba74]",
  "bg-[#ede9fe] text-[#5b21b6] ring-[#c4b5fd]",
  "bg-[#ecfccb] text-[#3f6212] ring-[#bef264]",
];

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return "?";
  }

  const words = trimmed.split(/\s+/).slice(0, 2);
  return words.map((word) => word.charAt(0).toUpperCase()).join("");
}
