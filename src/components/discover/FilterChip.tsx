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
          ? "bg-ink dark:bg-paper-100 text-paper-50 dark:text-night-900 border-ink dark:border-paper-100"
          : "bg-transparent text-ink-50 border-ink-10 dark:border-night-600 hover:bg-paper-200 dark:hover:bg-night-700 hover:text-ink dark:hover:text-paper-100 hover:border-ink-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
