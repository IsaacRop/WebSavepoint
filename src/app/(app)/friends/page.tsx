export default function FriendsPage() {
  return (
    <div className="max-w-[1360px] mx-auto px-6 py-24 flex flex-col items-center justify-center gap-6 text-center">
      <PeopleIcon />
      <div>
        <h1 className="font-sans text-2xl font-medium text-ink dark:text-paper-100">Amigos</h1>
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-50 mt-2">
          Em breve
        </p>
      </div>
      <p className="font-sans text-sm text-ink-50 max-w-xs">
        A área social do SavePoint está a caminho — seguir amigos, ver o que estão jogando e comparar bibliotecas.
      </p>
    </div>
  );
}

function PeopleIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-ink-10" aria-hidden>
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 20c0-2.761-1.791-5-4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
