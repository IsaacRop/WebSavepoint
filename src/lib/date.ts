export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "AGORA";
  if (minutes < 60) return `HÁ ${minutes} MIN`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `HÁ ${hours}H`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `HÁ ${days} ${days === 1 ? "DIA" : "DIAS"}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `HÁ ${months} ${months === 1 ? "MÊS" : "MESES"}`;
  return `HÁ ${Math.floor(months / 12)} ANOS`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
