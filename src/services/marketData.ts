/**
 * Données de marché réelles — APIs publiques sans clé.
 * CoinGecko (crypto), Frankfurter (forex BCE).
 * Les autres widgets restent indicatifs avec source claire.
 */

export interface RealtimeQuote {
  value: string;
  change?: number;
  context: string;
  source: string;
  sourceUrl?: string;
  isRealtime: true;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const FRANKFURTER_API = 'https://api.frankfurter.app';

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
        value: `$${Number(data.bitcoin.usd).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
        change: data.bitcoin.usd_24h_change != null ? Number(data.bitcoin.usd_24h_change) : undefined,
        context: 'BTC/USD',
        source: 'CoinGecko',
        sourceUrl: 'https://www.coingecko.com',
        isRealtime: true,
      };
    }
    if (data.ethereum) {
      result.ethereum = {
        value: `$${Number(data.ethereum.usd).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
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

/** EUR/USD — Frankfurter (taux de référence BCE, sans clé) */
export async function fetchEurUsd(): Promise<RealtimeQuote | null> {
  try {
    const res = await fetch(`${FRANKFURTER_API}/latest?from=EUR&to=USD`);
    if (!res.ok) throw new Error('Frankfurter error');
    const data = await res.json();
    const rate = data.rates?.USD;
    if (rate == null) return null;
    return {
      value: Number(rate).toFixed(4),
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

/** Récupère les données temps réel pour un widget par son id applicatif */
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
  return null;
}

/** Liste des ids de widgets alimentés en temps réel */
export const REALTIME_WIDGET_IDS = ['bitcoin', 'ethereum', 'eurusd'];
