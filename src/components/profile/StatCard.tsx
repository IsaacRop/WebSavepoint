interface Props {
  label: string;
  value: number | string;
  sub?: string;
}

export function StatCard({ label, value, sub }: Props) {
  return (
    <div className="bg-paper-100 dark:bg-night-800 border border-ink-10 dark:border-night-600 p-6 flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-50">
        {label}
      </span>
      <span className="font-sans text-4xl font-medium text-ink dark:text-paper-100 leading-none">
        {value}
      </span>
      {sub && (
        <span className="font-mono text-[10px] text-ink-50 mt-1">{sub}</span>
      )}
    </div>
  );
}
