import { CHIP_STYLES, getInitials, type Participant } from "./shared";

interface ParticipantSectionProps {
  participants: Participant[];
  onAddParticipant: () => void;
  onUpdateParticipantName: (id: string, name: string) => void;
  onRemoveParticipant: (id: string) => void;
}

export default function ParticipantSection({
  participants,
  onAddParticipant,
  onUpdateParticipantName,
  onRemoveParticipant,
}: ParticipantSectionProps) {
  return (
    <section
      id="rincian-tagihan"
      className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-900">Tim Pembayar</h3>
        <button
          type="button"
          onClick={onAddParticipant}
          className="rounded-full bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d5f58] focus:outline-none focus:ring-2 focus:ring-emerald-300">
          + Tambah Orang
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {participants.map((person, idx) => (
          <span
            key={`chip-${person.id}`}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
              CHIP_STYLES[idx % CHIP_STYLES.length]
            }`}>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/75">
              {getInitials(person.name)}
            </span>
            {person.name}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {participants.map((person) => (
          <div
            key={person.id}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5">
            <input
              type="text"
              value={person.name}
              onChange={(e) =>
                onUpdateParticipantName(person.id, e.target.value)
              }
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
              placeholder="Nama orang"
            />
            <button
              type="button"
              onClick={() => onRemoveParticipant(person.id)}
              disabled={participants.length <= 1}
              className="rounded-md border border-red-300 px-2.5 py-2 text-xs font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-red-50">
              Hapus
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
