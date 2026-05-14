export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper-50">
      {/* Navbar — placeholder */}
      <nav className="h-14 border-b border-ink-10 flex items-center px-6 font-mono text-xs tracking-widest text-ink-50 uppercase">
        SavePoint
      </nav>
      <main>{children}</main>
    </div>
  );
}
