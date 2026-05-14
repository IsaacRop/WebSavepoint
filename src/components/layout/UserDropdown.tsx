"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAuth } from "@/providers/AuthProvider";

interface Props {
  onClose: () => void;
}

export function UserDropdown({ onClose }: Props) {
  const { user, logout } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-48 bg-paper-100 border border-ink-10 shadow-hairline z-50"
    >
      <Link
        href={`/profile/${user?.username}`}
        onClick={onClose}
        className="block px-4 py-3 font-mono text-xs uppercase tracking-widest text-ink hover:bg-paper-200 transition-colors duration-[120ms]"
      >
        Ver perfil
      </Link>
      <Link
        href="/settings"
        onClick={onClose}
        className="block px-4 py-3 font-mono text-xs uppercase tracking-widest text-ink hover:bg-paper-200 transition-colors duration-[120ms]"
      >
        Configurações
      </Link>
      <div className="border-t border-ink-10" />
      <button
        onClick={() => { onClose(); logout(); }}
        className="block w-full text-left px-4 py-3 font-mono text-xs uppercase tracking-widest text-terra hover:bg-paper-200 transition-colors duration-[120ms]"
      >
        Sair
      </button>
    </div>
  );
}
