type Status = "playing" | "completed" | "dropped" | "want_to_play";

const LABELS: Record<Status, string> = {
  playing: "JOGANDO",
  completed: "FINALIZADO",
  dropped: "ABANDONADO",
  want_to_play: "QUERO JOGAR",
};

const STYLES: Record<Status, string> = {
  playing:
    "text-moss border border-moss bg-transparent",
  completed:
    "text-paper-50 bg-ink border border-ink",
  dropped:
    "text-ink-50 border border-ink-50 bg-transparent",
  want_to_play:
    "text-ink-50 border border-ink-50 bg-transparent",
};

interface Props {
  status: Status;
}

export function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 ${STYLES[status]}`}
    >
      {status === "playing" && (
        <span className="w-1.5 h-1.5 rounded-full bg-moss inline-block" />
      )}
      {LABELS[status]}
    </span>
  );
}
