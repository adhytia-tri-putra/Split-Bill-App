const QUICK_TIPS = [
  "Pastikan foto terang dan tidak blur.",
  "Ambil gambar full struk, jangan terpotong.",
  "Setelah scan, cek item sebelum split biaya.",
];

export default function QuickTips() {
  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-5">
      <h3 className="text-lg font-semibold text-[#11134a]">Quick Tips</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {QUICK_TIPS.map((tip) => (
          <div
            key={tip}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm">
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}

