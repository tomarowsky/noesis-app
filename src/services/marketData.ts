/**
 * Données de marché — mix temps réel (APIs gratuites ou clé) et indicatif.
 *
 * Sans clé :
 * - CoinGecko : Bitcoin, Ethereum
 * - Frankfurter : EUR/USD
 *
 * Avec clé Alpha Vantage (VITE_ALPHAVANTAGE_API_KEY) :
 * - Indices : S&P 500, NASDAQ, CAC 40 (GLOBAL_QUOTE)
 * - Optionnel : or, pétrole Brent si besoin (commodities)
 *
 * Sans clé ni API : les autres widgets restent indicatifs (valeurs d'exemple).
 */

export interface RealtimeQuote {
  value: string | number;
  change?: number;
  context: string;
  source: string;
  sourceUrl?: string;
  isRealtime: true;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const FRANKFURTER_API = 'https://api.frankfurter.app';
const ALPHAVANTAGE_API = 'https://www.alphavantage.co/query';

function getAlphaVantageKey(): string {
  return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ALPHAVANTAGE_API_KEY) || '';
}

/** Bitcoin & Ethereum — CoinGecko (temps réel, sans clé) */
export async function fetchCryptoPrices(): Promise<{
  bitcoin?: RealtimeQuote;
  ethereum?: RealtimeQuote;
}> {
  try {
    const res = await fetch(
      `${COINGECKO_API}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true`
    );
    if (!res.ok) throw new Error('CoinGecko error');
    const data = await res.json();
    const result: { bitcoin?: RealtimeQuote; ethereum?: RealtimeQuote } = {};
    if (data.bitcoin) {
      result.bitcoin = {
        value: Number(data.bitcoin.usd),
        change: data.bitcoin.usd_24h_change != null ? Number(data.bitcoin.usd_24h_change) : undefined,
        context: 'BTC/USD',
        source: 'CoinGecko',
        sourceUrl: 'https://www.coingecko.com',
        isRealtime: true,
      };
    }
    if (data.ethereum) {
      result.ethereum = {
        value: Number(data.ethereum.usd),
        change: data.ethereum.usd_24h_change != null ? Number(data.ethereum.usd_24h_change) : undefined,
        context: 'ETH/USD',
        source: 'CoinGecko',
        sourceUrl: 'https://www.coingecko.com',
        isRealtime: true,
      };
    }
    return result;
  } catch (e) {
    console.warn('marketData: CoinGecko fetch failed', e);
    return {};
  }
}

/** EUR/USD — Frankfurter (sans clé) */
export async function fetchEurUsd(): Promise<RealtimeQuote | null> {
  try {
    const res = await fetch(`${FRANKFURTER_API}/latest?from=EUR&to=USD`);
    if (!res.ok) throw new Error('Frankfurter error');
    const data = await res.json();
    const rate = data.rates?.USD;
    if (rate == null) return null;
    return {
      value: Number(rate),
      context: 'Taux de change (référence BCE)',
      source: 'Frankfurter (BCE)',
      sourceUrl: 'https://www.frankfurter.app',
      isRealtime: true,
    };
  } catch (e) {
    console.warn('marketData: Frankfurter fetch failed', e);
    return null;
  }
}

/** Symboles Alpha Vantage pour indices (GLOBAL_QUOTE : 1 symbole par requête). Essayer ^GSPC, ^IXIC, ^FCHI (Yahoo) ou SPX, IXIC, FCHI selon l’API. */
const ALPHAVANTAGE_INDEX_SYMBOLS: Record<string, { symbols: string[]; context: string; sourceLabel: string }> = {
  sp500: { symbols: ['.INX', 'SPX', '^GSPC'], context: 'Indice boursier américain', sourceLabel: 'Alpha Vantage' },
  nasdaq: { symbols: ['IXIC', '^IXIC'], context: 'Indice tech américain', sourceLabel: 'Alpha Vantage' },
  cac40: { symbols: ['FCHI', '^FCHI'], context: 'Indice boursier français', sourceLabel: 'Alpha Vantage' },
};

/** Alpha Vantage GLOBAL_QUOTE — prix et variation (indices). Essaie plusieurs symboles si besoin. */
export async function fetchAlphaVantageGlobalQuote(
  widgetId: string
): Promise<RealtimeQuote | null> {
  const key = getAlphaVantageKey();
  if (!key) return null;
  const meta = ALPHAVANTAGE_INDEX_SYMBOLS[widgetId];
  if (!meta) return null;
  for (const symbol of meta.symbols) {
    try {
      const url = `${ALPHAVANTAGE_API}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(key)}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const quote = data['Global Quote'];
      if (!quote || typeof quote !== 'object') continue;
      const priceStr = quote['05. price'];
      const changeStr = quote['09. change'];
      const changePercentStr = quote['10. change percent'];
      const price = priceStr != null ? parseFloat(String(priceStr).replace(/,/g, '.')) : NaN;
      if (Number.isNaN(price) || price <= 0) continue;
      let change: number | undefined;
      if (changePercentStr != null) {
        const pct = parseFloat(String(changePercentStr).replace(/,/g, '.').replace('%', ''));
        if (!Number.isNaN(pct)) change = pct;
      }
      if (change === undefined && changeStr != null) {
        const ch = parseFloat(String(changeStr).replace(/,/g, '.'));
        if (!Number.isNaN(ch)) change = (ch / (price - ch)) * 100;
      }
      return {
        value: price,
        change,
        context: meta.context,
        source: meta.sourceLabel,
        sourceUrl: 'https://www.alphavantage.co',
        isRealtime: true,
      };
    } catch {
      continue;
    }
  }
  return null;
}

/** Récupère les données temps réel pour un widget par son id */
export async function fetchRealtimeForWidget(
  widgetId: string
): Promise<RealtimeQuote | null> {
  if (widgetId === 'bitcoin' || widgetId === 'ethereum') {
    const crypto = await fetchCryptoPrices();
    return widgetId === 'bitcoin' ? crypto.bitcoin ?? null : crypto.ethereum ?? null;
  }
  if (widgetId === 'eurusd') {
    return fetchEurUsd();
  }
  if (widgetId === 'sp500' || widgetId === 'nasdaq' || widgetId === 'cac40') {
    return fetchAlphaVantageGlobalQuote(widgetId);
  }
  return null;
}

/** Widgets qui peuvent être alimentés en temps réel (avec ou sans clé selon le type) */
export const REALTIME_WIDGET_IDS = [
  'bitcoin',
  'ethereum',
  'eurusd',
  'sp500',
  'nasdaq',
  'cac40',
];

/** True si une clé Alpha Vantage est configurée (indices activés) */
export function hasAlphaVantageKey(): boolean {
  return !!getAlphaVantageKey();
}
