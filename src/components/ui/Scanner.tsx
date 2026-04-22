"use client";

import React, { useRef } from "react";
import { useOCR } from "@/hooks/useOCR";

interface ScannerProps {
  onScanComplete: (text: string) => void;
}

export default function Scanner({ onScanComplete }: ScannerProps) {
  const { extractText, isProcessing, progress } = useOCR();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await extractText(file);
      onScanComplete(text);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <label className="flex flex-col items-center justify-centeer w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
            {isProcessing
              ? `Memproses: ${progress}%`
              : "Klik atau drag foto struk di sini"}
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </label>

      {isProcessing && (
        <div className="w-full bg-zinc-200 rounded-full h-2.5 dark:bg-zinc-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
}
