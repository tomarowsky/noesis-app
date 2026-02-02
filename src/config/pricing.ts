/**
 * Configuration tarification freemium NOESIS (Quiz, marchés & culture)
 *
 * Gratuit : APIs standard (CoinGecko, Frankfurter) — crypto + forex temps réel.
 * Indices = indicatifs sauf clé Alpha Vantage ou Pro.
 *
 * Pro (mensuel/annuel) : données temps réel partout, quiz actualité, zéro config.
 * Lifetime : un seul paiement, tout Pro + déblocage instantané de toutes les données,
 * expérience exclusive (thème Membre à vie, fonctionnalités cachées). Accessible via Réglages.
 */

import { BRAND } from './brand';

export const FREE_FEATURES = [
  'Bitcoin, Ethereum, EUR/USD en temps réel (gratuit)',
  'Indices S&P 500, NASDAQ, CAC 40 indicatifs — ou temps réel avec votre clé Alpha Vantage',
  'Quiz illimité : culture G + jusqu\'à 1 question d\'actualité par série',
  'Tous les widgets et catégories (déblocage par niveau)',
  'Thèmes et personnalisation',
  'Succès et défis',
] as const;

export const PRO_FEATURES = [
  'Indices (S&P 500, NASDAQ, CAC 40) en temps réel sans config',
  'Or et pétrole Brent en temps réel',
  'Quiz : 2 à 3 questions d\'actualité par série — restez informé',
  'Aucune clé API à gérer — tout fonctionne out-of-the-box',
  `Soutien direct au développement de ${BRAND.appName}`,
  'Expérience sans compromis : données marchés + actualité',
] as const;

/** Fonctionnalités exclusives Lifetime : récompense immédiate, expérience « incroyable » */
export const LIFETIME_FEATURES = [
  'Tout Pro, pour toujours — un seul paiement',
  'Toutes les données débloquées immédiatement (plus de niveau requis)',
  'Thème exclusif « Membre à vie »',
  'Accès anticipé aux fonctionnalités cachées et futures',
  'Jamais de renouvellement — à vie',
] as const;

export const PRICING = {
  monthly: {
    priceEur: 6.99,
    label: 'Mensuel',
    period: 'mois',
    netEurApprox: { year1: 4.89, year2Plus: 5.94 },
  },
  yearly: {
    priceEur: 49.99,
    label: 'Annuel',
    period: 'an',
    netEurApprox: { year1: 35, year2Plus: 42.5 },
    badge: '2 mois offerts',
    bestValue: true,
  },
  /** Prix exclusif : ~3 ans d'annuel en un paiement, positionné comme offre fondateur / récompense à vie */
  lifetime: {
    priceEur: 149,
    label: 'Accès à vie',
    period: 'à vie',
    badge: 'Exclusif',
    /** Équivalent à ~3 ans d\'abonnement annuel (49,99×3 ≈ 150 €) — « plus jamais payer » */
    equivalentYears: 3,
  },
} as const;

/** Explication "indicatif" pour l'utilisateur : définition + sentiment de manque (freemium). */
export const INDICATIF_COPY = {
  /** Court : ce que signifie "indicatif" */
  definition: 'Indicatif = valeurs d\'illustration, pas les cours en direct.',
  /** FOMO : ce qu'ils n'ont pas (temps réel) */
  lack: 'En Pro, ces mêmes données seraient en temps réel — les marchés évolueraient sous vos yeux.',
} as const;

/** Copy paywall : Pro et Lifetime comme récompense, pas restriction */
export const PAYWALL_COPY = {
  title: BRAND.proName,
  subtitle: 'Récompenses Pro : données en temps réel sans config',
  freeTitle: 'Gratuit',
  freeSubtitle: 'Déjà beaucoup sans rien payer',
  proTitle: 'Pro',
  proSubtitle: 'Récompenses Pro : tout en temps réel, zéro config',
  whyPro: 'Votre abonnement débloque les données marchés en temps réel (indices, or, pétrole), plus de questions d\'actualité dans le quiz pour vous tenir informé, et soutient le développement de l\'app.',
  cta: 'Choisir Pro',
  ctaYearly: 'Choisir l\'annuel — 2 mois offerts',
  restore: 'Restaurer un achat',
  termsNote: 'Paiement via votre compte App Store. Renouvellement automatique sauf annulation (Pro).',
  // Lifetime — accessible aussi via Réglages
  lifetimeTitle: 'NOESIS Lifetime',
  lifetimeSubtitle: 'Un seul paiement. Tout débloqué. Pour toujours.',
  lifetimeCta: 'Choisir l\'accès à vie',
  lifetimeWhy: 'Récompensez-vous : toutes les données, thème exclusif Membre à vie, fonctionnalités cachées. Plus jamais de renouvellement.',
} as const;
