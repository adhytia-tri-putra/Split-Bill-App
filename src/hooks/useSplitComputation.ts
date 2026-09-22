import { useMemo } from "react";
import type {
  ItemSplitRow,
  Participant,
  ParticipantBreakdown,
} from "@/components/split/shared";
import {
  normalizeCurrencyCode,
  roundCurrency,
  type BillItem,
  type SplitResultData,
} from "@/lib/bill";

type ItemPayerSelections = Record<number, Record<string, boolean>>;
type ItemSplitModes = Record<number, "equal" | "percentage">;
type ItemPercentages = Record<number, Record<string, number>>;

interface UseSplitComputationParams {
  billItems: BillItem[];
  billTotal: number;
  participants: Participant[];
  itemPayers: ItemPayerSelections;
  itemSplitModes: ItemSplitModes;
  itemPercentages: ItemPercentages;
  currencyCode: string;
}

function distributeCurrency(total: number, count: number): number[] {
  if (count <= 0) {
    return [];
  }

  const totalCents = Math.round(total * 100);
  const base = Math.trunc(totalCents / count);
  let remainder = totalCents - base * count;
  const values = Array.from({ length: count }, () => base);

  for (let i = 0; i < values.length && remainder !== 0; i += 1) {
    if (remainder > 0) {
      values[i] += 1;
      remainder -= 1;
    } else {
      values[i] -= 1;
      remainder += 1;
    }
  }

  return values.map((value) => value / 100);
}

export function normalizeItemPayersByShape(
  itemCount: number,
  participantIds: string[],
  prev: ItemPayerSelections,
): ItemPayerSelections {
  const next: ItemPayerSelections = {};

  for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
    const prevRow = prev[itemIndex] ?? {};
    const row: Record<string, boolean> = {};

    participantIds.forEach((participantId) => {
      row[participantId] = Boolean(prevRow[participantId]);
    });

    next[itemIndex] = row;
  }

  return next;
}

export function useSplitComputation({
  billItems,
  billTotal,
  participants,
  itemPayers,
  itemSplitModes,
  itemPercentages,
  currencyCode,
}: UseSplitComputationParams) {
  const itemSplitRows = useMemo<ItemSplitRow[]>(() => {
    return billItems.map((item, itemIndex) => {
      const rowSelection = itemPayers[itemIndex] ?? {};
      const selectedPayers = participants.filter(
        (person) => rowSelection[person.id],
      );
      const itemTotal = item.price * item.quantity;
      const amountsByParticipant: Record<string, number> = {};
      const splitMode = itemSplitModes[itemIndex] ?? "equal";
      const percentagesByParticipant = itemPercentages[itemIndex] ?? {};
      const percentageTotal = selectedPayers.reduce(
        (sum, person) => sum + Math.max(0, percentagesByParticipant[person.id] ?? 0),
        0,
      );

      if (splitMode === "percentage" && percentageTotal > 0) {
        selectedPayers.forEach((person) => {
          const percent = Math.max(0, percentagesByParticipant[person.id] ?? 0);
          amountsByParticipant[person.id] = roundCurrency(
            itemTotal * (percent / percentageTotal),
          );
        });
      } else {
        const shares = distributeCurrency(itemTotal, selectedPayers.length);
        selectedPayers.forEach((person, idx) => {
          amountsByParticipant[person.id] = shares[idx] ?? 0;
        });
      }

      const allocated = Object.values(amountsByParticipant).reduce(
        (sum, value) => sum + value,
        0,
      );

      return {
        itemIndex,
        item,
        splitMode,
        itemTotal,
        selectedPayers,
        amountsByParticipant,
        allocated,
        isAssigned: selectedPayers.length > 0,
        percentagesByParticipant,
        percentageTotal,
      };
    });
  }, [billItems, itemPayers, participants, itemSplitModes, itemPercentages]);

  const participantBreakdown = useMemo<ParticipantBreakdown[]>(() => {
    return participants.map((person) => {
      const items = itemSplitRows
        .map((row) => ({
          itemName: row.item.name || `Item ${row.itemIndex + 1}`,
          amount: row.amountsByParticipant[person.id] ?? 0,
        }))
        .filter((entry) => entry.amount !== 0);

      const total = items.reduce((sum, entry) => sum + entry.amount, 0);
      return {
        id: person.id,
        name: person.name,
        total,
        items,
      };
    });
  }, [itemSplitRows, participants]);

  const allocatedGrandTotal = useMemo(
    () => participantBreakdown.reduce((sum, person) => sum + person.total, 0),
    [participantBreakdown],
  );
  const unassignedCount = useMemo(
    () => itemSplitRows.filter((row) => !row.isAssigned).length,
    [itemSplitRows],
  );
  const remainingDiff = useMemo(
    () => roundCurrency(billTotal - allocatedGrandTotal),
    [allocatedGrandTotal, billTotal],
  );

  const splitResultData = useMemo<SplitResultData>(
    () => ({
      participants: participantBreakdown.map((person) => ({
        id: person.id,
        name: person.name,
        total: roundCurrency(person.total),
        items: person.items.map((item) => ({
          itemName: item.itemName,
          amount: roundCurrency(item.amount),
        })),
      })),
      billTotal: roundCurrency(billTotal),
      allocatedGrandTotal: roundCurrency(allocatedGrandTotal),
      remainingDiff: roundCurrency(remainingDiff),
      unassignedCount,
      currencyCode: normalizeCurrencyCode(currencyCode),
      updatedAt: new Date().toISOString(),
    }),
    [
      participantBreakdown,
      billTotal,
      allocatedGrandTotal,
      remainingDiff,
      unassignedCount,
      currencyCode,
    ],
  );

  return {
    itemSplitRows,
    participantBreakdown,
    allocatedGrandTotal,
    unassignedCount,
    remainingDiff,
    splitResultData,
  };
}
