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
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <label className="group relative flex h-60 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/80 px-6 text-center transition hover:border-[#0c0956]/35 hover:bg-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0c0956] shadow-sm ring-1 ring-zinc-200 transition group-hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6">
            <path d="M12 3a1 1 0 0 1 .7.29l3 3a1 1 0 0 1 .3.71V9h2a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a2 2 0 0 1 2-2h2V7a1 1 0 0 1 .29-.7l3-3A1 1 0 0 1 12 3Zm-2 6h4V7.41L12 5.41 10 7.4V9Zm2 2a1 1 0 0 1 1 1v3.59l1.3-1.3a1 1 0 1 1 1.4 1.42l-3 2.99a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.41l1.3 1.3V12a1 1 0 0 1 1-1Z" />
          </svg>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="mb-1 text-base font-medium text-zinc-800">
            {isProcessing
              ? `Memproses: ${progress}%`
              : "Klik atau drag foto struk di sini"}
          </p>
          <p className="text-sm text-zinc-500">Format: JPG, PNG, WEBP • Maks 10MB</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </label>

      {isProcessing ? (
        <div className="w-full rounded-full bg-zinc-200 h-2.5">
          <div
            className="h-2.5 rounded-full bg-[#0c0956] transition-all"
            style={{ width: `${progress}%` }}></div>
        </div>
      ) : null}
    </div>
  );
}
