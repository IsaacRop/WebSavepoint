"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

interface Props {
  gameTitle: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteLogModal({ gameTitle, onConfirm, onCancel }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onCancel(); }}
    >
      <div className="bg-paper-50 border border-ink-10 shadow-modal w-full max-w-sm p-8 flex flex-col gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-terra mb-2">
            Apagar este save?
          </p>
          <h2 className="font-sans text-2xl font-medium text-ink">
            {gameTitle}
          </h2>
          <p className="font-sans text-sm text-ink-70 mt-3 leading-relaxed">
            Essa ação é permanente. O jogo sairá da sua biblioteca e o histórico será apagado.
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onCancel} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? "Apagando..." : "Apagar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
