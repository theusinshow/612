// ============================================================
// 612 — Utilitários gerais
// ============================================================

/**
 * Formata valor monetário em BRL.
 * Usa string/Decimal — nunca float puro.
 */
export function formatCurrency(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

/**
 * Formata consumo em kWh.
 */
export function formatKwh(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `${num.toFixed(0)} kWh`;
}

/**
 * Retorna label da competência no formato "Maio/2026".
 */
export function formatCompetencia(mes: number, ano: number): string {
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return `${meses[mes - 1]}/${ano}`;
}

/**
 * Combina classes CSS condicionalmente (sem dependência extra).
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
