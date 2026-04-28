import Link from "next/link";

interface SplitbillHeaderProps {
  backHref?: string;
  showBackButton?: boolean;
}

export default function SplitbillHeader({
  backHref = "/scan",
  showBackButton = true,
}: SplitbillHeaderProps) {
  return (
    <header className="h-20 border-b border-zinc-200 bg-[#ffffff]">
      <div className="mx-auto flex h-full w-full max-w-[1180px] items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {showBackButton ? (
            <Link
              href={backHref}
              className="rounded-full p-2 text-[#0a0d45] hover:bg-zinc-200/70"
              aria-label="Kembali">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                stroke="currentColor"
                strokeWidth="2.2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 18 9 12l6-6"
                />
              </svg>
            </Link>
          ) : null}
          <h1 className="text-3xl font-semibold leading-none tracking-tight text-[#11134a] sm:text-4xl">
            Split Bill Calculator
          </h1>
        </div>

        <div className="flex items-center gap-4 text-[#11134a]">
          <button
            type="button"
            className="rounded-full p-2 hover:bg-zinc-200/70"
            aria-label="Notifikasi">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6">
              <path d="M12 3a6 6 0 0 0-6 6v3.71l-.83 1.66A1 1 0 0 0 6.08 16h11.84a1 1 0 0 0 .9-1.45L18 12.71V9a6 6 0 0 0-6-6Zm0 19a3 3 0 0 0 2.82-2H9.18A3 3 0 0 0 12 22Z" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-full p-2 hover:bg-zinc-200/70"
            aria-label="Profil">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7">
              <path
                fillRule="evenodd"
                d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm0 5a3.5 3.5 0 1 1-3.5 3.5A3.5 3.5 0 0 1 12 7Zm0 13a8 8 0 0 1-5.66-2.34 6 6 0 0 1 11.32 0A8 8 0 0 1 12 20Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
