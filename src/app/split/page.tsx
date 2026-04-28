"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ItemSplitSection from "@/components/split/ItemSplitSection";
import ParticipantSection from "@/components/split/ParticipantSection";
import SplitBottomBar from "@/components/split/SplitBottomBar";
import SplitHeroSection from "@/components/split/SplitHeroSection";
import SplitSummarySection from "@/components/split/SplitSummarySection";
import SplitbillHeader from "@/components/ui/SplitbillHeader";
import { useSplitComputation } from "@/hooks/useSplitComputation";
import { useSplitEditor } from "@/hooks/useSplitEditor";
import { SPLIT_CONFIRMED_STORAGE_KEY, SPLIT_RESULT_STORAGE_KEY } from "@/lib/bill";

export default function SplitPage() {
  const router = useRouter();
  const {
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
  } = useSplitEditor();

  const handleConfirmSplit = () => {
    localStorage.setItem(SPLIT_CONFIRMED_STORAGE_KEY, "true");
    router.push("/verify");
  };

  const {
    itemSplitRows,
    participantBreakdown,
    unassignedCount,
    remainingDiff,
    splitResultData,
  } = useSplitComputation({
    billItems,
    billTotal,
    participants,
    itemPayers,
    currencyCode,
  });

  useEffect(() => {
    if (!billData) {
      return;
    }

    localStorage.setItem(
      SPLIT_RESULT_STORAGE_KEY,
      JSON.stringify(splitResultData),
    );
  }, [billData, splitResultData]);

  if (!billData) return null;

  return (
    <div className="min-h-screen bg-[#f3f5f9] text-zinc-900">
      <SplitbillHeader backHref="/scan" />

      <main className="mx-auto w-full max-w-[1200px] space-y-4 px-3 pb-24 pt-6 sm:space-y-5 sm:px-6 sm:pb-16 sm:pt-10">
        <SplitHeroSection
          currencyCode={currencyCode}
          isConvertingCurrency={isConvertingCurrency}
          currencyError={currencyError}
          onCurrencyChange={handleCurrencyChange}
        />

        <ParticipantSection
          participants={participants}
          onAddParticipant={addParticipant}
          onUpdateParticipantName={updateParticipantName}
          onRemoveParticipant={removeParticipant}
        />

        <ItemSplitSection
          itemSplitRows={itemSplitRows}
          participants={participants}
          itemPayers={itemPayers}
          editingItemIndex={editingItemIndex}
          onUpdateBillItemField={updateBillItemField}
          onRemoveBillItem={removeBillItem}
          onTogglePayerForItem={togglePayerForItem}
          onSetAllPayersForItem={setAllPayersForItem}
          onSetEditingItemIndex={setEditingItemIndex}
          onAddBillItem={addBillItem}
          formatAmount={formatAmount}
        />

        <SplitSummarySection
          participantBreakdown={participantBreakdown}
          formatAmount={formatAmount}
        />

        <SplitBottomBar
          billTotal={billTotal}
          unassignedCount={unassignedCount}
          remainingDiff={remainingDiff}
          formatAmount={formatAmount}
          onConfirm={handleConfirmSplit}
        />
      </main>
    </div>
  );
}
