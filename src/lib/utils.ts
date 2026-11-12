export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Neutraliza caracteres com significado na gramática de filtros do PostgREST
 * antes de interpolar o termo em um padrão `ilike` dentro de `.or()`.
 * A vírgula separa condições e os parênteses agrupam — sem esta limpeza, um
 * termo como `x,is_active.eq.false` injetaria filtros arbitrários na query.
 * `*` é tratado como curinga `%` pelo PostgREST e também é removido.
 */
export function sanitizeSearchTerm(raw: string): string {
  return raw
    .replace(/[,()\\*]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}
