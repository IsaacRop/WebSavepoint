"use client";

import { useEffect, useMemo, useState } from "react";
import { useLibrary } from "@/hooks/useLibrary";
import type { GameLog } from "@/types";
import { Button } from "@/components/ui/Button";
import { GameCardList } from "@/components/library/GameCardList";
import { GameCardGrid } from "@/components/library/GameCardGrid";
import { LogGameModal } from "@/components/library/LogGameModal";
import { DeleteLogModal } from "@/components/library/DeleteLogModal";

type StatusFilter = GameLog["status"] | "all";
type ViewMode = "list" | "grid";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "TODOS" },
  { key: "playing", label: "JOGANDO" },
  { key: "completed", label: "FINALIZADO" },
  { key: "dropped", label: "ABANDONADO" },
  { key: "want_to_play", label: "QUERO JOGAR" },
];

const VIEW_KEY = "savepoint_library_view";

export default function LibraryPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Sync com localStorage só no cliente, após hidratação
  useEffect(() => {
    const stored = localStorage.getItem(VIEW_KEY) as ViewMode | null;
    if (stored === "grid") setViewMode("grid");
  }, []);
  const [search, setSearch] = useState("");
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<GameLog | null>(null);
  const [deletingLog, setDeletingLog] = useState<GameLog | null>(null);

  const { logs, next, isLoading, error, loadMore, addLog, updateLog, deleteLog } =
    useLibrary(statusFilter);

  const filtered = useMemo(() => {
    if (!search.trim()) return logs;
    const q = search.toLowerCase();
    return logs.filter((l) => l.game.title.toLowerCase().includes(q));
  }, [logs, search]);

  function setView(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem(VIEW_KEY, mode);
  }

  function openEdit(log: GameLog) {
    setEditingLog(log);
    setLogModalOpen(true);
  }

  function closeModal() {
    setLogModalOpen(false);
    setEditingLog(null);
  }

  if (error) {
    return (
      <div className="max-w-[1360px] mx-auto px-6 py-16 font-mono text-xs text-terra uppercase">
        {error}
      </div>
    );
  }

  const isEmpty = !isLoading && filtered.length === 0;

  return (
    <div className="max-w-[1360px] mx-auto px-6 py-10">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-sans text-3xl font-medium text-ink">Biblioteca</h1>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-50 mt-1">
            {isLoading ? "Carregando..." : `${logs.length} jogos registrados`}
          </p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setLogModalOpen(true)}>
          + Registrar Partida
        </Button>
      </div>

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        {/* Status tabs */}
        <div className="flex items-center gap-0 border-b border-ink-10 flex-1 overflow-x-auto">
          {STATUS_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={[
                "font-mono text-[11px] uppercase tracking-widest px-4 py-2.5 whitespace-nowrap transition-colors duration-[120ms] flex-shrink-0",
                statusFilter === key
                  ? "text-ink border-b-2 border-terra"
                  : "text-ink-50 hover:text-ink",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setView("list")}
            className={`p-2 transition-colors duration-[120ms] ${viewMode === "list" ? "text-ink" : "text-ink-50 hover:text-ink"}`}
            aria-label="Visualização lista"
          >
            <ListIcon />
          </button>
          <button
            onClick={() => setView("grid")}
            className={`p-2 transition-colors duration-[120ms] ${viewMode === "grid" ? "text-ink" : "text-ink-50 hover:text-ink"}`}
            aria-label="Visualização grade"
          >
            <GridIcon />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrar por nome..."
          className="w-full max-w-sm font-sans text-sm text-ink bg-transparent border border-ink-10 px-4 py-2.5 focus:outline-none focus:border-ink transition-colors duration-[120ms] placeholder:text-ink-10"
        />
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <FlagIcon />
          <div>
            <p className="font-sans text-lg font-medium text-ink">
              Nenhum save por aqui — ainda.
            </p>
            <p className="font-sans text-sm text-ink-50 mt-1">
              Registra a primeira partida pra começar teu diário.
            </p>
          </div>
          <Button variant="accent" onClick={() => setLogModalOpen(true)}>
            + Registrar Partida
          </Button>
        </div>
      )}

      {/* List view */}
      {!isEmpty && viewMode === "list" && (
        <div className="max-w-2xl">
          {filtered.map((log) => (
            <GameCardList key={log.id} log={log} />
          ))}
        </div>
      )}

      {/* Grid view */}
      {!isEmpty && viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((log) => (
            <GameCardGrid key={log.id} log={log} />
          ))}
        </div>
      )}

      {/* Load more */}
      {next && (
        <div className="mt-8 flex justify-center">
          <Button variant="secondary" onClick={loadMore}>
            Carregar mais
          </Button>
        </div>
      )}

      {/* Log modal */}
      {logModalOpen && (
        <LogGameModal
          existingLog={editingLog ?? undefined}
          onSave={addLog}
          onUpdate={editingLog ? (id, s, d) => updateLog(id, s, d) : undefined}
          onDelete={editingLog ? () => setDeletingLog(editingLog) : undefined}
          onClose={closeModal}
        />
      )}

      {/* Delete confirmation */}
      {deletingLog && (
        <DeleteLogModal
          gameTitle={deletingLog.game.title}
          onConfirm={async () => {
            await deleteLog(deletingLog.id);
            setDeletingLog(null);
            closeModal();
          }}
          onCancel={() => setDeletingLog(null)}
        />
      )}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 4.5h12M3 9h12M3 13.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-ink-10" aria-hidden>
      <path d="M4 3v18M4 3h12l-3 5.25L16 13H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
