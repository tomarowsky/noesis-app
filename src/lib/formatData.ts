/**
 * Format unifié des données — comme sur les sites boursiers (Boursorama, etc.)
 * Convention française : espace = milliers, virgule = décimales, unité à la fin (Pts, $, %).
 */

export type ValueFormat =
  | 'index'      // Indices boursiers : "23 461,82 Pts"
  | 'currency_usd'  // USD : "5 234,87 $" ou "76 569 $"
  | 'forex'      // Forex : "1,0845"
  | 'percent'    // Pourcentages : "3,2 %"
  | 'number'     // Nombre simple : "8,1" ou "114"
  | 'temperature' // "+1,18 °C"
  | 'ratio'      // "6,3/10"
  | 'raw';      // Affichage tel quel (ex. "CONFIDENTIEL", "???")

/** Extrait un nombre à partir d'une chaîne (ex. "$5,234.87" → 5234.87) ou d'un nombre */
export function parseNumericValue(value: string | number): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value !== 'string') return 0;
  const cleaned = value
    .replace(/\s/g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

/** Nombre au format français : espace milliers, virgule décimales */
function frenchNumber(n: number, decimals: number): string {
  const fixed = n.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return decPart ? `${withSpaces},${decPart}` : withSpaces;
}

/** Indice boursier — ex. 23461.82 → "23 461,82 Pts" */
export function formatIndex(value: string | number): string {
  const n = parseNumericValue(value);
  return `${frenchNumber(n, 2)} Pts`;
}

/** Devise USD — ex. 5234.87 → "5 234,87 $", 76569 → "76 569 $" */
export function formatCurrencyUsd(value: string | number, decimals?: number): string {
  const n = parseNumericValue(value);
  const d = decimals ?? (n >= 1000 ? 0 : 2);
  return `${frenchNumber(n, d)} $`;
}

/** Forex — ex. 1.0845 → "1,0845" (4 décimales) */
export function formatForex(value: string | number): string {
  const n = parseNumericValue(value);
  return frenchNumber(n, 4);
}

/** Pourcentage — ex. 3.2 → "3,2 %" */
export function formatPercent(value: string | number, decimals: number = 1): string {
  const n = parseNumericValue(value);
  return `${frenchNumber(n, decimals)} %`;
}

/** Nombre simple (optionnel décimales) */
export function formatNumber(value: string | number, decimals: number = 0): string {
  const n = parseNumericValue(value);
  return frenchNumber(n, decimals);
}

/** Température — ex. 1.18 → "+1,18 °C" */
export function formatTemperature(value: string | number): string {
  const n = parseNumericValue(value);
  const sign = n >= 0 ? '+' : '';
  return `${sign}${frenchNumber(n, 2)} °C`;
}

/** Ratio / score — ex. 6.3 → "6,3/10" */
export function formatRatio(value: string | number, max: number = 10): string {
  const n = parseNumericValue(value);
  return `${frenchNumber(n, 1)}/${max}`;
}

export interface FormatOptions {
  decimals?: number;
  ratioMax?: number;
}

/** Point d'entrée : formate selon le type de donnée (comme sur les sites boursiers) */
export function formatValue(
  value: string | number,
  format: ValueFormat,
  options?: FormatOptions
): string {
  switch (format) {
    case 'index':
      return formatIndex(value);
    case 'currency_usd':
      return formatCurrencyUsd(value, options?.decimals);
    case 'forex':
      return formatForex(value);
    case 'percent':
      return formatPercent(value, options?.decimals ?? 1);
    case 'temperature':
      return formatTemperature(value);
    case 'ratio':
      return formatRatio(value, options?.ratioMax ?? 10);
    case 'raw':
      return typeof value === 'string' ? value : String(value);
    case 'number':
    default:
      return formatNumber(value, options?.decimals ?? 0);
  }
}
