"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { SearchBar } from "./SearchBar";
import { UserDropdown } from "./UserDropdown";

const NAV_LINKS = [
  { label: "DIÁRIO", href: "/feed" },
  { label: "BIBLIOTECA", href: "/library" },
  { label: "AMIGOS", href: "/friends" },
  { label: "DESCOBRIR", href: "/games" },
];

function Avatar({ username, avatar }: { username: string; avatar: string | null }) {
  const initials = username.slice(0, 2).toUpperCase();
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={username}
        className="w-8 h-8 rounded-full object-cover border border-ink-10"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-terra flex items-center justify-center flex-shrink-0">
      <span className="font-mono text-[11px] font-medium text-paper-50">{initials}</span>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-paper-50 dark:bg-night-900 border-b border-ink-10 dark:border-night-600">
      <div className="max-w-[1360px] mx-auto px-6 h-14 flex items-center gap-8">
        {/* Logo */}
        <Link
          href="/feed"
          className="font-sans font-medium text-ink dark:text-paper-100 text-base tracking-tight flex-shrink-0 flex items-center gap-2"
        >
          <FlagIcon />
          savepoint
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "font-mono text-[11px] uppercase tracking-widest transition-colors duration-[120ms]",
                  active
                    ? "text-ink dark:text-paper-100 border-b border-terra pb-[1px]"
                    : "text-ink-50 hover:text-ink dark:hover:text-paper-100",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="text-ink-50 hover:text-ink dark:hover:text-paper-100 transition-colors duration-[120ms]"
            aria-label={theme === "dark" ? "Modo claro" : "Modo escuro"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Search */}
          {searchOpen ? (
            <SearchBar onClose={() => setSearchOpen(false)} />
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-ink-50 hover:text-ink dark:hover:text-paper-100 transition-colors duration-[120ms]"
              aria-label="Buscar"
            >
              <SearchIcon />
            </button>
          )}

          {/* Avatar + dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="Menu do usuário"
              >
                <Avatar username={user.username} avatar={user.avatar} />
              </button>
              {dropdownOpen && (
                <UserDropdown onClose={() => setDropdownOpen(false)} />
              )}
            </div>
          )}

          {/* Hamburger — mobile */}
          <button
            className="md:hidden text-ink-50 hover:text-ink dark:hover:text-paper-100 transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <HamburgerIcon />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-paper-50 dark:bg-night-900 border-t border-ink-10 dark:border-night-600 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono text-xs uppercase tracking-widest text-ink-70 dark:text-paper-400"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function FlagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 2v12M3 2h8l-2 3.5L11 9H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M15 10.5A6 6 0 0 1 7.5 3a6 6 0 1 0 7.5 7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.22 3.22l1.41 1.41M13.36 13.36l1.41 1.41M3.22 14.78l1.41-1.41M13.36 4.64l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
