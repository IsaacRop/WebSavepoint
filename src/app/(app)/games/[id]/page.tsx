export default function GamePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8 font-mono text-ink">
      Jogo {params.id} — em breve
    </div>
  );
}
