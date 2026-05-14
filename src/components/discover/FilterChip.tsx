interface Props {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterChip({ label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={[
        "font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 border transition-colors duration-[120ms]",
        active
          ? "bg-ink text-paper-50 border-ink"
          : "bg-transparent text-ink-50 border-ink-10 hover:bg-paper-200 hover:text-ink hover:border-ink-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
