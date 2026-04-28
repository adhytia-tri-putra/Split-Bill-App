"use client";

import { useMemo, useState } from "react";

interface ShareButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export default function ShareButton({
  text,
  className = "",
  label = "Share",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappUrl = useMemo(() => {
    const encoded = encodeURIComponent(text);
    return `https://wa.me/?text=${encoded}`;
  }, [text]);

  const telegramUrl = useMemo(() => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(
      typeof window !== "undefined" ? window.location.href : "",
    );
    return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
  }, [text]);

  const handleShareTo = (channel: "whatsapp" | "telegram") => {
    const targetUrl = channel === "whatsapp" ? whatsappUrl : telegramUrl;
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          className ||
          "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0c0956] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#0a084b]"
        }>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true">
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2h11A2.5 2.5 0 0 1 20 4.5v15a2.5 2.5 0 0 1-2.5 2h-11A2.5 2.5 0 0 1 4 19.5v-15Zm2.75.5a.75.75 0 0 0-.75.75v11.379l2.513-2.01a2.5 2.5 0 0 1 1.562-.55h7.175a.75.75 0 0 0 .75-.75V5.75a.75.75 0 0 0-.75-.75h-10.5Z" />
        </svg>
        <span>{label}</span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/45 p-4"
          onClick={() => setIsOpen(false)}>
          <div
            className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}>
            <h3 className="text-lg font-semibold text-zinc-900">
              Pilih Channel Share
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Kirim ringkasan split bill lewat aplikasi yang kamu pilih.
            </p>

            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => handleShareTo("whatsapp")}
                className="w-full rounded-xl bg-[#16a34a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15803d]">
                Kirim via WhatsApp
              </button>

              <button
                type="button"
                onClick={() => handleShareTo("telegram")}
                className="w-full rounded-xl bg-[#229ed9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d8dc2]">
                Kirim via Telegram
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
              Batal
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
