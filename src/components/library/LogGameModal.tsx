"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { Game, GameLog } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type LogStatus = GameLog["status"];

const STATUS_OPTIONS: { value: LogStatus; label: string }[] = [
  { value: "completed", label: "Finalizado" },
  { value: "playing", label: "Jogando" },
  { value: "dropped", label: "Abandonado" },
  { value: "want_to_play", label: "Quero Jogar" },
];

interface Props {
  existingLog?: GameLog;
  initialGame?: Game;
  onSave: (gameId: string, status: LogStatus, playedDate?: string) => Promise<unknown>;
  onUpdate?: (logId: string, status: LogStatus, playedDate?: string) => Promise<unknown>;
  onDelete?: () => void;
  onClose: () => void;
}

export function LogGameModal({ existingLog, initialGame, onSave, onUpdate, onDelete, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isEditing = Boolean(existingLog);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(initialGame ?? null);
  const [isSearching, setIsSearching] = useState(false);

  const [status, setStatus] = useState<LogStatus>(existingLog?.status ?? "completed");
  const [playedDate, setPlayedDate] = useState(existingLog?.played_date ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!isEditing) searchRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.length < 2) { setSearchResults([]); return; }

    timerRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.get<Game[]>(`/api/games/search/?q=${encodeURIComponent(query)}`);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  async function handleSubmit() {
    if (!isEditing && !selectedGame) {
      setError("Selecione um jogo.");
      return;
    }
    setError("");
    setIsSaving(true);
    try {
      if (isEditing && existingLog && onUpdate) {
        await onUpdate(existingLog.id, status, playedDate || undefined);
      } else if (selectedGame) {
        await onSave(selectedGame.id, status, playedDate || undefined);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-paper-50 border border-ink-10 shadow-modal w-full max-w-md p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-50 mb-1">
            {isEditing ? "Atualizar Save" : "Nova Sessão"}
          </p>
          <h2 className="font-sans text-2xl font-medium italic text-ink">
            {isEditing
              ? existingLog?.game.title
              : "Como foi a partida?"}
          </h2>
        </div>

        {/* Busca de jogo — só no modo criação */}
        {!isEditing && (
          <div className="relative flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-widest text-ink-50">
              Jogo
            </label>
            {selectedGame ? (
              <div className="flex items-center gap-3 bg-paper-100 border border-ink-10 p-3">
                {selectedGame.cover_url ? (
                  <img src={selectedGame.cover_url} alt={selectedGame.title} className="w-10 h-14 object-cover" />
                ) : (
                  <div className="w-10 h-14 bg-paper-200" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-medium text-ink">{selectedGame.title}</p>
                  {selectedGame.release_year && (
                    <p className="font-mono text-[10px] text-ink-50">{selectedGame.release_year}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedGame(null); setQuery(""); }}
                  className="font-mono text-[10px] text-terra uppercase tracking-widest"
                >
                  Trocar
                </button>
              </div>
            ) : (
              <>
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar jogo..."
                  className="font-sans text-sm text-ink bg-transparent border border-ink-10 px-4 py-3 focus:outline-none focus:border-ink transition-colors duration-[120ms] placeholder:text-ink-10"
                />
                {(searchResults.length > 0 || isSearching) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-paper-100 border border-ink-10 shadow-card z-10 max-h-48 overflow-y-auto">
                    {isSearching && (
                      <p className="px-4 py-3 font-mono text-xs text-ink-50">Buscando...</p>
                    )}
                    {searchResults.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => { setSelectedGame(g); setQuery(""); setSearchResults([]); }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-paper-200 transition-colors text-left"
                      >
                        {g.cover_url ? (
                          <img src={g.cover_url} alt={g.title} className="w-8 h-10 object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-10 bg-paper-200 flex-shrink-0" />
                        )}
                        <span className="font-sans text-sm text-ink truncate">{g.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Status */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-50">Status</span>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={[
                  "font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 border transition-colors duration-[120ms]",
                  status === opt.value
                    ? "bg-ink text-paper-50 border-ink"
                    : "bg-transparent text-ink-50 border-ink-10 hover:border-ink hover:text-ink",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Data */}
        <Input
          label="Data (opcional)"
          type="date"
          value={playedDate}
          onChange={(e) => setPlayedDate(e.target.value)}
        />

        {error && <p className="font-mono text-[12px] text-terra">{error}</p>}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button variant="accent" onClick={handleSubmit} disabled={isSaving} className="flex-1">
            {isSaving ? "Salvando..." : isEditing ? "Atualizar" : "Registrar"}
          </Button>
        </div>

        {isEditing && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="font-mono text-[11px] uppercase tracking-widest text-terra text-center hover:underline"
          >
            Apagar save
          </button>
        )}
      </div>
    </div>
  );
}
