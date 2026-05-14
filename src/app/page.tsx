import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen bg-paper-50 px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="font-mono text-sm tracking-[0.25em] text-ink-50 uppercase">
          SavePoint · Est. 2026
        </p>
        <h1 className="font-sans text-5xl font-medium text-ink leading-tight">
          Save, rate, replay.
        </h1>
        <div className="flex gap-4 mt-4">
          <Link
            href="/login"
            className="font-mono uppercase tracking-widest text-sm px-5 py-2.5 bg-transparent text-ink border border-ink transition-all duration-[200ms] hover:bg-ink/5"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="font-mono uppercase tracking-widest text-sm px-5 py-2.5 bg-terra text-paper-50 border border-terra transition-all duration-[200ms] hover:bg-terra-dark"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}
