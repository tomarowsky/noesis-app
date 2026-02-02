import { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Palette, 
  Settings,
  Zap,
  Sparkles,
  Lock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Info,
  X,
  Star,
  Target,
  Clock,
  Globe,
  Cpu,
  TrendingUp as Trending,
  BookOpen,
  Shield,
  Radio,
  Satellite,
  Database,
  LineChart,
  BarChart3,
  PieChart,
  Activity,
  Droplets,
  Sun,
  TreePine,
  Heart,
  Stethoscope,
  Pill,
  Syringe,
  Dna,
  Brain,
  Users,
  User,
  Building,
  Banknote,
  Gem,
  Crown,
  Award,
  Telescope,
  Rocket,
  Car,
  Atom,
  Wind,
  Palette as ArtPalette,
  Zap as Energy,
  Lightbulb as Idea,
  ChevronRight,
  CheckCircle,
  Flame,
  GripVertical,
  Plus,
  Film,
  Music,
  GraduationCap,
  Plane,
  Ship,
  Home,
  UtensilsCrossed,
  Tv
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { formatValue, formatPercent, type ValueFormat } from '@/lib/formatData';
import { useProgressStore } from '@/store/progressStore';
import { fetchRealtimeForWidget, REALTIME_WIDGET_IDS, hasAlphaVantageKey } from '@/services/marketData';
import { QuizPanel } from '@/components/QuizPanel';
import { PaywallModal } from '@/components/PaywallModal';
import { LifetimePaywallModal } from '@/components/LifetimePaywallModal';
import { CustomizationPanel } from '@/components/CustomizationPanel';
import { SecretMenu } from '@/components/SecretMenu';
import { SecretMenuErrorBoundary } from '@/components/SecretMenuErrorBoundary';
import { ParticleBackground } from '@/components/ParticleBackground';
import { QUIZ_CATEGORY_LABELS } from '@/data/quizQuestions';
import { hexToHsl } from '@/lib/utils';
import { BRAND } from '@/config/brand';
import { LEGAL } from '@/config/legal';
import { SECRET_DISCOVERY } from '@/config/discoveries';
import { INDICATIF_COPY } from '@/config/pricing';
import { getLockedCardMessage } from '@/config/lockedCardHints';

/** Mot de passe pour déverrouiller le mode développeur (10 taps sur le badge niveau). */
const DEV_PASSWORD = 'noesis-dev';

// Types
interface WidgetData {
  value: string | number;
  change?: number;
  context: string;
  insight: string;
  source: string;
}

interface DataWidget {
  id: string;
  title: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  levelRequired: number;
  data: WidgetData;
  refreshInterval: number;
  icon: React.ElementType;
  /** Format d'affichage unifié (comme sur les sites boursiers : Pts, espace milliers, virgule décimales) */
  valueFormat: ValueFormat;
  /** Décimales pour format number/percent (optionnel) */
  valueDecimals?: number;
  /** Max pour format ratio (ex. 10 → "6,3/10") (optionnel) */
  valueRatioMax?: number;
}

// 130+ widgets de données — pathway de déblocage : niveau effectif >= 1, débloqué si levelRequired <= niveau
// (isLifetime = tout débloqué ; sinon déblocage strict par XP → level)
const WIDGETS: DataWidget[] = [
  // ===== FINANCE & ÉCONOMIE (Niveaux 1-10) =====
  {
    id: 'sp500',
    title: 'S&P 500',
    category: 'finance',
    rarity: 'common',
    levelRequired: 1,
    data: {
      value: 5234.87,
      change: 1.23,
      context: 'Indice boursier américain',
      insight: 'Les marchés montrent une résilience remarquable malgré la volatilité',
      source: 'Bloomberg'
    },
    refreshInterval: 30,
    icon: Trending,
    valueFormat: 'index'
  },
  {
    id: 'nasdaq',
    title: 'NASDAQ',
    category: 'finance',
    rarity: 'common',
    levelRequired: 1,
    data: {
      value: 16432.78,
      change: 2.15,
      context: 'Indice tech américain',
      insight: 'La tech continue sa domination avec les IA génératives',
      source: 'NASDAQ'
    },
    refreshInterval: 30,
    icon: LineChart,
    valueFormat: 'index'
  },
  {
    id: 'cac40',
    title: 'CAC 40',
    category: 'finance',
    rarity: 'common',
    levelRequired: 1,
    data: {
      value: 7432.15,
      change: -0.45,
      context: 'Indice boursier français',
      insight: 'Le marché français attend les résultats des banques',
      source: 'Euronext'
    },
    refreshInterval: 30,
    icon: BarChart3,
    valueFormat: 'index'
  },
  {
    id: 'eurusd',
    title: 'EUR/USD',
    category: 'finance',
    rarity: 'common',
    levelRequired: 1,
    data: {
      value: 1.0845,
      change: 0.32,
      context: 'Taux de change',
      insight: 'L\'euro se stabilise face aux incertitudes économiques',
      source: 'Forex'
    },
    refreshInterval: 15,
    icon: Activity,
    valueFormat: 'forex'
  },
  {
    id: 'gold',
    title: 'Or',
    category: 'finance',
    rarity: 'uncommon',
    levelRequired: 2,
    data: {
      value: 2145.30,
      change: 0.87,
      context: 'Prix de l\'once',
      insight: 'L\'or reste un refuge privilégié en période d\'incertitude',
      source: 'LBMA'
    },
    refreshInterval: 60,
    icon: Gem,
    valueFormat: 'currency_usd'
  },
  {
    id: 'oil',
    title: 'Pétrole Brent',
    category: 'finance',
    rarity: 'uncommon',
    levelRequired: 2,
    data: {
      value: 78.45,
      change: -1.23,
      context: 'Prix du baril',
      insight: 'Les tensions géopolitiques influencent les cours',
      source: 'ICE'
    },
    refreshInterval: 60,
    icon: Droplets,
    valueFormat: 'currency_usd'
  },
  {
    id: 'bitcoin',
    title: 'Bitcoin',
    category: 'crypto',
    rarity: 'rare',
    levelRequired: 3,
    data: {
      value: 67432,
      change: 5.67,
      context: 'BTC/USD',
      insight: 'Le halving approche, les investisseurs sont optimistes',
      source: 'CoinGecko'
    },
    refreshInterval: 15,
    icon: Database,
    valueFormat: 'currency_usd'
  },
  {
    id: 'ethereum',
    title: 'Ethereum',
    category: 'crypto',
    rarity: 'rare',
    levelRequired: 3,
    data: {
      value: 3456,
      change: 3.21,
      context: 'ETH/USD',
      insight: 'Les ETFs Ethereum gagnent en popularité',
      source: 'CoinGecko'
    },
    refreshInterval: 15,
    icon: Database,
    valueFormat: 'currency_usd'
  },
  {
    id: 'fed_rate',
    title: 'Taux Fed',
    category: 'finance',
    rarity: 'epic',
    levelRequired: 5,
    data: {
      value: 5.25,
      change: 0,
      context: 'Taux directeur',
      insight: 'La Fed maintient ses taux, vigilante sur l\'inflation',
      source: 'Federal Reserve'
    },
    refreshInterval: 3600,
    icon: Banknote,
    valueFormat: 'percent'
  },
  {
    id: 'inflation',
    title: 'Inflation US',
    category: 'finance',
    rarity: 'epic',
    levelRequired: 5,
    data: {
      value: 3.2,
      change: -0.1,
      context: 'IPC annuel',
      insight: 'L\'inflation ralentit mais reste au-dessus de l\'objectif',
      source: 'BLS'
    },
    refreshInterval: 86400,
    icon: Trending,
    valueFormat: 'percent'
  },
  {
    id: 'unemployment',
    title: 'Chômage US',
    category: 'finance',
    rarity: 'legendary',
    levelRequired: 7,
    data: {
      value: 3.7,
      change: 0.1,
      context: 'Taux de chômage',
      insight: 'Le marché du travail reste résilient',
      source: 'BLS'
    },
    refreshInterval: 86400,
    icon: Users,
    valueFormat: 'percent'
  },
  {
    id: 'gdp',
    title: 'PIB US',
    category: 'finance',
    rarity: 'legendary',
    levelRequired: 7,
    data: {
      value: 27.4,
      change: 2.5,
      context: 'PIB (milliers de milliards $)',
      insight: 'La croissance américaine dépasse les attentes',
      source: 'BEA'
    },
    refreshInterval: 86400,
    icon: PieChart,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'debt',
    title: 'Dette US',
    category: 'finance',
    rarity: 'mythic',
    levelRequired: 10,
    data: {
      value: 34.6,
      change: 6.2,
      context: 'Dette publique (milliers de milliards $)',
      insight: 'La dette atteint des niveaux historiques',
      source: 'Treasury'
    },
    refreshInterval: 86400,
    icon: Shield,
    valueFormat: 'number',
    valueDecimals: 1
  },

  // ===== TECH & INNOVATION (Niveaux 3-15) =====
  {
    id: 'ai_funding',
    title: 'Levées IA',
    category: 'tech',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: 4.2,
      change: 45,
      context: 'Investissements ce mois (milliards $)',
      insight: 'L\'IA générative domine les levées de fonds',
      source: 'Crunchbase'
    },
    refreshInterval: 86400,
    icon: Cpu,
    valueFormat: 'currency_usd',
    valueDecimals: 1
  },
  {
    id: 'unicorns',
    title: 'Licornes',
    category: 'tech',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: 1247,
      change: -12,
      context: 'Startups > 1 Md $',
      insight: 'Le marché des licornes se rationalise',
      source: 'CB Insights'
    },
    refreshInterval: 86400,
    icon: Crown,
    valueFormat: 'number'
  },
  {
    id: 'semiconductor',
    title: 'Semiconducteurs',
    category: 'tech',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: 587,
      change: 8.3,
      context: 'Marché mondial (milliards $)',
      insight: 'La pénurie de puces s\'atténue progressivement',
      source: 'Gartner'
    },
    refreshInterval: 86400,
    icon: Cpu,
    valueFormat: 'currency_usd',
    valueDecimals: 0
  },
  {
    id: 'quantum',
    title: 'Quantum Computing',
    category: 'tech',
    rarity: 'legendary',
    levelRequired: 8,
    data: {
      value: 1121,
      change: 23,
      context: 'Qubits record (IBM)',
      insight: 'L\'informatique quantique accélère son développement',
      source: 'IBM Research'
    },
    refreshInterval: 86400,
    icon: Atom,
    valueFormat: 'number'
  },
  {
    id: 'space',
    title: 'SpaceX',
    category: 'tech',
    rarity: 'legendary',
    levelRequired: 9,
    data: {
      value: 180,
      change: 15,
      context: 'Valorisation (milliards $)',
      insight: 'Le secteur spatial privé explose',
      source: 'PitchBook'
    },
    refreshInterval: 86400,
    icon: Rocket,
    valueFormat: 'currency_usd',
    valueDecimals: 0
  },

  // ===== GÉOPOLITIQUE & SOCIÉTÉ (Niveaux 4-20) =====
  {
    id: 'geopolitical',
    title: 'Index Tension',
    category: 'geopolitics',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: 6.3,
      change: 0.2,
      context: 'Niveau de tension mondial',
      insight: 'Les tensions Moyen-Orient restent élevées',
      source: 'IISS'
    },
    refreshInterval: 3600,
    icon: Globe,
    valueFormat: 'ratio',
    valueRatioMax: 10
  },
  {
    id: 'conflicts',
    title: 'Conflits actifs',
    category: 'geopolitics',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: 32,
      change: 2,
      context: 'Conflits armés',
      insight: 'Le nombre de conflits atteint un niveau historique',
      source: 'UCDP'
    },
    refreshInterval: 86400,
    icon: Shield,
    valueFormat: 'number'
  },
  {
    id: 'refugees',
    title: 'Réfugiés',
    category: 'geopolitics',
    rarity: 'legendary',
    levelRequired: 8,
    data: {
      value: 114,
      change: 8,
      context: 'Personnes déplacées (millions)',
      insight: 'Record historique de déplacés dans le monde',
      source: 'UNHCR'
    },
    refreshInterval: 86400,
    icon: Users,
    valueFormat: 'number'
  },
  {
    id: 'nuclear',
    title: 'Têtes nucléaires',
    category: 'geopolitics',
    rarity: 'mythic',
    levelRequired: 12,
    data: {
      value: 12121,
      change: -410,
      context: 'Stock mondial',
      insight: 'La réduction des arsenaux nucléaires continue',
      source: 'SIPRI'
    },
    refreshInterval: 86400,
    icon: Radio,
    valueFormat: 'number'
  },

  // ===== SCIENCE & DÉCOUVERTES (Niveaux 3-18) =====
  {
    id: 'publications',
    title: 'Publications',
    category: 'science',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: 4847,
      change: 12,
      context: 'Papers aujourd\'hui',
      insight: 'La recherche scientifique s\'accélère',
      source: 'PubMed'
    },
    refreshInterval: 86400,
    icon: BookOpen,
    valueFormat: 'number'
  },
  {
    id: 'arxiv',
    title: 'arXiv',
    category: 'science',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: 523,
      change: 8,
      context: 'Preprints aujourd\'hui',
      insight: 'L\'open science gagne du terrain',
      source: 'arXiv'
    },
    refreshInterval: 86400,
    icon: Database,
    valueFormat: 'number'
  },
  {
    id: 'climate',
    title: 'CO₂ Atmosphère',
    category: 'science',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: 424.2,
      change: 2.4,
      context: 'ppm CO₂',
      insight: 'Les concentrations de CO₂ continuent d\'augmenter',
      source: 'NOAA'
    },
    refreshInterval: 86400,
    icon: Wind,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'temperature',
    title: 'Température',
    category: 'science',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: 1.18,
      change: 0.05,
      context: 'Anomalie vs 1850-1900',
      insight: '2024 pourrait être l\'année la plus chaude jamais enregistrée',
      source: 'NASA'
    },
    refreshInterval: 86400,
    icon: Sun,
    valueFormat: 'temperature'
  },
  {
    id: 'ice',
    title: 'Fonte glaciaire',
    category: 'science',
    rarity: 'legendary',
    levelRequired: 9,
    data: {
      value: -267,
      change: -12,
      context: 'Gt/an (Antarctique)',
      insight: 'La fonte des glaces s\'accélère',
      source: 'NASA'
    },
    refreshInterval: 86400,
    icon: Droplets,
    valueFormat: 'number'
  },
  {
    id: 'biodiversity',
    title: 'Biodiversité',
    category: 'science',
    rarity: 'mythic',
    levelRequired: 11,
    data: {
      value: 69,
      change: -4,
      context: 'Déclin depuis 1970',
      insight: 'La biodiversité s\'effondre à un rythme alarmant',
      source: 'WWF'
    },
    refreshInterval: 86400,
    icon: TreePine,
    valueFormat: 'percent'
  },
  {
    id: 'extinctions',
    title: 'Extinctions',
    category: 'science',
    rarity: 'mythic',
    levelRequired: 13,
    data: {
      value: 680,
      change: 12,
      context: 'Espèces éteintes (depuis 1700)',
      insight: 'Nous sommes dans la 6ème extinction de masse',
      source: 'IUCN'
    },
    refreshInterval: 86400,
    icon: Heart,
    valueFormat: 'number'
  },

  // ===== SANTÉ & MÉDECINE (Niveaux 3-17) =====
  {
    id: 'life_expectancy',
    title: 'Espérance vie',
    category: 'health',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: 73.2,
      change: 0.3,
      context: 'Années (monde)',
      insight: 'L\'espérance de vie repart à la hausse post-COVID',
      source: 'OMS'
    },
    refreshInterval: 86400,
    icon: Heart,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'pandemic',
    title: 'COVID-19',
    category: 'health',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: 7,
      change: 0.01,
      context: 'Décès cumulés (millions)',
      insight: 'La pandémie entre dans une phase endémique',
      source: 'OMS'
    },
    refreshInterval: 86400,
    icon: Stethoscope,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'vaccines',
    title: 'Vaccinations',
    category: 'health',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: 13.5,
      change: 0.1,
      context: 'Doses administrées (milliards)',
      insight: 'La couverture vaccinale reste inégale',
      source: 'OMS'
    },
    refreshInterval: 86400,
    icon: Syringe,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'antibiotics',
    title: 'Résistance',
    category: 'health',
    rarity: 'legendary',
    levelRequired: 9,
    data: {
      value: 1.27,
      change: 8,
      context: 'Décès/an (AMR, millions)',
      insight: 'La résistance aux antibiotiques est une urgence sanitaire',
      source: 'Lancet'
    },
    refreshInterval: 86400,
    icon: Pill,
    valueFormat: 'number',
    valueDecimals: 2
  },
  {
    id: 'longevity',
    title: 'Longévité',
    category: 'health',
    rarity: 'mythic',
    levelRequired: 14,
    data: {
      value: 122,
      change: 0,
      context: 'Record (Jeanne Calment, années)',
      insight: 'La recherche sur la longévité fait des progrès',
      source: 'Gerontology'
    },
    refreshInterval: 86400,
    icon: Dna,
    valueFormat: 'number'
  },

  // ===== DÉMOGRAPHIE & POPULATION (Niveaux 2-16) =====
  {
    id: 'population',
    title: 'Population',
    category: 'demographics',
    rarity: 'common',
    levelRequired: 2,
    data: {
      value: 8.1,
      change: 0.9,
      context: 'Humains sur Terre (milliards)',
      insight: 'La croissance démographique ralentit',
      source: 'ONU'
    },
    refreshInterval: 86400,
    icon: Users,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'birth_rate',
    title: 'Fécondité',
    category: 'demographics',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: 2.3,
      change: -0.1,
      context: 'Enfants/femme',
      insight: 'Le taux de fécondité mondial continue de baisser',
      source: 'ONU'
    },
    refreshInterval: 86400,
    icon: Users,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'urbanization',
    title: 'Urbanisation',
    category: 'demographics',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: 57,
      change: 0.5,
      context: 'Population urbaine',
      insight: 'La majorité de l\'humanité vit en ville',
      source: 'ONU'
    },
    refreshInterval: 86400,
    icon: Building,
    valueFormat: 'percent'
  },
  {
    id: 'aging',
    title: 'Vieillissement',
    category: 'demographics',
    rarity: 'epic',
    levelRequired: 7,
    data: {
      value: 10,
      change: 0.3,
      context: 'Population > 65 ans',
      insight: 'La population mondiale vieillit rapidement',
      source: 'ONU'
    },
    refreshInterval: 86400,
    icon: Clock,
    valueFormat: 'percent'
  },
  {
    id: 'megacities',
    title: 'Mégapoles',
    category: 'demographics',
    rarity: 'legendary',
    levelRequired: 10,
    data: {
      value: 34,
      change: 2,
      context: 'Villes > 10M habitants',
      insight: 'Les mégapoles continuent de croître',
      source: 'ONU'
    },
    refreshInterval: 86400,
    icon: Building,
    valueFormat: 'number'
  },

  // ===== ÉNERGIE & ENVIRONNEMENT (Niveaux 3-19) =====
  {
    id: 'renewable',
    title: 'Énergies vertes',
    category: 'energy',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: 30,
      change: 2.1,
      context: 'Part dans le mix',
      insight: 'Les renouvelables progressent rapidement',
      source: 'IEA'
    },
    refreshInterval: 86400,
    icon: Sun,
    valueFormat: 'percent'
  },
  {
    id: 'solar',
    title: 'Solaire',
    category: 'energy',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: 1.4,
      change: 22,
      context: 'Capacité installée (TW)',
      insight: 'Le solaire devient la source d\'énergie la moins chère',
      source: 'IEA'
    },
    refreshInterval: 86400,
    icon: Sun,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'ev',
    title: 'Voitures électriques',
    category: 'energy',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: 14,
      change: 4.2,
      context: 'Part des ventes',
      insight: 'L\'électrification des transports s\'accélère',
      source: 'IEA'
    },
    refreshInterval: 86400,
    icon: Car,
    valueFormat: 'percent'
  },
  {
    id: 'batteries',
    title: 'Batteries',
    category: 'energy',
    rarity: 'legendary',
    levelRequired: 9,
    data: {
      value: 139,
      change: -14,
      context: '$/kWh (pack)',
      insight: 'Les coûts des batteries continuent de chuter',
      source: 'BNEF'
    },
    refreshInterval: 86400,
    icon: Energy,
    valueFormat: 'currency_usd',
    valueDecimals: 0
  },
  {
    id: 'fusion',
    title: 'Fusion nucléaire',
    category: 'energy',
    rarity: 'mythic',
    levelRequired: 15,
    data: {
      value: 'Q=1.5',
      change: 0.3,
      context: 'Record JET',
      insight: 'La fusion nucléaire approche du break-even',
      source: 'JET'
    },
    refreshInterval: 86400,
    icon: Atom,
    valueFormat: 'raw'
  },

  // ===== VIVANT & ÉCOLOGIE (Niveaux 1-15) =====
  {
    id: 'co2_global',
    title: 'CO₂ Mondial',
    category: 'ecology',
    rarity: 'common',
    levelRequired: 1,
    data: {
      value: 36.8,
      change: 0.9,
      context: 'Gt CO₂/an (énergie)',
      insight: 'Les émissions plafonnent mais restent à un niveau critique',
      source: 'IEA'
    },
    refreshInterval: 86400,
    icon: Flame,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'deforestation',
    title: 'Déforestation',
    category: 'ecology',
    rarity: 'uncommon',
    levelRequired: 2,
    data: {
      value: 4.1,
      change: -0.3,
      context: 'M ha/an (perte nette)',
      insight: 'La protection des forêts primaires progresse',
      source: 'FAO'
    },
    refreshInterval: 86400,
    icon: TreePine,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'plastic_pollution',
    title: 'Plastique Océan',
    category: 'ecology',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: 8,
      change: 0.5,
      context: 'Mt déversées/an',
      insight: 'Le traité mondial sur le plastique avance',
      source: 'UNEP'
    },
    refreshInterval: 86400,
    icon: Droplets,
    valueFormat: 'number'
  },
  {
    id: 'vegan_market',
    title: 'Marché Végan',
    category: 'ecology',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: 28.5,
      change: 6.2,
      context: 'Milliards $ (alimentaire)',
      insight: 'Le flexitarisme et le véganisme gagnent du terrain',
      source: 'Grand View'
    },
    refreshInterval: 86400,
    icon: UtensilsCrossed,
    valueFormat: 'currency_usd',
    valueDecimals: 1
  },
  {
    id: 'sustainable_fashion',
    title: 'Mode Durable',
    category: 'ecology',
    rarity: 'rare',
    levelRequired: 5,
    data: {
      value: 7.2,
      change: 1.8,
      context: '% du marché textile mondial',
      insight: 'Seconde main et matières recyclées en forte hausse',
      source: 'McKinsey'
    },
    refreshInterval: 86400,
    icon: Heart,
    valueFormat: 'percent',
    valueDecimals: 1
  },
  {
    id: 'species_at_risk',
    title: 'Espèces Menacées',
    category: 'ecology',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: 44163,
      change: 1200,
      context: 'Espèces (liste rouge UICN)',
      insight: 'Les efforts de conservation ralentissent le déclin',
      source: 'UICN'
    },
    refreshInterval: 86400,
    icon: Heart,
    valueFormat: 'number'
  },
  {
    id: 'organic_farming',
    title: 'Agriculture Bio',
    category: 'ecology',
    rarity: 'uncommon',
    levelRequired: 7,
    data: {
      value: 76.4,
      change: 4.2,
      context: 'M ha (surfaces certifiées)',
      insight: 'L\'Europe mène la conversion bio',
      source: 'FiBL'
    },
    refreshInterval: 86400,
    icon: TreePine,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'green_bonds',
    title: 'Obligations Vertes',
    category: 'ecology',
    rarity: 'rare',
    levelRequired: 8,
    data: {
      value: 580,
      change: 42,
      context: 'Milliards $ émis (cumul)',
      insight: 'La finance verte devient mainstream',
      source: 'Climate Bonds'
    },
    refreshInterval: 86400,
    icon: Banknote,
    valueFormat: 'currency_usd',
    valueDecimals: 0
  },

  // ===== ART & CULTURE (Niveaux 7-20) =====
  {
    id: 'art_market',
    title: 'Marché de l\'Art',
    category: 'art',
    rarity: 'epic',
    levelRequired: 7,
    data: {
      value: 65.2,
      change: -4,
      context: 'Volume 2023 (milliards $)',
      insight: 'Le marché de l\'art résiste malgré la baisse',
      source: 'Art Basel'
    },
    refreshInterval: 86400,
    icon: ArtPalette,
    valueFormat: 'currency_usd',
    valueDecimals: 1
  },
  {
    id: 'auction_record',
    title: 'Record Ventes',
    category: 'art',
    rarity: 'legendary',
    levelRequired: 10,
    data: {
      value: 450,
      change: 0,
      context: 'Salvator Mundi (millions $)',
      insight: 'Le record absolu des enchères d\'art',
      source: 'Christie\'s'
    },
    refreshInterval: 86400,
    icon: Gem,
    valueFormat: 'currency_usd',
    valueDecimals: 0
  },
  {
    id: 'nft',
    title: 'NFTs',
    category: 'art',
    rarity: 'mythic',
    levelRequired: 12,
    data: {
      value: 8.7,
      change: -62,
      context: 'Volume 2023 (milliards $)',
      insight: 'Le marché des NFTs s\'est effondré',
      source: 'CryptoSlam'
    },
    refreshInterval: 86400,
    icon: Database,
    valueFormat: 'currency_usd',
    valueDecimals: 1
  },

  // ===== PHILOSOPHIE & SAGESSE (Niveaux 8-25) =====
  {
    id: 'wisdom_daily',
    title: 'Sagesse du Jour',
    category: 'philosophy',
    rarity: 'epic',
    levelRequired: 8,
    data: {
      value: '"Connais-toi toi-même"',
      change: 0,
      context: 'Socrate',
      insight: 'La connaissance de soi est le début de la sagesse',
      source: 'Corpus Philosophique'
    },
    refreshInterval: 86400,
    icon: Idea,
    valueFormat: 'raw'
  },
  {
    id: 'happiness',
    title: 'Bonheur',
    category: 'philosophy',
    rarity: 'legendary',
    levelRequired: 11,
    data: {
      value: 6.4,
      change: 0.1,
      context: 'World Happiness Report',
      insight: 'Les pays nordiques dominent le classement',
      source: 'UN'
    },
    refreshInterval: 86400,
    icon: Heart,
    valueFormat: 'ratio',
    valueRatioMax: 10
  },
  {
    id: 'consciousness',
    title: 'Conscience',
    category: 'philosophy',
    rarity: 'mythic',
    levelRequired: 16,
    data: {
      value: '???',
      change: 0,
      context: 'Problème difficile',
      insight: 'La conscience reste le plus grand mystère scientifique',
      source: 'Philosophy of Mind'
    },
    refreshInterval: 86400,
    icon: Brain,
    valueFormat: 'raw'
  },

  // ===== SPORT (Niveaux 3-12) =====
  {
    id: 'football_transfers',
    title: 'Transferts Foot',
    category: 'sport',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: 12.4,
      change: 18,
      context: 'Dépenses 2024 (milliards €)',
      insight: 'Le marché des transferts bat des records',
      source: 'FIFA'
    },
    refreshInterval: 86400,
    icon: Trophy,
    valueFormat: 'currency_usd',
    valueDecimals: 1
  },
  {
    id: 'olympics',
    title: 'JO Paris',
    category: 'sport',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: 10.5,
      change: 0,
      context: 'Médailles France',
      insight: 'Les Jeux olympiques dopent l\'économie locale',
      source: 'CIO'
    },
    refreshInterval: 86400,
    icon: Award,
    valueFormat: 'number'
  },
  {
    id: 'sport_audience',
    title: 'Audience Mondiale',
    category: 'sport',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: 5.2,
      change: 4,
      context: 'Finale Coupe du monde (milliards)',
      insight: 'Le sport reste le contenu le plus regardé au monde',
      source: 'FIFA'
    },
    refreshInterval: 86400,
    icon: Tv,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'club_valuation',
    title: 'Valorisation Clubs',
    category: 'sport',
    rarity: 'legendary',
    levelRequired: 9,
    data: {
      value: 5.9,
      change: 12,
      context: 'Real Madrid (milliards $)',
      insight: 'Les grands clubs valent plus que jamais',
      source: 'Forbes'
    },
    refreshInterval: 86400,
    icon: Crown,
    valueFormat: 'currency_usd',
    valueDecimals: 1
  },

  // ===== CULTURE — Cinéma, streaming, musique, livres (Niveaux 4-14) =====
  {
    id: 'box_office',
    title: 'Box-Office Mondial',
    category: 'culture',
    rarity: 'uncommon',
    levelRequired: 4,
    data: {
      value: 32.4,
      change: 8,
      context: 'Billetterie 2024 (milliards $)',
      insight: 'Le cinéma retrouve des couleurs après la pandémie',
      source: 'Comscore'
    },
    refreshInterval: 86400,
    icon: Film,
    valueFormat: 'currency_usd',
    valueDecimals: 1
  },
  {
    id: 'streaming_subs',
    title: 'Abonnements SVOD',
    category: 'culture',
    rarity: 'rare',
    levelRequired: 5,
    data: {
      value: 1.82,
      change: 9,
      context: 'Abonnés mondiaux (milliards)',
      insight: 'Netflix, Disney+, Prime dominent le streaming',
      source: 'Statista'
    },
    refreshInterval: 86400,
    icon: Tv,
    valueFormat: 'number',
    valueDecimals: 2
  },
  {
    id: 'music_industry',
    title: 'Industrie Musicale',
    category: 'culture',
    rarity: 'epic',
    levelRequired: 7,
    data: {
      value: 28.6,
      change: 10,
      context: 'Revenus mondiaux 2023 (milliards $)',
      insight: 'Le streaming représente 67 % des revenus',
      source: 'IFPI'
    },
    refreshInterval: 86400,
    icon: Music,
    valueFormat: 'currency_usd',
    valueDecimals: 1
  },
  {
    id: 'book_sales',
    title: 'Vente de Livres',
    category: 'culture',
    rarity: 'legendary',
    levelRequired: 10,
    data: {
      value: 98.5,
      change: -2,
      context: 'Marché mondial 2023 (milliards $)',
      insight: 'Le papier résiste face au numérique',
      source: 'Nielsen'
    },
    refreshInterval: 86400,
    icon: BookOpen,
    valueFormat: 'currency_usd',
    valueDecimals: 1
  },

  // ===== ÉDUCATION (Niveaux 3-10) =====
  {
    id: 'literacy',
    title: 'Alphabétisation',
    category: 'education',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: 86.3,
      change: 0.4,
      context: 'Taux mondial',
      insight: 'L\'alphabétisation progresse mais reste inégale',
      source: 'UNESCO'
    },
    refreshInterval: 86400,
    icon: BookOpen,
    valueFormat: 'percent'
  },
  {
    id: 'pisa',
    title: 'PISA',
    category: 'education',
    rarity: 'rare',
    levelRequired: 5,
    data: {
      value: 472,
      change: -15,
      context: 'Score France (maths)',
      insight: 'Les classements PISA scrutés par les politiques',
      source: 'OCDE'
    },
    refreshInterval: 86400,
    icon: GraduationCap,
    valueFormat: 'number'
  },
  {
    id: 'rd_spending',
    title: 'R&D Mondiale',
    category: 'education',
    rarity: 'epic',
    levelRequired: 8,
    data: {
      value: 2.63,
      change: 4,
      context: 'Dépenses (milliers de milliards $)',
      insight: 'La R&D mondiale dépasse 2 600 milliards $',
      source: 'UNESCO'
    },
    refreshInterval: 86400,
    icon: GraduationCap,
    valueFormat: 'number',
    valueDecimals: 2
  },

  // ===== ALIMENTATION & AGRICULTURE (Niveaux 4-8) =====
  {
    id: 'wheat',
    title: 'Blé',
    category: 'food',
    rarity: 'uncommon',
    levelRequired: 4,
    data: {
      value: 5.82,
      change: -12,
      context: 'Prix ($/boisseau)',
      insight: 'Les cours du blé reflètent les tensions géopolitiques',
      source: 'CBOT'
    },
    refreshInterval: 86400,
    icon: UtensilsCrossed,
    valueFormat: 'currency_usd',
    valueDecimals: 2
  },
  {
    id: 'food_price_index',
    title: 'Prix Alimentaires',
    category: 'food',
    rarity: 'rare',
    levelRequired: 6,
    data: {
      value: 118.5,
      change: -1.2,
      context: 'Indice FAO',
      insight: 'L\'indice FAO suit les matières premières agricoles',
      source: 'FAO'
    },
    refreshInterval: 86400,
    icon: UtensilsCrossed,
    valueFormat: 'number',
    valueDecimals: 1
  },

  // ===== TRANSPORT (Niveaux 5-11) =====
  {
    id: 'aviation_pax',
    title: 'Trafic Aérien',
    category: 'transport',
    rarity: 'rare',
    levelRequired: 5,
    data: {
      value: 4.7,
      change: 11,
      context: 'Passagers 2024 (milliards)',
      insight: 'L\'aviation dépasse le niveau pré-COVID',
      source: 'IATA'
    },
    refreshInterval: 86400,
    icon: Plane,
    valueFormat: 'number',
    valueDecimals: 1
  },
  {
    id: 'shipping',
    title: 'Fret Maritime',
    category: 'transport',
    rarity: 'epic',
    levelRequired: 8,
    data: {
      value: 12.5,
      change: 3,
      context: 'Milliards de tonnes transportées',
      insight: '90 % du commerce mondial passe par la mer',
      source: 'UNCTAD'
    },
    refreshInterval: 86400,
    icon: Ship,
    valueFormat: 'number',
    valueDecimals: 1
  },

  // ===== IMMOBILIER (Niveaux 5-9) =====
  {
    id: 'housing_index',
    title: 'Prix Immobilier',
    category: 'real_estate',
    rarity: 'rare',
    levelRequired: 5,
    data: {
      value: 142,
      change: -1.5,
      context: 'Indice France (base 100)',
      insight: 'Les taux élevés freinent le marché',
      source: 'INSEE'
    },
    refreshInterval: 86400,
    icon: Home,
    valueFormat: 'number'
  },
  {
    id: 'mortgage_rate',
    title: 'Taux Hypothécaire',
    category: 'real_estate',
    rarity: 'epic',
    levelRequired: 7,
    data: {
      value: 4.2,
      change: 0.1,
      context: 'Taux moyen France',
      insight: 'Les taux restent élevés après la hausse BCE',
      source: 'Banque de France'
    },
    refreshInterval: 86400,
    icon: Banknote,
    valueFormat: 'percent'
  },

  // ===== MÉDIAS & RÉSEAUX (Niveaux 4-10) =====
  {
    id: 'social_media_users',
    title: 'Réseaux Sociaux',
    category: 'media',
    rarity: 'uncommon',
    levelRequired: 4,
    data: {
      value: 5.04,
      change: 5,
      context: 'Utilisateurs actifs (milliards)',
      insight: 'Plus de 60 % de l\'humanité est sur les réseaux',
      source: 'DataReportal'
    },
    refreshInterval: 86400,
    icon: Users,
    valueFormat: 'number',
    valueDecimals: 2
  },
  {
    id: 'ad_spend',
    title: 'Pub Digitale',
    category: 'media',
    rarity: 'rare',
    levelRequired: 6,
    data: {
      value: 616,
      change: 9,
      context: 'Dépenses mondiales 2024 (milliards $)',
      insight: 'La pub digitale dépasse la TV',
      source: 'eMarketer'
    },
    refreshInterval: 86400,
    icon: Tv,
    valueFormat: 'currency_usd',
    valueDecimals: 0
  },

  // ===== EXCLUSIF NIVEAU 20+ =====
  {
    id: 'insider_alpha',
    title: 'Alpha Exclusif',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 20,
    data: {
      value: 'CONFIDENTIEL',
      change: 0,
      context: 'Information privilégiée',
      insight: 'Accès réservé aux membres niveau 20+',
      source: BRAND.appName
    },
    refreshInterval: 3600,
    icon: Crown,
    valueFormat: 'raw'
  },
  {
    id: 'dark_pool',
    title: 'Dark Pools',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 22,
    data: {
      value: 287,
      change: 12,
      context: 'Volume mensuel (milliards $)',
      insight: 'Les transactions hors marché dominent',
      source: 'FINRA'
    },
    refreshInterval: 86400,
    icon: Shield,
    valueFormat: 'currency_usd',
    valueDecimals: 0
  },
  {
    id: 'satellite',
    title: 'Satellites',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 25,
    data: {
      value: 8947,
      change: 342,
      context: 'Satellites actifs',
      insight: 'Starlink domine l\'espace orbital',
      source: 'UCS'
    },
    refreshInterval: 86400,
    icon: Satellite,
    valueFormat: 'number'
  },
  {
    id: 'quantum_supremacy',
    title: 'Suprématie Quantum',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 30,
    data: {
      value: '200s',
      change: 0,
      context: 'Tâche en 10k ans',
      insight: 'Google a atteint la suprématie quantique',
      source: 'Nature'
    },
    refreshInterval: 86400,
    icon: Atom,
    valueFormat: 'raw'
  },
  {
    id: 'singularity',
    title: 'Singularité',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 35,
    data: {
      value: 2045,
      change: 0,
      context: 'Prédiction Kurzweil',
      insight: 'L\'IA surpassera l\'intelligence humaine',
      source: 'Futurism'
    },
    refreshInterval: 86400,
    icon: Cpu,
    valueFormat: 'number'
  },
  {
    id: 'fermi_paradox',
    title: 'Paradoxe de Fermi',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 40,
    data: {
      value: '?',
      change: 0,
      context: 'Où sont-ils ?',
      insight: 'Le plus grand mystère de l\'humanité',
      source: 'Astrobiology'
    },
    refreshInterval: 86400,
    icon: Telescope,
    valueFormat: 'raw'
  },
  {
    id: 'simulation',
    title: 'Hypothèse Simulation',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 45,
    data: {
      value: 50,
      change: 0,
      context: 'Probabilité estimée',
      insight: 'Vivons-nous dans une simulation ?',
      source: 'Oxford'
    },
    refreshInterval: 86400,
    icon: Cpu,
    valueFormat: 'percent'
  },
  {
    id: 'ultimate_truth',
    title: 'Vérité Ultime',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 50,
    data: {
      value: 42,
      change: 0,
      context: 'La réponse',
      insight: 'La réponse à la grande question sur la vie, l\'univers et le reste',
      source: 'Deep Thought'
    },
    refreshInterval: 86400,
    icon: Idea,
    valueFormat: 'number'
  },

  // ===== NIVEAUX 11–19 (plus de données à découvrir) =====
  { id: 'carbon_footprint', title: 'Empreinte Carbone Tech', category: 'tech', rarity: 'rare', levelRequired: 11, data: { value: 2.1, change: -0.3, context: 'Gt CO₂/an secteur IT', insight: 'Les data centers visent la neutralité carbone', source: 'IEA' }, refreshInterval: 86400, icon: TreePine, valueFormat: 'number' },
  { id: 'space_debris', title: 'Débris Spatiaux', category: 'science', rarity: 'rare', levelRequired: 11, data: { value: 36500, change: 1200, context: 'Objets trackés en orbite', insight: 'La pollution orbitale s\'accélère', source: 'ESA' }, refreshInterval: 86400, icon: Satellite, valueFormat: 'number' },
  { id: 'ai_tokens', title: 'Tokens IA (milliards)', category: 'tech', rarity: 'epic', levelRequired: 12, data: { value: 4.2, change: 0.8, context: 'Consommation annuelle estimée', insight: 'Les LLM consomment de plus en plus de tokens', source: 'OpenAI' }, refreshInterval: 86400, icon: Cpu, valueFormat: 'number' },
  { id: 'renewable_share', title: 'Part Renouvelable Monde', category: 'science', rarity: 'uncommon', levelRequired: 12, data: { value: 30.2, change: 1.5, context: '% électricité mondiale', insight: 'Le solaire et l\'éolien dépassent le charbon', source: 'IEA' }, refreshInterval: 86400, icon: Sun, valueFormat: 'percent' },
  { id: 'metaverse_mau', title: 'Metaverse MAU', category: 'tech', rarity: 'rare', levelRequired: 13, data: { value: 420, change: -12, context: 'Millions d\'utilisateurs actifs', insight: 'L\'engouement metaverse se stabilise', source: 'Statista' }, refreshInterval: 86400, icon: Users, valueFormat: 'number' },
  { id: 'battery_density', title: 'Densité Batteries', category: 'tech', rarity: 'epic', levelRequired: 13, data: { value: 350, change: 15, context: 'Wh/kg (cellules NMC)', insight: 'Les batteries solides approchent', source: 'CATL' }, refreshInterval: 86400, icon: Zap, valueFormat: 'number' },
  { id: 'fusion_energy', title: 'Réacteur Fusion', category: 'science', rarity: 'legendary', levelRequired: 14, data: { value: 1.2, change: 0, context: 'Ratio Q (énergie produite/consommée)', insight: 'ITER vise Q > 10 d\'ici 2035', source: 'ITER' }, refreshInterval: 86400, icon: Atom, valueFormat: 'number' },
  { id: 'neurotech_market', title: 'Marché Neurotech', category: 'tech', rarity: 'epic', levelRequired: 14, data: { value: 15.2, change: 2.1, context: 'Milliards $ 2024', insight: 'Interfaces cerveau-machine en croissance', source: 'Grand View' }, refreshInterval: 86400, icon: Brain, valueFormat: 'currency_usd' },
  { id: 'ocean_plastic', title: 'Plastique Océan', category: 'science', rarity: 'rare', levelRequired: 15, data: { value: 8, change: 0.5, context: 'Mt déversées/an', insight: 'Le traité mondial plastique progresse', source: 'UNEP' }, refreshInterval: 86400, icon: Droplets, valueFormat: 'number' },
  { id: 'quantum_qubits', title: 'Qubits (logiques)', category: 'tech', rarity: 'legendary', levelRequired: 15, data: { value: 1000, change: 200, context: 'Cibles 2025 (IBM)', insight: 'L\'ère des ordinateurs quantiques approche', source: 'IBM' }, refreshInterval: 86400, icon: Atom, valueFormat: 'number' },
  { id: 'biodiversity_index', title: 'Indice Biodiversité', category: 'science', rarity: 'uncommon', levelRequired: 16, data: { value: 68.3, change: -1.2, context: 'Indice planète vivante', insight: 'Le déclin des espèces ralentit dans certaines régions', source: 'WWF' }, refreshInterval: 86400, icon: Heart, valueFormat: 'number' },
  { id: 'autonomous_vehicles', title: 'Véhicules Autonomes', category: 'tech', rarity: 'epic', levelRequired: 16, data: { value: 2.4, change: 0.6, context: 'Millions (niveau 2+) en circulation', insight: 'La conduite autonome se généralise', source: 'Navigant' }, refreshInterval: 86400, icon: Car, valueFormat: 'number' },
  { id: 'geothermal_capacity', title: 'Géothermie Mondiale', category: 'science', rarity: 'rare', levelRequired: 17, data: { value: 16.2, change: 0.9, context: 'GW installés', insight: 'La chaleur terrestre gagne en importance', source: 'IRENA' }, refreshInterval: 86400, icon: Sun, valueFormat: 'number' },
  { id: 'smart_cities', title: 'Villes Intelligentes', category: 'tech', rarity: 'epic', levelRequired: 17, data: { value: 600, change: 45, context: 'Projets actifs dans le monde', insight: 'Capteurs et données au service des citadins', source: 'IDC' }, refreshInterval: 86400, icon: Building, valueFormat: 'number' },
  { id: 'hydrogen_economy', title: 'Hydrogène Vert', category: 'science', rarity: 'epic', levelRequired: 18, data: { value: 1.2, change: 0.4, context: 'Mt produites/an', insight: 'L\'hydrogène vert décolle lentement', source: 'IEA' }, refreshInterval: 86400, icon: Wind, valueFormat: 'number' },
  { id: 'edge_computing', title: 'Edge Computing', category: 'tech', rarity: 'rare', levelRequired: 18, data: { value: 62, change: 12, context: 'Milliards $ marché 2024', insight: 'Le calcul en périphérie réduit la latence', source: 'Gartner' }, refreshInterval: 86400, icon: Cpu, valueFormat: 'currency_usd' },
  { id: 'crispr_trials', title: 'Essais CRISPR', category: 'science', rarity: 'legendary', levelRequired: 19, data: { value: 85, change: 18, context: 'Essais cliniques actifs', insight: 'L\'édition génétique entre en clinique', source: 'ClinicalTrials' }, refreshInterval: 86400, icon: Dna, valueFormat: 'number' },
  { id: '5g_coverage', title: 'Couverture 5G Monde', category: 'tech', rarity: 'uncommon', levelRequired: 19, data: { value: 42, change: 5, context: '% population couverte', insight: 'La 5G dépasse la 4G dans plusieurs pays', source: 'GSMA' }, refreshInterval: 86400, icon: Radio, valueFormat: 'percent' },

  // ===== NIVEAUX 21–29 =====
  { id: 'mars_missions', title: 'Missions Mars Planifiées', category: 'science', rarity: 'legendary', levelRequired: 21, data: { value: 8, change: 1, context: 'Missions 2024–2030', insight: 'Mars devient la prochaine frontière', source: 'NASA' }, refreshInterval: 86400, icon: Rocket, valueFormat: 'number' },
  { id: 'digital_twins', title: 'Jumeaux Numériques', category: 'tech', rarity: 'epic', levelRequired: 21, data: { value: 24, change: 6, context: 'Milliards $ marché 2024', insight: 'Répliques virtuelles des systèmes physiques', source: 'MarketsandMarkets' }, refreshInterval: 86400, icon: Database, valueFormat: 'currency_usd' },
  { id: 'lab_meat', title: 'Viande de Labo', category: 'science', rarity: 'epic', levelRequired: 22, data: { value: 0.5, change: 0.2, context: 'Milliards $ marché', insight: 'La viande cultivée sort des labos', source: 'GFI' }, refreshInterval: 86400, icon: Syringe, valueFormat: 'currency_usd' },
  { id: 'blockchain_energy', title: 'Énergie Blockchain', category: 'tech', rarity: 'rare', levelRequired: 22, data: { value: 120, change: -15, context: 'TWh/an (estimation)', insight: 'Le passage au PoS réduit la consommation', source: 'Cambridge' }, refreshInterval: 86400, icon: Zap, valueFormat: 'number' },
  { id: 'ar_glasses', title: 'Lunettes AR (ventes)', category: 'tech', rarity: 'epic', levelRequired: 23, data: { value: 4.2, change: 1.8, context: 'Millions d\'unités 2024', insight: 'L\'AR grand public prend son envol', source: 'IDC' }, refreshInterval: 86400, icon: Tv, valueFormat: 'number' },
  { id: 'longevity_funding', title: 'Financement Longévité', category: 'science', rarity: 'legendary', levelRequired: 23, data: { value: 5.8, change: 1.2, context: 'Milliards $ investis', insight: 'La science anti-âge attire les capitaux', source: 'Longevity.Technology' }, refreshInterval: 86400, icon: Heart, valueFormat: 'currency_usd' },
  { id: 'vertical_farms', title: 'Fermes Verticales', category: 'science', rarity: 'rare', levelRequired: 24, data: { value: 4.2, change: 0.9, context: 'Milliards $ marché', insight: 'L\'agriculture en ville se développe', source: 'Grand View' }, refreshInterval: 86400, icon: TreePine, valueFormat: 'currency_usd' },
  { id: 'brain_implants', title: 'Implants Cérébraux', category: 'tech', rarity: 'mythic', levelRequired: 24, data: { value: 50, change: 12, context: 'Patients (BCI commerciaux)', insight: 'Neuralink et autres ouvrent la voie', source: 'Neuralink' }, refreshInterval: 86400, icon: Brain, valueFormat: 'number' },
  { id: 'nuclear_smr', title: 'SMR Nucléaires', category: 'science', rarity: 'epic', levelRequired: 25, data: { value: 12, change: 3, context: 'Projets en construction', insight: 'Les petits réacteurs modulaires avancent', source: 'IAEA' }, refreshInterval: 86400, icon: Atom, valueFormat: 'number' },
  { id: 'ai_agents', title: 'Agents IA Autonomes', category: 'tech', rarity: 'legendary', levelRequired: 25, data: { value: 2.1, change: 0.8, context: 'Milliards $ dépensés en R&D', insight: 'Les agents qui agissent seuls émergent', source: 'McKinsey' }, refreshInterval: 86400, icon: Cpu, valueFormat: 'currency_usd' },
  { id: 'exoplanets', title: 'Exoplanètes Découvertes', category: 'science', rarity: 'legendary', levelRequired: 26, data: { value: 5600, change: 240, context: 'Confirmées à ce jour', insight: 'James Webb multiplie les découvertes', source: 'NASA' }, refreshInterval: 86400, icon: Telescope, valueFormat: 'number' },
  { id: 'robotics_hr', title: 'Robots (milliers)', category: 'tech', rarity: 'epic', levelRequired: 26, data: { value: 550, change: 45, context: 'Installés annuellement (industrie)', insight: 'La robotique dépasse l\'automobile', source: 'IFR' }, refreshInterval: 86400, icon: Cpu, valueFormat: 'number' },
  { id: 'carbon_capture', title: 'Capture CO₂ (Mt/an)', category: 'science', rarity: 'epic', levelRequired: 27, data: { value: 45, change: 12, context: 'Capacité mondiale', insight: 'DAC et stockage géologique progressent', source: 'IEA' }, refreshInterval: 86400, icon: TreePine, valueFormat: 'number' },
  { id: 'semiconductor_capex', title: 'Capex Semi-conducteurs', category: 'finance', rarity: 'mythic', levelRequired: 27, data: { value: 220, change: 35, context: 'Milliards $ 2024', insight: 'Les géants investissent massivement', source: 'SEMI' }, refreshInterval: 86400, icon: Cpu, valueFormat: 'currency_usd' },
  { id: 'space_tourism', title: 'Tourisme Spatial', category: 'science', rarity: 'mythic', levelRequired: 28, data: { value: 42, change: 8, context: 'Passagers à ce jour', insight: 'Blue Origin et SpaceX ouvrent l\'espace', source: 'SpaceX' }, refreshInterval: 86400, icon: Rocket, valueFormat: 'number' },
  { id: 'agritech_market', title: 'AgriTech Monde', category: 'tech', rarity: 'rare', levelRequired: 28, data: { value: 28, change: 5, context: 'Milliards $ marché', insight: 'Capteurs et IA dans les champs', source: 'MarketsandMarkets' }, refreshInterval: 86400, icon: TreePine, valueFormat: 'currency_usd' },
  { id: 'consciousness_research', title: 'Recherche Conscience', category: 'science', rarity: 'mythic', levelRequired: 29, data: { value: 0.8, change: 0.2, context: 'Milliards $ (neuro + IA)', insight: 'Comprendre l\'émergence de la conscience', source: 'NIH' }, refreshInterval: 86400, icon: Brain, valueFormat: 'currency_usd' },
  { id: 'superapps', title: 'Super Apps (MAU)', category: 'tech', rarity: 'epic', levelRequired: 29, data: { value: 2.1, change: 0.3, context: 'Milliards (WeChat, etc.)', insight: 'Tout-en-un : paiement, social, services', source: 'eMarketer' }, refreshInterval: 86400, icon: Users, valueFormat: 'number' },

  // ===== NIVEAUX 31–39 =====
  { id: 'lunar_base', title: 'Base Lunaire', category: 'exclusive', rarity: 'mythic', levelRequired: 31, data: { value: 2030, change: 0, context: 'Année cible Artemis', insight: 'Humains de retour sur la Lune', source: 'NASA' }, refreshInterval: 86400, icon: Rocket, valueFormat: 'number' },
  { id: 'synthetic_biology', title: 'Biologie Synthétique', category: 'science', rarity: 'legendary', levelRequired: 31, data: { value: 18, change: 4, context: 'Milliards $ marché', insight: 'Créer la vie à partir du code', source: 'Grand View' }, refreshInterval: 86400, icon: Dna, valueFormat: 'currency_usd' },
  { id: 'zero_trust_market', title: 'Zero Trust', category: 'tech', rarity: 'epic', levelRequired: 32, data: { value: 32, change: 8, context: 'Milliards $ 2024', insight: 'Jamais faire confiance, toujours vérifier', source: 'Gartner' }, refreshInterval: 86400, icon: Shield, valueFormat: 'currency_usd' },
  { id: 'ocean_mining', title: 'Mines Sous-Marines', category: 'science', rarity: 'rare', levelRequired: 32, data: { value: 0, change: 0, context: 'Exploitations commerciales', insight: 'Réglementation en débat', source: 'ISA' }, refreshInterval: 86400, icon: Ship, valueFormat: 'number' },
  { id: 'agi_timeline', title: 'AGI (année prédite)', category: 'exclusive', rarity: 'mythic', levelRequired: 33, data: { value: 2029, change: 0, context: 'Prédictions expertes médianes', insight: 'L\'IA générale approche selon certains', source: 'Surveys' }, refreshInterval: 86400, icon: Cpu, valueFormat: 'number' },
  { id: 'bionic_limbs', title: 'Membres Bioniques', category: 'science', rarity: 'epic', levelRequired: 33, data: { value: 3.2, change: 0.6, context: 'Milliards $ marché', insight: 'Prothèses connectées et sensibles', source: 'Grand View' }, refreshInterval: 86400, icon: Heart, valueFormat: 'currency_usd' },
  { id: 'quantum_network', title: 'Réseau Quantique', category: 'tech', rarity: 'mythic', levelRequired: 34, data: { value: 4, change: 1, context: 'Pays avec déploiement', insight: 'Communication inviolable en essor', source: 'Nature' }, refreshInterval: 86400, icon: Atom, valueFormat: 'number' },
  { id: 'climate_adaptation', title: 'Adaptation Climat', category: 'science', rarity: 'epic', levelRequired: 34, data: { value: 65, change: 12, context: 'Milliards $ investis', insight: 'Villes et régions s\'adaptent', source: 'CPI' }, refreshInterval: 86400, icon: Sun, valueFormat: 'currency_usd' },
  { id: 'space_economy', title: 'Économie Spatiale', category: 'exclusive', rarity: 'mythic', levelRequired: 35, data: { value: 447, change: 45, context: 'Milliards $ 2024', insight: 'Satellites, lancements, services', source: 'Space Capital' }, refreshInterval: 86400, icon: Satellite, valueFormat: 'currency_usd' },
  { id: 'nanomedicine', title: 'Nanomédecine', category: 'science', rarity: 'legendary', levelRequired: 35, data: { value: 12, change: 2.5, context: 'Milliards $ marché', insight: 'Nanoparticules pour cibler les tumeurs', source: 'Allied' }, refreshInterval: 86400, icon: Pill, valueFormat: 'currency_usd' },
  { id: 'digital_currency_cbdc', title: 'CBDC (pays)', category: 'finance', rarity: 'epic', levelRequired: 36, data: { value: 130, change: 15, context: 'En développement ou lancés', insight: 'Les banques centrales passent au digital', source: 'Atlantic Council' }, refreshInterval: 86400, icon: Banknote, valueFormat: 'number' },
  { id: 'emotional_ai', title: 'IA Émotionnelle', category: 'tech', rarity: 'legendary', levelRequired: 36, data: { value: 4.2, change: 1.1, context: 'Milliards $ marché', insight: 'Reconnaissance et synthèse des émotions', source: 'MarketsandMarkets' }, refreshInterval: 86400, icon: Brain, valueFormat: 'currency_usd' },
  { id: 'antimatter_research', title: 'Antimatière', category: 'exclusive', rarity: 'mythic', levelRequired: 37, data: { value: 0.000017, change: 0, context: 'g stockées (CERN)', insight: 'La matière la plus chère du monde', source: 'CERN' }, refreshInterval: 86400, icon: Atom, valueFormat: 'number' },
  { id: 'regenerative_med', title: 'Médecine Régénérative', category: 'science', rarity: 'legendary', levelRequired: 37, data: { value: 8.5, change: 1.8, context: 'Milliards $ marché', insight: 'Régénération d\'organes et tissus', source: 'Grand View' }, refreshInterval: 86400, icon: Stethoscope, valueFormat: 'currency_usd' },
  { id: 'time_crystals', title: 'Cristaux de Temps', category: 'science', rarity: 'mythic', levelRequired: 38, data: { value: 1, change: 0, context: 'État confirmé en labo', insight: 'Nouvelle phase de la matière', source: 'Nature' }, refreshInterval: 86400, icon: Atom, valueFormat: 'number' },
  { id: 'superintelligence_ethics', title: 'Éthique Super-IA', category: 'tech', rarity: 'mythic', levelRequired: 38, data: { value: 42, change: 8, context: 'Organisations dédiées', insight: 'Alignement et gouvernance de l\'IA', source: 'AI Safety' }, refreshInterval: 86400, icon: Shield, valueFormat: 'number' },
  { id: 'multiverse_research', title: 'Multivers (papiers)', category: 'exclusive', rarity: 'mythic', levelRequired: 39, data: { value: 1200, change: 180, context: 'Publications scientifiques', insight: 'Théories et simulations en hausse', source: 'arXiv' }, refreshInterval: 86400, icon: Telescope, valueFormat: 'number' },
  { id: 'bio_printing', title: 'Bio-impression', category: 'science', rarity: 'legendary', levelRequired: 39, data: { value: 1.8, change: 0.5, context: 'Milliards $ marché', insight: 'Imprimer des tissus et organes', source: 'Allied' }, refreshInterval: 86400, icon: Syringe, valueFormat: 'currency_usd' },

  // ===== NIVEAUX 41–49 =====
  { id: 'conscious_ai_debate', title: 'IA Consciente ?', category: 'exclusive', rarity: 'mythic', levelRequired: 41, data: { value: '?', change: 0, context: 'Débat scientifique ouvert', insight: 'Critères et mesures en construction', source: 'Phil. of Mind' }, refreshInterval: 86400, icon: Brain, valueFormat: 'raw' },
  { id: 'wormhole_theory', title: 'Trous de Ver', category: 'science', rarity: 'mythic', levelRequired: 41, data: { value: 0, change: 0, context: 'Traversables (observés)', insight: 'Théoriquement possibles, non observés', source: 'arXiv' }, refreshInterval: 86400, icon: Telescope, valueFormat: 'number' },
  { id: 'et_contact', title: 'Contact ET', category: 'exclusive', rarity: 'mythic', levelRequired: 42, data: { value: 0, change: 0, context: 'Signaux confirmés', insight: 'Recherche active (SETI, etc.)', source: 'SETI' }, refreshInterval: 86400, icon: Radio, valueFormat: 'number' },
  { id: 'immortality_tech', title: 'Tech Longévité', category: 'science', rarity: 'mythic', levelRequired: 42, data: { value: 0.001, change: 0, context: 'Réversibilité âge (stade)', insight: 'Recherche sur l\'épigénétique', source: 'Altos' }, refreshInterval: 86400, icon: Heart, valueFormat: 'number' },
  { id: 'black_hole_image', title: 'Images Trous Noirs', category: 'science', rarity: 'mythic', levelRequired: 43, data: { value: 2, change: 0, context: 'Trous noirs imagés', insight: 'M87* et Sgr A*', source: 'EHT' }, refreshInterval: 86400, icon: Telescope, valueFormat: 'number' },
  { id: 'mind_upload', title: 'Téléchargement d\'Esprit', category: 'exclusive', rarity: 'mythic', levelRequired: 43, data: { value: 0, change: 0, context: 'Réalisations à ce jour', insight: 'Frontière spéculative de la neurotech', source: 'Fiction' }, refreshInterval: 86400, icon: Brain, valueFormat: 'number' },
  { id: 'dark_energy', title: 'Énergie Sombre', category: 'science', rarity: 'mythic', levelRequired: 44, data: { value: 68, change: 0, context: '% de l\'univers', insight: 'Composition de l\'univers encore mystérieuse', source: 'Planck' }, refreshInterval: 86400, icon: Atom, valueFormat: 'percent' },
  { id: 'grand_unified', title: 'Théorie Unifiée', category: 'exclusive', rarity: 'mythic', levelRequired: 44, data: { value: 0, change: 0, context: 'Théories validées', insight: 'Graal de la physique théorique', source: 'CERN' }, refreshInterval: 86400, icon: Atom, valueFormat: 'number' },
  { id: 'cryonics_patients', title: 'Cryonie (patients)', category: 'science', rarity: 'mythic', levelRequired: 45, data: { value: 350, change: 8, context: 'Personnes en conservation', insight: 'Espoir de réveil futur', source: 'Alcor' }, refreshInterval: 86400, icon: Heart, valueFormat: 'number' },
  { id: 'dyson_sphere', title: 'Sphère de Dyson', category: 'exclusive', rarity: 'mythic', levelRequired: 45, data: { value: 0, change: 0, context: 'Candidats observés', insight: 'Recherche de mégastructures ET', source: 'SETI' }, refreshInterval: 86400, icon: Sun, valueFormat: 'number' },
  { id: 'entanglement_km', title: 'Intrication (km)', category: 'science', rarity: 'mythic', levelRequired: 46, data: { value: 1200, change: 200, context: 'Distance record', insight: 'Téléportation quantique à longue distance', source: 'Nature' }, refreshInterval: 86400, icon: Atom, valueFormat: 'number' },
  { id: 'post_human', title: 'Post-Humain', category: 'exclusive', rarity: 'mythic', levelRequired: 46, data: { value: '?', change: 0, context: 'Définition en débat', insight: 'Au-delà de l\'humain biologique', source: 'Transhumanism' }, refreshInterval: 86400, icon: Users, valueFormat: 'raw' },
  { id: 'omega_point', title: 'Point Omega', category: 'exclusive', rarity: 'mythic', levelRequired: 47, data: { value: '∞', change: 0, context: 'Concept Teilhard de Chardin', insight: 'Complexité maximale de la conscience', source: 'Philosophy' }, refreshInterval: 86400, icon: Idea, valueFormat: 'raw' },
  { id: 'boltzmann_brain', title: 'Cerveau de Boltzmann', category: 'science', rarity: 'mythic', levelRequired: 47, data: { value: '?', change: 0, context: 'Paradoxe cosmologique', insight: 'Probabilité vs observation', source: 'arXiv' }, refreshInterval: 86400, icon: Brain, valueFormat: 'raw' },
  { id: 'final_answer', title: 'Réponse Définitive', category: 'exclusive', rarity: 'mythic', levelRequired: 48, data: { value: 42, change: 0, context: 'Référence culturelle', insight: 'Guide du voyageur galactique', source: 'Adams' }, refreshInterval: 86400, icon: Idea, valueFormat: 'number' },
  { id: 'heat_death', title: 'Mort Thermique', category: 'science', rarity: 'mythic', levelRequired: 48, data: { value: '10^100', change: 0, context: 'Années (ordre de grandeur)', insight: 'Fin hypothétique de l\'univers', source: 'Cosmology' }, refreshInterval: 86400, icon: Sun, valueFormat: 'raw' },
  { id: 'noesis_omega', title: 'NOESIS Ω', category: 'exclusive', rarity: 'mythic', levelRequired: 49, data: { value: 'Ω', change: 0, context: 'Niveau ultime d\'accès', insight: 'Toutes les données à portée de main', source: BRAND.appName }, refreshInterval: 86400, icon: Crown, valueFormat: 'raw' },
  { id: 'infinite_loop', title: 'Boucle Infinie', category: 'exclusive', rarity: 'mythic', levelRequired: 49, data: { value: '∞', change: 0, context: 'Découvertes sans fin', insight: 'La curiosité n\'a pas de limite', source: BRAND.appName }, refreshInterval: 86400, icon: Sparkles, valueFormat: 'raw' },
];

// Composant Widget — données réelles quand dispo, sinon indicatives ; progression via quiz (XP)
type RealtimeStatus = 'loading' | 'realtime' | 'indicative';

function DataWidgetCard({ widget, isLocked = false, fillHeight = false, onLockedClick }: { widget: DataWidget; isLocked?: boolean; fillHeight?: boolean; onLockedClick?: (widget: DataWidget) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [widgetData, setWidgetData] = useState(widget.data);
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>(
    REALTIME_WIDGET_IDS.includes(widget.id) ? 'loading' : 'indicative'
  );
  const updateStats = useProgressStore(s => s.updateStats);
  const isRealtimeWidget = REALTIME_WIDGET_IDS.includes(widget.id);

  // Chargement initial : temps réel si l'API répond, sinon on affiche l'indicatif (jamais bloqué sur "Chargement…")
  useEffect(() => {
    if (isLocked || !isRealtimeWidget) return;
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      if (cancelled) return;
      setRealtimeStatus(s => (s === 'loading' ? 'indicative' : s));
    }, 5000);
    fetchRealtimeForWidget(widget.id).then(quote => {
      if (cancelled) return;
      if (quote) {
        setWidgetData(prev => ({
          ...prev,
          value: quote.value,
          change: quote.change,
          context: quote.context,
          source: quote.source,
        }));
        setRealtimeStatus('realtime');
      } else {
        setRealtimeStatus('indicative');
      }
    }).catch(() => {
      if (!cancelled) setRealtimeStatus('indicative');
    }).finally(() => {
      clearTimeout(timeout);
    });
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [widget.id, isLocked, isRealtimeWidget]);

  const refreshData = async () => {
    if (isLocked) return;
    setIsRefreshing(true);
    if (isRealtimeWidget) {
      try {
        const quote = await fetchRealtimeForWidget(widget.id);
        if (quote) {
          setWidgetData(prev => ({
            ...prev,
            value: quote.value,
            change: quote.change,
            context: quote.context,
            source: quote.source,
          }));
          setRealtimeStatus('realtime');
        } else {
          setRealtimeStatus('indicative');
          setWidgetData(prev => ({ ...prev, change: (prev.change ?? 0) + (Math.random() - 0.5) * 2 }));
        }
      } catch {
        setRealtimeStatus('indicative');
        setWidgetData(prev => ({ ...prev, change: (prev.change ?? 0) + (Math.random() - 0.5) * 2 }));
      }
    } else {
      setTimeout(() => {
        setWidgetData(prev => ({ ...prev, change: (Math.random() - 0.5) * 5 }));
        setIsRefreshing(false);
      }, 800);
      const current = useProgressStore.getState().stats.dataPointsViewed;
      updateStats({ dataPointsViewed: current + 1 });
      return;
    }
    const current = useProgressStore.getState().stats.dataPointsViewed;
    updateStats({ dataPointsViewed: current + 1 });
    setIsRefreshing(false);
  };

  const handleExpand = () => {
    if (isLocked) return;
    const next = !isExpanded;
    setIsExpanded(next);
    if (next) {
      const current = useProgressStore.getState().stats.dataPointsViewed;
      updateStats({ dataPointsViewed: current + 1 });
    }
  };
  
  const getRarityColor = () => {
    switch (widget.rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-emerald-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      case 'mythic': return 'text-rose-400';
      default: return 'text-gray-400';
    }
  };
  
  const getRarityBg = () => {
    switch (widget.rarity) {
      case 'common': return 'bg-gray-500/10 border-gray-500/20';
      case 'uncommon': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'rare': return 'bg-blue-500/10 border-blue-500/20';
      case 'epic': return 'bg-purple-500/10 border-purple-500/20';
      case 'legendary': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'mythic': return 'bg-rose-500/10 border-rose-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };
  
  const Icon = widget.icon;
  
  if (isLocked) {
    const content = (
      <>
        <Lock className="w-6 h-6 text-gray-600 mb-2 mx-auto" />
        <p className="text-[10px] text-gray-500 text-center">
          Niv. {widget.levelRequired}
        </p>
        <p className="text-[10px] text-gray-600 text-center truncate">
          {widget.title}
        </p>
      </>
    );
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-xl p-3 bg-[#0a0a0a] border border-white/5 opacity-50',
          onLockedClick && 'cursor-pointer hover:opacity-70 hover:border-white/10 transition-all active:scale-[0.98]'
        )}
        role={onLockedClick ? 'button' : undefined}
        onClick={onLockedClick ? () => onLockedClick(widget) : undefined}
      >
        {content}
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02]",
        "bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a]",
        "border",
        getRarityBg(),
        fillHeight && "h-full flex flex-col"
      )}
      onClick={handleExpand}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className={cn("p-1 rounded", getRarityBg())}>
            <Icon className={cn("w-3.5 h-3.5", getRarityColor())} />
          </div>
          <span className={cn("text-[9px] uppercase tracking-wider font-semibold", getRarityColor())}>
            {widget.rarity}
          </span>
          {isRealtimeWidget && (
            <span
              className={cn(
                "text-[8px] px-1.5 py-0.5 rounded font-medium",
                realtimeStatus === 'realtime' && "bg-emerald-500/20 text-emerald-400",
                realtimeStatus === 'indicative' && "bg-amber-500/10 text-amber-400/90",
                realtimeStatus === 'loading' && "bg-gray-500/20 text-gray-400"
              )}
              title={realtimeStatus === 'indicative' ? 'Valeur indicative — API non disponible ou pas de clé (ex. Alpha Vantage pour les indices)' : realtimeStatus === 'realtime' ? 'Donnée mise à jour depuis l\'API' : undefined}
            >
              {realtimeStatus === 'realtime' ? 'Temps réel' : realtimeStatus === 'indicative' ? 'Indicatif' : 'Chargement…'}
            </span>
          )}
          {!isRealtimeWidget && (
            <span
              className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400/90 font-medium"
              title="Valeur indicative, pas le cours en direct (différent de Boursorama, etc.)"
            >
              Indicatif
            </span>
          )}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            refreshData();
          }}
          className={cn(
            "p-1 rounded hover:bg-white/5 transition-colors",
            isRefreshing && "animate-spin"
          )}
        >
          <RefreshCw className="w-3 h-3 text-gray-500" />
        </button>
      </div>
      
      {/* Title */}
      <h3 className="font-semibold text-xs text-white mb-1 truncate">{widget.title}</h3>
      
      {/* Main Value — format unifié type Boursorama : "23 461,82 Pts", "1,2 %" */}
      <div className="mb-1">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {formatValue(widgetData.value, widget.valueFormat, {
              decimals: widget.valueDecimals,
              ratioMax: widget.valueRatioMax,
            })}
          </span>
          {widgetData.change !== undefined && widgetData.change !== 0 && (
            <span className={cn(
              "flex items-center text-[10px]",
              widgetData.change > 0 ? "text-green-400" : "text-red-400"
            )}>
              {widgetData.change > 0 ? (
                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
              )}
              {formatPercent(Math.abs(widgetData.change), 1)}
            </span>
          )}
        </div>
        <p className="text-[9px] text-gray-500 truncate">{widgetData.context}</p>
        <p className="text-[8px] text-gray-600 truncate">Source: {widgetData.source}</p>
        {(!isRealtimeWidget || realtimeStatus === 'indicative') && (
          <p className="text-[7px] text-amber-500/80 truncate mt-0.5">Valeur indicative — pas le cours en direct</p>
        )}
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-white/5">
          <div className="flex items-start gap-1.5 mb-1">
            <Info className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-gray-400 leading-relaxed">{widgetData.insight}</p>
          </div>
          <p className="text-[9px] text-gray-600">Source: {widgetData.source}</p>
        </div>
      )}
    </div>
  );
}

// Carte widget réordonnable : par défaut immergée (sans grip/X) ; maintien long → affiche grip + X pour réorganiser/retirer
function SortableWidgetCard({
  widget,
  onRemove,
  showEditControls,
  onLongPress,
}: {
  widget: DataWidget;
  onRemove: (id: string) => void;
  showEditControls: boolean;
  onLongPress: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: widget.id,
    transition: { duration: 200, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    minHeight: 'var(--card-min-height, 140px)',
  };

  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };
  const handlePointerDown = () => {
    if (showEditControls) return;
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      onLongPress();
    }, 500);
  };
  const handlePointerUp = clearLongPress;
  const handlePointerLeave = clearLongPress;
  useEffect(() => () => clearLongPress(), []);

  if (!showEditControls) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onContextMenu={(e) => e.preventDefault()}
      >
        <DataWidgetCard widget={widget} />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="relative h-full flex flex-col">
      <button
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-lg touch-none text-gray-500 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
        aria-label="Réorganiser"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(widget.id); }}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-red-500/20 active:bg-red-500/30 transition-colors"
        aria-label="Retirer du tableau"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="pl-8 pr-8 flex-1 min-h-0 flex flex-col">
        <DataWidgetCard widget={widget} fillHeight />
      </div>
    </div>
  );
}

// Mapping icônes succès (store utilise des strings)
const ACHIEVEMENT_ICONS: Record<string, React.ElementType> = {
  footprints: Star,
  search: Target,
  'bar-chart-2': Database,
  clock: Clock,
  key: Crown,
  eye: Target,
  crown: Award,
  sun: Trophy,
  'check-circle': CheckCircle,
  zap: Zap,
  target: Target,
  atom: Atom,
  globe: Globe,
  cpu: Cpu,
  flame: Flame,
};

// Modal Succès — liée au store, affiche la progression réelle
function AchievementsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { achievements, level, stats, discoveredSecrets } = useProgressStore();
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  const getProgress = (ach: (typeof achievements)[0]) => {
    if (ach.unlockedAt) return { current: 1, target: 1, label: 'Débloqué' };
    switch (ach.condition.type) {
      case 'level': return { current: level, target: ach.condition.value, label: `Niveau ${level}/${ach.condition.value}` };
      case 'data_viewed': return { current: stats.dataPointsViewed, target: ach.condition.value, label: `${stats.dataPointsViewed}/${ach.condition.value} données` };
      case 'time': return { current: stats.timeSpent, target: ach.condition.value, label: `${stats.timeSpent}/${ach.condition.value} min` };
      case 'secrets': return { current: discoveredSecrets.length, target: ach.condition.value, label: `${discoveredSecrets.length}/${ach.condition.value} secrets` };
      case 'quiz_correct': return { current: Math.min(stats.quizCorrect, ach.condition.value), target: ach.condition.value, label: `${stats.quizCorrect}/${ach.condition.value} bonnes réponses` };
      case 'quiz_streak': return { current: Math.min(stats.bestQuizStreak, ach.condition.value), target: ach.condition.value, label: `Meilleure série ${stats.bestQuizStreak}/${ach.condition.value}` };
      case 'quiz_series': return { current: Math.min(stats.quizSeriesCompleted, ach.condition.value), target: ach.condition.value, label: `${stats.quizSeriesCompleted}/${ach.condition.value} série(s) complétée(s)` };
      case 'category_correct': {
        const cat = (ach.condition as { category?: string }).category ?? '';
        const cur = stats.categoryCorrect[cat] ?? 0;
        const label = QUIZ_CATEGORY_LABELS[cat] ? `${QUIZ_CATEGORY_LABELS[cat]} ${cur}/${ach.condition.value}` : `${cur}/${ach.condition.value}`;
        return { current: Math.min(cur, ach.condition.value), target: ach.condition.value, label };
      }
      case 'streak': return { current: Math.min(stats.streakDaysQuiz, ach.condition.value), target: ach.condition.value, label: `Série ${stats.streakDaysQuiz}/${ach.condition.value} jours` };
      default: return { current: 0, target: 1, label: ach.description };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Succès</h2>
            <p className="text-xs text-gray-400">Vos accomplissements — {unlockedCount} / {achievements.length} débloqués</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
      <p className="text-[11px] text-gray-500 mb-4">Chaque succès débloqué vous récompense en XP (Commun 35 → Mythique 750 XP). Quiz, niveau, secrets, exploration.</p>
      <div className="space-y-3">
        {achievements.map(ach => {
          const Icon = ACHIEVEMENT_ICONS[ach.icon] || Star;
          const progress = getProgress(ach);
          const unlocked = !!ach.unlockedAt;
          return (
            <div
              key={ach.id}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border transition-all",
                unlocked ? "bg-yellow-500/10 border-yellow-500/30" : "bg-[#0a0a0a] border-white/10 opacity-90"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                unlocked ? "bg-yellow-500/20" : "bg-gray-800"
              )}>
                <Icon className={cn("w-5 h-5", unlocked ? "text-yellow-400" : "text-gray-500")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("font-medium text-sm", unlocked ? "text-yellow-200" : "text-gray-400")}>{ach.name}</p>
                <p className="text-xs text-gray-500">{ach.description}</p>
                {!unlocked && progress.target > 1 && (
                  <p className="text-[10px] text-blue-400 mt-1">{progress.label}</p>
                )}
              </div>
              {unlocked ? (
                <span className="text-[10px] font-semibold text-yellow-400">✓</span>
              ) : (
                <Lock className="w-4 h-4 text-gray-600 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// Types pour les défis (icône + action suggérée)
type ChallengeAction = 'quiz' | 'explorer' | 'data' | 'streak' | 'achievement' | null;

// Modal Défis — personnalisé pour profils data/quiz/culture : sections, barres de progression, CTAs
function ChallengesModal({
  isOpen,
  onClose,
  exploredCategoriesCount,
  completedChallenges,
  onLaunchQuiz,
  onGoToExplorer,
}: {
  isOpen: boolean;
  onClose: () => void;
  exploredCategoriesCount: number;
  completedChallenges: Set<string>;
  onLaunchQuiz?: () => void;
  onGoToExplorer?: () => void;
}) {
  const { stats, achievements } = useProgressStore();
  const hasUnlockedAchievement = achievements.some(a => a.unlockedAt);

  const challenges: { id: string; name: string; desc: string; xp: number; current: number; target: number; icon: React.ElementType; action: ChallengeAction }[] = [
    { id: 'quiz_series', name: 'Série complète', desc: 'Terminer une série de 5 questions au quiz', xp: 30, current: stats.quizSeriesCompleted, target: 1, icon: Target, action: 'quiz' },
    { id: 'quiz_streak', name: 'Série de 3', desc: 'Enchaîner 3 bonnes réponses d\'affilée', xp: 25, current: Math.min(stats.bestQuizStreak, 3), target: 3, icon: Zap, action: 'quiz' },
    { id: 'quiz_10', name: '10 bonnes réponses', desc: 'Totaliser 10 bonnes réponses au quiz (cumul)', xp: 50, current: Math.min(stats.quizCorrect, 10), target: 10, icon: Target, action: 'quiz' },
    { id: 'explore_3', name: 'Explorateur', desc: 'Explorer 3 catégories de données différentes', xp: 30, current: Math.min(exploredCategoriesCount, 3), target: 3, icon: Globe, action: 'explorer' },
    { id: 'data_10', name: 'Curieux', desc: 'Consulter 10 données sur le tableau de bord', xp: 25, current: Math.min(stats.dataPointsViewed, 10), target: 10, icon: Database, action: 'data' },
    { id: 'streak_3', name: 'Régularité', desc: '3 jours consécutifs avec au moins une série quiz', xp: 40, current: Math.min(stats.streakDaysQuiz, 3), target: 3, icon: Flame, action: 'streak' },
    { id: 'achiever', name: 'Accomplisseur', desc: 'Débloquer un succès (Succès)', xp: 50, current: hasUnlockedAchievement ? 1 : 0, target: 1, icon: Trophy, action: 'achievement' },
  ];

  const completed = challenges.filter(c => completedChallenges.has(c.id));
  const pending = challenges.filter(c => !completedChallenges.has(c.id));
  const nextChallenge = pending[0];

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#080808] text-white safe-area-top safe-area-bottom">
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Target className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Défis</h2>
              <p className="text-xs text-gray-400">
                {completed.length} / {challenges.length} complétés
                {stats.streakDaysQuiz > 0 && (
                  <span className="ml-2 text-amber-400">· Série {stats.streakDaysQuiz} jour{stats.streakDaysQuiz > 1 ? 's' : ''}</span>
                )}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white" aria-label="Fermer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CTAs principaux */}
        <div className="flex gap-2 mb-5">
          {onLaunchQuiz && (
            <button
              type="button"
              onClick={onLaunchQuiz}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center gap-2"
            >
              <Target className="w-4 h-4" />
              Quiz
            </button>
          )}
          {onGoToExplorer && (
            <button
              type="button"
              onClick={onGoToExplorer}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm bg-white/10 text-white border border-white/20 hover:bg-white/15 flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Explorer
            </button>
          )}
        </div>

        {/* Prochain défi mis en avant */}
        {nextChallenge && (
          <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/30">
            <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-2">Prochain défi</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                <nextChallenge.icon className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{nextChallenge.name}</p>
                <p className="text-xs text-gray-400">{nextChallenge.desc}</p>
                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500/80 transition-all"
                    style={{ width: `${Math.min(100, (nextChallenge.current / nextChallenge.target) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-amber-400 mt-1">{nextChallenge.current} / {nextChallenge.target}</p>
              </div>
              <span className="text-xs font-bold text-amber-400 shrink-0">+{nextChallenge.xp} XP</span>
            </div>
            <div className="mt-3 flex gap-2">
              {nextChallenge.action === 'quiz' && onLaunchQuiz && (
                <button type="button" onClick={onLaunchQuiz} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500/30 text-amber-200 hover:bg-amber-500/50">
                  Lancer le quiz
                </button>
              )}
              {nextChallenge.action === 'explorer' && onGoToExplorer && (
                <button type="button" onClick={onGoToExplorer} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-500/30 text-blue-200 hover:bg-blue-500/50">
                  Ouvrir l&apos;Explorer
                </button>
              )}
            </div>
          </div>
        )}

        {/* Liste des défis — À relever (sauf le prochain déjà mis en avant) */}
        {pending.filter(c => c.id !== nextChallenge?.id).length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">À relever</h3>
            <div className="space-y-2">
              {pending.filter(c => c.id !== nextChallenge?.id).map(c => {
                const progress = Math.min(c.current, c.target);
                const pct = c.target > 0 ? (progress / c.target) * 100 : 0;
                return (
                  <div
                    key={c.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all",
                      "bg-[#0f0f0f] border-white/10"
                    )}
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <c.icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white">{c.name}</p>
                      <p className="text-[11px] text-gray-500">{c.desc}</p>
                      <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500/60 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">{progress} / {c.target}</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-400 shrink-0">+{c.xp} XP</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Complétés */}
        {completed.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Complétés</h3>
            <div className="space-y-2">
              {completed.map(c => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-emerald-200">{c.name}</p>
                    <p className="text-[11px] text-gray-500">{c.desc}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 shrink-0">+{c.xp} XP ✓</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Modal Politique de confidentialité (conformité RGPD)
function PrivacyPolicyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-black/95 py-2 -mx-4 px-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Politique de confidentialité
        </h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10" aria-label="Fermer">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="prose prose-invert prose-sm max-w-none text-gray-300 space-y-4">
        <p className="text-xs text-gray-400">
          Dernière mise à jour : applicable en Europe (RGPD) et à l&apos;international. Cette politique décrit comment {BRAND.appName} traite vos données.
        </p>
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">1. Responsable du traitement</h3>
          <p className="text-xs">{LEGAL.dataControllerName}.</p>
        </section>
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">2. Données collectées</h3>
          <p className="text-xs">
            Les données suivantes sont stockées <strong>uniquement sur votre appareil</strong> (stockage local) : prénom (optionnel), progression (niveau, XP, succès, statistiques de quiz), préférences d&apos;affichage (thème, couleurs), configuration du tableau de bord. Aucune donnée personnelle n&apos;est envoyée à nos serveurs ni à des tiers à des fins de ciblage ou de publicité.
          </p>
        </section>
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">3. Finalité et base légale</h3>
          <p className="text-xs">
            Le traitement a pour finalité la fourniture du service (quiz, données, personnalisation). Base légale : exécution du contrat et intérêt légitime (RGPD, art. 6).
          </p>
        </section>
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">4. Durée de conservation</h3>
          <p className="text-xs">
            Les données sont conservées sur votre appareil tant que l&apos;application est installée. Vous pouvez les supprimer à tout moment via Paramètres → Supprimer toutes mes données.
          </p>
        </section>
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">5. Vos droits</h3>
          <p className="text-xs">
            Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, à la portabilité des données et d&apos;opposition. Vous pouvez exporter vos données (Paramètres → Exporter mes données) ou les supprimer (Paramètres → Supprimer toutes mes données). Vous pouvez introduire une réclamation auprès de la CNIL (France) ou de l&apos;autorité de contrôle de votre pays.
          </p>
        </section>
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">6. Pas de vente, pas de profilage</h3>
          <p className="text-xs">
            Nous ne vendons pas vos données. Aucun profilage automatisé à des fins marketing. Les APIs tierces (données de marché) ne reçoivent aucune donnée personnelle les identifiant.
          </p>
        </section>
        <section>
          <h3 className="text-sm font-semibold text-white mb-2">7. Contact</h3>
          <p className="text-xs">
            {LEGAL.privacyContactEmail ? `Pour exercer vos droits : ${LEGAL.privacyContactEmail}` : 'Pour exercer vos droits, consultez les informations de contact dans l\'application ou sur la page d\'accueil du site.'}
          </p>
        </section>
      </div>
    </div>
  );
}

// Modal Paramètres
function SettingsModal({ isOpen, onClose, onOpenPaywall, onOpenLifetimePaywall, onOpenPrivacy, effectivePremium, effectiveLifetime }: { isOpen: boolean; onClose: () => void; onOpenPaywall?: () => void; onOpenLifetimePaywall?: () => void; onOpenPrivacy: () => void; effectivePremium: boolean; effectiveLifetime: boolean }) {
  const { firstName, setFirstName, resetProgress } = useProgressStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportData = () => {
    const state = useProgressStore.getState();
    const dataKeys = ['level', 'xp', 'totalXp', 'xpToNextLevel', 'achievements', 'unlockedFeatures', 'discoveredSecrets', 'stats', 'customizations', 'isPremium', 'isLifetime', 'widgetOrder', 'dashboardWidgetIds', 'firstName'] as const;
    const exportData = Object.fromEntries(dataKeys.map(k => [k, (state as unknown as Record<string, unknown>)[k]]));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noesis-donnees-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAllData = () => {
    resetProgress();
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Paramètres</h2>
            <p className="text-xs text-gray-400">Configuration de l'app</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="space-y-4">
        {onOpenPaywall && (
          <div className="p-4 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent">
            <p className="font-medium text-white text-sm mb-2">Abonnement</p>
            {effectiveLifetime ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-amber-500/30 text-amber-200">Membre à vie</span>
                <span className="text-xs text-gray-400">Tout débloqué, pour toujours.</span>
              </div>
            ) : effectivePremium ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-400">Vous êtes Pro</span>
                {onOpenLifetimePaywall && (
                  <button type="button" onClick={onOpenLifetimePaywall} className="text-xs text-amber-400 hover:text-amber-300 underline flex items-center gap-1">
                    Découvrir l&apos;offre Lifetime
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button type="button" onClick={onOpenPaywall} className="w-full py-2.5 rounded-lg text-sm font-medium bg-amber-500/20 text-amber-200 border border-amber-500/30 hover:bg-amber-500/30 transition-colors">
                  Passer en Pro
                </button>
                {onOpenLifetimePaywall && (
                  <button
                    type="button"
                    onClick={onOpenLifetimePaywall}
                    className="w-full py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-200 border border-amber-500/40 hover:border-amber-500/60 transition-all flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>NOESIS Lifetime — Accès à vie</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-500/50">
                      Exclusif
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10">
          <label htmlFor="settings-firstname" className="font-medium text-white text-sm mb-2 block">
            Prénom
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Affiché dans « Bienvenue, … » sur le Dashboard et sur votre carte de profil (onglet Profil). Vide = « Initié ». Sauvegardé automatiquement. Vous pouvez aussi modifier votre prénom depuis l'onglet Profil.
          </p>
          <input
            id="settings-firstname"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Initié"
            maxLength={50}
            autoComplete="given-name"
            className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-white/10 text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none text-sm"
          />
        </div>
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10">
          <p className="font-medium text-white text-sm mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            Confidentialité et données (RGPD)
          </p>
          <div className="flex flex-col gap-2">
            {LEGAL.privacyPolicyUrl ? (
              <a href={LEGAL.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 underline">
                Politique de confidentialité
              </a>
            ) : (
              <button type="button" onClick={onOpenPrivacy} className="text-left text-xs text-blue-400 hover:text-blue-300 underline">
                Politique de confidentialité
              </button>
            )}
            <button type="button" onClick={handleExportData} className="text-left text-xs text-gray-300 hover:text-white">
              Exporter mes données
            </button>
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className="text-left text-xs text-red-400 hover:text-red-300">
              Supprimer toutes mes données
            </button>
          </div>
        </div>
        {showDeleteConfirm && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10">
            <p className="text-sm text-white mb-2">Supprimer toutes vos données ?</p>
            <p className="text-xs text-gray-400 mb-3">Votre progression, succès, prénom et préférences seront effacés définitivement sur cet appareil.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 rounded-lg text-sm bg-white/10 text-white border border-white/20">
                Annuler
              </button>
              <button type="button" onClick={handleDeleteAllData} className="flex-1 py-2 rounded-lg text-sm bg-red-500/30 text-red-200 border border-red-500/50">
                Supprimer
              </button>
            </div>
          </div>
        )}
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10">
          <p className="font-medium text-white text-sm mb-1">Notifications</p>
          <p className="text-xs text-gray-500">Activer les rappels de défis</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10">
          <p className="font-medium text-white text-sm mb-1">Données</p>
          <p className="text-xs text-gray-500">Rafraîchissement et cache</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10">
          <p className="font-medium text-white text-sm mb-1">À propos</p>
          <p className="text-xs text-gray-500">{BRAND.aboutText}</p>
        </div>
      </div>
    </div>
  );
}

// Type pour la navigation
type TabView = 'dashboard' | 'explorer' | 'profil';

// Catégories uniques des widgets (pour Explorer)
const WIDGET_CATEGORIES = Array.from(new Set(WIDGETS.map(w => w.category))).sort();

/** Libellés des catégories pour l'Explorer (affichage utilisateur) */
const WIDGET_CATEGORY_LABELS: Record<string, string> = {
  art: 'Art',
  crypto: 'Crypto',
  culture: 'Culture',
  demographics: 'Démographie',
  ecology: 'Vivant & Écologie',
  education: 'Éducation',
  energy: 'Énergie',
  exclusive: 'Exclusif',
  finance: 'Finance',
  food: 'Alimentation',
  geopolitics: 'Géopolitique',
  health: 'Santé',
  media: 'Médias',
  philosophy: 'Philosophie',
  real_estate: 'Immobilier',
  science: 'Science',
  sport: 'Sport',
  tech: 'Tech',
  transport: 'Transport',
};

/** Profils de tableau de bord : configurations par défaut par persona (libre à l'utilisateur de choisir ou personnaliser) */
const DASHBOARD_PRESETS: {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  widgetIds: string[];
}[] = [
  {
    id: 'all',
    name: 'Tous les débloqués',
    description: 'Afficher toutes les données que vous avez débloquées',
    icon: Database,
    widgetIds: [], // vide = tout afficher
  },
  {
    id: 'financier',
    name: 'Le Financier',
    description: 'Indices, crypto, devises, matières premières, taux',
    icon: Banknote,
    widgetIds: ['sp500', 'nasdaq', 'cac40', 'eurusd', 'gold', 'oil', 'bitcoin', 'ethereum', 'fed_rate', 'inflation', 'unemployment', 'gdp'],
  },
  {
    id: 'globe_trotter',
    name: 'Le Globe-trotter',
    description: 'Géopolitique, transport, démographie, culture',
    icon: Globe,
    widgetIds: ['geopolitical', 'conflicts', 'population', 'aviation_pax', 'shipping', 'box_office', 'streaming_subs', 'literacy', 'urbanization', 'megacities'],
  },
  {
    id: 'visionnaire',
    name: 'Le Visionnaire',
    description: 'Tech, IA, espace, science, futur',
    icon: Rocket,
    widgetIds: ['ai_funding', 'quantum', 'space', 'semiconductor', 'quantum_supremacy', 'singularity', 'nft', 'publications', 'arxiv', 'satellite'],
  },
  {
    id: 'ecocitoyen',
    name: "L'Écocitoyen",
    description: 'Climat, énergie, biodiversité, santé, transition',
    icon: TreePine,
    widgetIds: ['climate', 'temperature', 'renewable', 'solar', 'ev', 'batteries', 'life_expectancy', 'biodiversity', 'fusion', 'ice'],
  },
  {
    id: 'vivant_ecologie',
    name: 'Vivant & Écologie',
    description: 'Crise écologique, vivant, véganisme, mode durable, tendances',
    icon: Heart,
    widgetIds: ['co2_global', 'deforestation', 'plastic_pollution', 'vegan_market', 'sustainable_fashion', 'species_at_risk', 'organic_farming', 'green_bonds', 'climate', 'biodiversity'],
  },
  {
    id: 'curieux',
    name: 'Le Curieux',
    description: 'Culture, philosophie, art, éducation, idées',
    icon: BookOpen,
    widgetIds: ['box_office', 'wisdom_daily', 'publications', 'art_market', 'book_sales', 'happiness', 'literacy', 'pisa', 'consciousness', 'music_industry'],
  },
  {
    id: 'sportif',
    name: 'Le Sportif',
    description: 'Transferts, Jeux, audiences, valorisations',
    icon: Trophy,
    widgetIds: ['football_transfers', 'olympics', 'sport_audience', 'club_valuation'],
  },
];

// Widgets qui se débloquent au niveau donné (pour afficher "Au niveau X vous débloquerez...")
function getWidgetsUnlockingAtLevel(level: number) {
  return WIDGETS.filter(w => w.levelRequired === level).map(w => w.title);
}

// Conseils dynamiques selon la progression — l'utilisateur n'est jamais bloqué
type ProgressionTip = {
  id: string;
  label: string;
  sublabel?: string;
  xp: number;
  priority: number; // plus haut = affiché en premier
  action?: 'open_detail' | 'refresh' | 'explorer' | 'challenges' | 'quiz' | 'wait';
};

function getProgressionTips(
  _xpNeeded: number,
  _dataPointsViewed: number,
  _exploredCategoriesCount: number,
  completedChallenges: Set<string>
): ProgressionTip[] {
  const tips: ProgressionTip[] = [];

  // Quiz — principale source d'XP (intellectuelle)
  tips.push({
    id: 'quiz',
    label: 'Répondez au Quiz Noesis (finance, science, géo, tech, culture)',
    sublabel: '15–35 XP par bonne réponse · Série de 3 → +10 XP · 5 questions → +25 XP bonus',
    xp: 25,
    priority: 100,
    action: 'quiz',
  });

  // Défi "Série de 5" (quiz)
  if (!completedChallenges.has('quiz_series')) {
    tips.push({
      id: 'challenge_quiz_series',
      label: 'Complétez une série de 5 questions au quiz',
      sublabel: 'Défi « Série complète » → +30 XP',
      xp: 30,
      priority: 85,
      action: 'quiz',
    });
  }

  // Défi "Série de 3 correctes"
  if (!completedChallenges.has('quiz_streak')) {
    tips.push({
      id: 'challenge_quiz_streak',
      label: 'Enchaînez 3 bonnes réponses d\'affilée au quiz',
      sublabel: 'Défi « Série de 3 » → +25 XP',
      xp: 25,
      priority: 80,
      action: 'quiz',
    });
  }

  // Défi "10 bonnes réponses"
  if (!completedChallenges.has('quiz_10')) {
    tips.push({
      id: 'challenge_quiz_10',
      label: 'Totalisez 10 bonnes réponses au quiz (cumul)',
      sublabel: 'Défi « 10 bonnes réponses » → +50 XP',
      xp: 50,
      priority: 75,
      action: 'quiz',
    });
  }

  // Explorer une catégorie (découverte, pas d'XP pour éviter le "numb")
  tips.push({
    id: 'explore_one',
    label: 'Explorez les catégories (onglet Explorer) pour découvrir les widgets',
    sublabel: 'Découvrez finance, science, géopolitique, tech, culture',
    xp: 0,
    priority: 40,
    action: 'explorer',
  });

  // Défis (modal)
  tips.push({
    id: 'challenges',
    label: 'Consultez les Défis (bouton ci-dessous) et lancez le quiz',
    sublabel: '+25 à +50 XP selon le défi',
    xp: 30,
    priority: 30,
    action: 'challenges',
  });

  return tips.sort((a, b) => b.priority - a.priority);
}

// Bloc "Comment progresser" — conseils dynamiques, jamais bloquant ; croix discard comme le reste du dashboard
function ProgressionBlock({
  xpNeeded,
  nextLevel,
  nextLevelUnlocks,
  nextLevelFeatureNames,
  stats,
  exploredCategoriesCount,
  completedChallenges,
  onGoToExplorer,
  onShowChallenges,
  onShowQuiz,
  onDismiss,
}: {
  xpNeeded: number;
  nextLevel: number;
  nextLevelUnlocks: string[];
  nextLevelFeatureNames: string[];
  stats: { dataPointsViewed: number; timeSpent: number; quizCorrect?: number; quizAnswered?: number };
  exploredCategoriesCount: number;
  completedChallenges: Set<string>;
  onGoToExplorer: () => void;
  onShowChallenges: () => void;
  onShowQuiz: () => void;
  onDismiss?: () => void;
}) {
  const [showAllWays, setShowAllWays] = useState(false);
  const tips = getProgressionTips(xpNeeded, stats.dataPointsViewed, exploredCategoriesCount, completedChallenges);
  const mainTip = tips[0];
  const otherTips = tips.slice(1, 4);

  return (
    <div className="relative mb-6 p-4 pr-10 rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10">
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-2 top-2 p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/10 transition-colors"
          aria-label="Masquer"
          title="Masquer (réapparaît quand vous quittez le dashboard)"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-blue-400" />
        Comment progresser
      </h3>
      <p className="text-xs text-gray-400 mb-3">
        Plus que <span className="font-semibold text-white">{xpNeeded} XP</span> pour le niveau {nextLevel} — chaque défi relevé vous rapproche du but.
      </p>

      {/* Conseil principal — mis à jour selon la progression */}
      {mainTip && (
        <div className="mb-3 p-3 rounded-lg bg-white/5 border border-blue-500/20">
          <p className="text-[11px] font-medium text-blue-200 mb-0.5">Prochaine étape</p>
          <p className="text-sm text-white mb-1">{mainTip.label}</p>
          {mainTip.sublabel && (
            <p className="text-[10px] text-emerald-400/90">{mainTip.sublabel}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {mainTip.action === 'explorer' && (
              <button
                type="button"
                onClick={onGoToExplorer}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-500/30 text-blue-200 hover:bg-blue-500/50 transition-colors"
              >
                Aller à Explorer
              </button>
            )}
            {mainTip.action === 'challenges' && (
              <button
                type="button"
                onClick={onShowChallenges}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-500/30 text-blue-200 hover:bg-blue-500/50 transition-colors"
              >
                Voir les Défis
              </button>
            )}
            {mainTip.action === 'quiz' && (
              <button
                type="button"
                onClick={onShowQuiz}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-amber-500/30 text-amber-200 hover:bg-amber-500/50 transition-colors"
              >
                Lancer le Quiz
              </button>
            )}
            {(mainTip.action === 'open_detail' || mainTip.action === 'refresh') && (
              <span className="text-[10px] text-gray-500">→ Utilisez les cartes ci-dessous</span>
            )}
          </div>
        </div>
      )}

      {/* Autres options — toujours au moins 2 autres façons visibles */}
      {otherTips.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-gray-500 mb-1.5">Autres façons de gagner de l'XP :</p>
          <ul className="space-y-1.5">
            {otherTips.map(t => (
              <li key={t.id} className="flex items-start gap-2 text-[11px] text-gray-400">
                <ChevronRight className="w-3 h-3 text-blue-400/80 flex-shrink-0 mt-0.5" />
                <span>{t.label} <span className="text-emerald-400/90 font-medium">+{t.xp} XP</span></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Repliable : toutes les façons */}
      <div>
        <button
          type="button"
          onClick={() => setShowAllWays(!showAllWays)}
          className="text-[10px] text-gray-500 hover:text-gray-400 flex items-center gap-1"
        >
          {showAllWays ? 'Masquer le rappel' : 'Comment être récompensé'}
        </button>
        {showAllWays && (
          <ul className="text-[11px] text-gray-500 space-y-1 mt-2 pt-2 border-t border-white/5">
            <li className="flex items-center gap-2">Quiz : bonne réponse : <span className="text-amber-400">+15 à +35 XP</span> (selon difficulté)</li>
            <li className="flex items-center gap-2">Quiz : 3 bonnes d&apos;affilée : <span className="text-amber-400">+10 XP</span> bonus</li>
            <li className="flex items-center gap-2">Quiz : série de 5 questions : <span className="text-amber-400">+25 XP</span> bonus</li>
            <li className="flex items-center gap-2">Défis (série, 10 réponses, etc.) : <span className="text-emerald-400">+25 à +50 XP</span></li>
            <li className="flex items-center gap-2">Succès débloqués : <span className="text-yellow-400">+35 à +750 XP</span> (selon rareté)</li>
          </ul>
        )}
      </div>

      {(nextLevelUnlocks.length > 0 || nextLevelFeatureNames.length > 0) && (
        <div className="pt-3 mt-3 border-t border-white/5">
          <p className="text-[10px] text-gray-500 mb-1">Au niveau {nextLevel} vous débloquerez :</p>
          {nextLevelUnlocks.length > 0 && (
            <p className="text-[11px] text-gray-400">
              Données : {nextLevelUnlocks.slice(0, 5).join(', ')}
              {nextLevelUnlocks.length > 5 && ` +${nextLevelUnlocks.length - 5} autres`}
            </p>
          )}
          {nextLevelFeatureNames.length > 0 && (
            <p className="text-[11px] text-emerald-400/90 mt-0.5">
              Fonctionnalités : {nextLevelFeatureNames.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// App principale — progression via le store (XP, level, stats)
export default function App() {
  const { level, xp, xpToNextLevel, addXp, updateStats, stats, getProgressPercentage, achievements, isPremium, isLifetime, customizations, firstName, setFirstName, widgetOrder, setWidgetOrder, dashboardWidgetIds, setDashboardWidgetIds, lastDiscoveredSecretId, clearLastDiscoveredSecret, lastUnlockedAchievementId, clearLastUnlockedAchievement, unlockedFeatures, discoveredSecrets } = useProgressStore();
  const progress = getProgressPercentage();
  const [currentView, setCurrentView] = useState<TabView>('dashboard');
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);

  // Appliquer les customizations sauvegardées au chargement et à chaque changement
  useEffect(() => {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    if (customizations.theme && customizations.theme !== 'dark') {
      document.body.classList.add(`theme-${customizations.theme}`);
    }
    const accentHex = (customizations.accentColor ?? '').trim() || '#3b82f6';
    const hsl = hexToHsl(/^#?[a-f\d]{6}$/i.test(accentHex) ? accentHex : '#3b82f6');
    document.documentElement.style.setProperty('--primary', hsl);
    document.documentElement.style.setProperty('--accent', hsl);
    document.documentElement.style.setProperty('--ring', hsl);
  }, [customizations.theme, customizations.accentColor]);

  useEffect(() => {
    document.body.className = document.body.className.replace(/font-style-\w+/g, '');
    const fontClass = customizations.fontStyle === 'classic' ? 'font-style-classic' : customizations.fontStyle === 'mono' ? 'font-style-mono' : 'font-style-modern';
    document.body.classList.add(fontClass);
  }, [customizations.fontStyle]);

  useEffect(() => {
    if (customizations.animations) {
      document.body.classList.remove('no-motion');
    } else {
      document.body.classList.add('no-motion');
    }
  }, [customizations.animations]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 100, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleWidgetDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const dashboard = getDashboardWidgets();
    const ids = dashboard.map(w => w.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    const newOrder = arrayMove(ids, oldIndex, newIndex);
    if (dashboardWidgetIds.length === 0) setWidgetOrder(newOrder);
    else setDashboardWidgetIds(newOrder);
  };
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLifetimePaywall, setShowLifetimePaywall] = useState(false);
  const [dashboardEditMode, setDashboardEditMode] = useState(false);
  const [explorerCategory, setExplorerCategory] = useState<string | null>(null);
  const [exploredCategories, setExploredCategories] = useState<Set<string>>(new Set());
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [showLevelUpCelebration, setShowLevelUpCelebration] = useState<number | null>(null);
  const [curiosityMessage, setCuriosityMessage] = useState(false);
  const [showSecretMenu, setShowSecretMenu] = useState(false);
  const [devLevelOverride, setDevLevelOverride] = useState<number | null>(null);
  const [devLifetimeOverride, setDevLifetimeOverride] = useState(false);
  const [devPremiumOverride, setDevPremiumOverride] = useState<boolean | null>(null);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [devUnlocked, setDevUnlocked] = useState(false);
  const [showDevUnlockPrompt, setShowDevUnlockPrompt] = useState(false);
  const [devPasswordInput, setDevPasswordInput] = useState('');
  const [devPasswordError, setDevPasswordError] = useState(false);
  const [lockedCardCrypticMessage, setLockedCardCrypticMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showWelcomeTip, setShowWelcomeTip] = useState(() => typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('noesis_welcome_seen'));
  const [showProWelcome, setShowProWelcome] = useState(false);
  const [proReminderDismissed, setProReminderDismissed] = useState(() => typeof sessionStorage !== 'undefined' && !!sessionStorage.getItem('noesis_pro_reminder_dismissed'));
  /** Masqué par l'utilisateur pour nettoyer le dashboard ; réapparaît quand il quitte et revient (mode gratuit). */
  const [dashboardDiscardedPro, setDashboardDiscardedPro] = useState(false);
  const [dashboardDiscardedProgression, setDashboardDiscardedProgression] = useState(false);
  const prevLevelRef = useRef(0);
  const logoTapCountRef = useRef(0);
  const logoTapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoLongPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const levelBadgeTapCountRef = useRef(0);
  const levelBadgeTapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const secretMenuOpenedAtRef = useRef<number>(0);

  // Pathway cartes : déblocage strict par niveau — niveau effectif >= 1 (corruption / état invalide)
  // Mode développeur : devLevelOverride remplace level ; devLifetimeOverride / devPremiumOverride = prévisualiser abonnement (réversible)
  const effectiveLevel = Math.max(1, devLevelOverride ?? level);
  const effectiveLifetime = devLifetimeOverride || (devPremiumOverride === null && isLifetime);
  const effectivePremium = devLifetimeOverride || (devPremiumOverride !== null ? devPremiumOverride : isPremium);
  const getUnlockedWidgets = () => (effectiveLifetime ? WIDGETS : WIDGETS.filter(w => w.levelRequired <= effectiveLevel));
  const getOrderedUnlockedWidgets = (): DataWidget[] => {
    const unlocked = getUnlockedWidgets();
    const byId = new Map(unlocked.map(w => [w.id, w]));
    const result: DataWidget[] = [];
    for (const id of widgetOrder) {
      const w = byId.get(id);
      if (w) result.push(w);
    }
    for (const w of unlocked) {
      if (!widgetOrder.includes(w.id)) result.push(w);
    }
    return result;
  };
  const getDashboardWidgets = (): DataWidget[] => {
    const unlocked = getOrderedUnlockedWidgets();
    if (dashboardWidgetIds.length === 0) return unlocked;
    const byId = new Map(unlocked.map(w => [w.id, w]));
    const result: DataWidget[] = [];
    for (const id of dashboardWidgetIds) {
      const w = byId.get(id);
      if (w) result.push(w);
    }
    return result;
  };
  const getWidgetsNotOnDashboard = (): DataWidget[] => {
    const unlocked = getUnlockedWidgets();
    if (dashboardWidgetIds.length === 0) return [];
    const onDashboard = new Set(dashboardWidgetIds);
    return unlocked.filter(w => !onDashboard.has(w.id));
  };
  const handleRemoveFromDashboard = (id: string) => {
    const widget = getDashboardWidgets().find(w => w.id === id);
    const title = widget?.title ?? 'cette donnée';
    if (!window.confirm(`Retirer « ${title} » du tableau de bord ?`)) return;
    const current = getDashboardWidgets().map(w => w.id);
    setDashboardWidgetIds(current.filter(i => i !== id));
  };
  const handleAddToDashboard = (id: string) => {
    const current = getDashboardWidgets().map(w => w.id);
    if (current.includes(id)) return;
    if (dashboardWidgetIds.length === 0) {
      setDashboardWidgetIds([...getOrderedUnlockedWidgets().map(w => w.id), id]);
    } else {
      setDashboardWidgetIds([...current, id]);
    }
    setShowAddWidgetModal(false);
    setToastMessage('Ajouté au tableau de bord');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Détecter un level up pour afficher la célébration (pas au premier rendu)
  useEffect(() => {
    if (level > prevLevelRef.current && prevLevelRef.current > 0) {
      setShowLevelUpCelebration(level);
    }
    prevLevelRef.current = level;
  }, [level]);

  // Synchroniser le temps passé avec le store (chaque minute) — pas d'XP, juste stats
  useEffect(() => {
    const interval = setInterval(() => {
      updateStats({ timeSpent: stats.timeSpent + 1 });
    }, 60000);
    return () => clearInterval(interval);
  }, [updateStats, stats.timeSpent]);

  // Auto-dismiss du toast succès débloqué après 4 s
  useEffect(() => {
    if (lastUnlockedAchievementId == null) return;
    const t = setTimeout(() => clearLastUnlockedAchievement(), 4000);
    return () => clearTimeout(t);
  }, [lastUnlockedAchievementId, clearLastUnlockedAchievement]);

  // En quittant le dashboard : désactiver réorganisation et réafficher CTA Pro + bloc progression + rappel Pro au prochain retour (gratuit)
  useEffect(() => {
    if (currentView !== 'dashboard') {
      setDashboardEditMode(false);
      setDashboardDiscardedPro(false);
      setDashboardDiscardedProgression(false);
      setProReminderDismissed(false);
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('noesis_pro_reminder_dismissed');
    }
  }, [currentView]);

  // Défis : bonus XP une fois par défi (quiz, exploration, données, streak, succès)
  useEffect(() => {
    if (stats.quizSeriesCompleted >= 1 && !completedChallenges.has('quiz_series')) {
      addXp(30, 'challenge_quiz_series');
      setCompletedChallenges(prev => new Set(prev).add('quiz_series'));
    }
    if (stats.bestQuizStreak >= 3 && !completedChallenges.has('quiz_streak')) {
      addXp(25, 'challenge_quiz_streak');
      setCompletedChallenges(prev => new Set(prev).add('quiz_streak'));
    }
    if (stats.quizCorrect >= 10 && !completedChallenges.has('quiz_10')) {
      addXp(50, 'challenge_quiz_10');
      setCompletedChallenges(prev => new Set(prev).add('quiz_10'));
    }
    if (exploredCategories.size >= 3 && !completedChallenges.has('explore_3')) {
      addXp(30, 'challenge_explore_3');
      setCompletedChallenges(prev => new Set(prev).add('explore_3'));
    }
    if (stats.dataPointsViewed >= 10 && !completedChallenges.has('data_10')) {
      addXp(25, 'challenge_data_10');
      setCompletedChallenges(prev => new Set(prev).add('data_10'));
    }
    if (stats.streakDaysQuiz >= 3 && !completedChallenges.has('streak_3')) {
      addXp(40, 'challenge_streak_3');
      setCompletedChallenges(prev => new Set(prev).add('streak_3'));
    }
    const hasUnlockedAchievement = achievements.some(a => a.unlockedAt);
    if (hasUnlockedAchievement && !completedChallenges.has('achiever')) {
      addXp(50, 'challenge_achiever');
      setCompletedChallenges(prev => new Set(prev).add('achiever'));
    }
  }, [stats.quizSeriesCompleted, stats.bestQuizStreak, stats.quizCorrect, stats.dataPointsViewed, stats.streakDaysQuiz, exploredCategories.size, achievements, completedChallenges, addXp]);

  const getLockedWidgets = () => (effectiveLifetime ? [] : WIDGETS.filter(w => w.levelRequired > effectiveLevel).slice(0, 4));
  const nextLevelUnlocks = getWidgetsUnlockingAtLevel(effectiveLevel + 1);
  const nextLevelFeatureNames = (unlockedFeatures ?? [])
    .filter(f => f.levelRequired === effectiveLevel + 1 && !f.hidden)
    .map(f => f.name);
  const xpToNextLevelFor = (l: number) => Math.floor(100 * Math.pow(1.5, l - 1));
  const displayXp = devLevelOverride != null ? 0 : (devLifetimeOverride ? 0 : xp);
  const displayXpToNextLevel = devLevelOverride != null ? xpToNextLevelFor(effectiveLevel) : (devLifetimeOverride ? 1 : xpToNextLevel);
  const displayProgress = (devLevelOverride != null || devLifetimeOverride) ? 0 : progress;
  // En mode dev (prévisualisation niveau) : xpNeeded = XP minimum à faire dans ce niveau pour débloquer le suivant (barre à 0)
  const xpNeeded = (devLevelOverride != null || devLifetimeOverride)
    ? (displayXpToNextLevel - displayXp)
    : (xpToNextLevel - xp);
  
  const layout = customizations.layout;
  const cardMinHeight = layout === 'compact' ? '100px' : layout === 'expanded' ? '180px' : '140px';
  const mainPadding = layout === 'compact' ? 'p-2' : layout === 'expanded' ? 'p-6' : 'p-4';
  const dashboardGap = layout === 'compact' ? 'gap-2' : layout === 'expanded' ? 'gap-5' : 'gap-3';

  return (
    <div
      className="flex flex-col min-h-screen bg-[#050505] text-white relative"
      data-layout={layout}
      style={{ ['--card-min-height' as string]: cardMinHeight }}
    >
      {customizations.particleEffects && <ParticleBackground />}
      {/* Header */}
      <header className="flex-shrink-0 sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
        <div className="p-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3 relative">
            <button
              type="button"
              className="flex items-center gap-3 text-left touch-manipulation"
              onClick={() => {
                logoTapCountRef.current += 1;
                if (logoTapTimeoutRef.current) clearTimeout(logoTapTimeoutRef.current);
                logoTapTimeoutRef.current = setTimeout(() => {
                  logoTapCountRef.current = 0;
                  logoTapTimeoutRef.current = null;
                }, 2000);
                if (logoTapCountRef.current >= 5) {
                  setCuriosityMessage(true);
                  setTimeout(() => setCuriosityMessage(false), 4000);
                  logoTapCountRef.current = 0;
                }
              }}
              onTouchStart={() => {
                if (Date.now() - secretMenuOpenedAtRef.current < 1500) return;
                if (logoLongPressRef.current != null) return;
                logoLongPressRef.current = window.setTimeout(() => {
                  logoLongPressRef.current = null;
                  secretMenuOpenedAtRef.current = Date.now();
                  setShowSecretMenu(true);
                }, 700);
              }}
              onTouchEnd={() => {
                if (logoLongPressRef.current) {
                  clearTimeout(logoLongPressRef.current);
                  logoLongPressRef.current = null;
                }
              }}
              onContextMenu={(e) => e.preventDefault()}
              onTouchCancel={() => {
                if (logoLongPressRef.current) {
                  clearTimeout(logoLongPressRef.current);
                  logoLongPressRef.current = null;
                }
              }}
              onPointerDown={(e) => {
                if (e.pointerType === 'touch') return;
                if (Date.now() - secretMenuOpenedAtRef.current < 1500) return;
                if (logoLongPressRef.current != null) return;
                logoLongPressRef.current = window.setTimeout(() => {
                  logoLongPressRef.current = null;
                  secretMenuOpenedAtRef.current = Date.now();
                  setShowSecretMenu(true);
                }, 700);
              }}
              onPointerUp={() => {
                if (logoLongPressRef.current) {
                  clearTimeout(logoLongPressRef.current);
                  logoLongPressRef.current = null;
                }
              }}
              onPointerLeave={() => {
                if (logoLongPressRef.current) {
                  clearTimeout(logoLongPressRef.current);
                  logoLongPressRef.current = null;
                }
              }}
              onPointerCancel={() => {
                if (logoLongPressRef.current) {
                  clearTimeout(logoLongPressRef.current);
                  logoLongPressRef.current = null;
                }
              }}
            >
              <img
                src="/AppIcon-1024.png"
                alt=""
                className="app-logo-header w-10 h-10 rounded-xl object-cover shadow-lg shadow-black/40 ring-1 ring-white/10"
                width={40}
                height={40}
              />
              <div>
                <h1 className="text-lg font-bold tracking-tight">{BRAND.appName}</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{BRAND.tagline}</p>
              </div>
            </button>
            {curiosityMessage && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-medium text-center">
                La curiosité est la clé.
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold text-white shadow-lg touch-manipulation',
                  (devLevelOverride != null || devLifetimeOverride) ? 'bg-amber-600 shadow-amber-500/30' : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-blue-500/20'
                )}
                onClick={() => {
                  levelBadgeTapCountRef.current += 1;
                  if (levelBadgeTapTimeoutRef.current) clearTimeout(levelBadgeTapTimeoutRef.current);
                  levelBadgeTapTimeoutRef.current = setTimeout(() => {
                    levelBadgeTapCountRef.current = 0;
                    levelBadgeTapTimeoutRef.current = null;
                  }, 2000);
                  if (levelBadgeTapCountRef.current >= 10) {
                    levelBadgeTapCountRef.current = 0;
                    if (devUnlocked) {
                      setShowDevPanel(true);
                    } else {
                      setShowDevUnlockPrompt(true);
                      setDevPasswordInput('');
                      setDevPasswordError(false);
                    }
                  }
                }}
                title={devLifetimeOverride ? 'Prévisualisation Lifetime (tout débloqué)' : devLevelOverride != null ? `Prévisualisation niveau ${devLevelOverride}` : undefined}
              >
                <Zap className="w-4 h-4" />
                <span>{devLifetimeOverride ? '∞' : effectiveLevel}</span>
                {(devLevelOverride != null || devLifetimeOverride) && <span className="text-[10px] opacity-90">(dev)</span>}
              </button>
            </div>
          </div>
          
          {/* XP Bar — en mode dev (niveau prévisualisé), XP affiché = 0 pour ce niveau */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>{displayXp} XP</span>
              <span>{displayXpToNextLevel} XP</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content — scroll interne pour garantir le scroll jusqu'en bas (Dashboard, Explorer, Profil) */}
      <main
        className={cn(
          'main-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden max-w-lg mx-auto w-full',
          mainPadding
        )}
        style={{ paddingBottom: 'max(7.5rem, calc(env(safe-area-inset-bottom, 0px) + 6rem))' }}
      >
        {/* Tip de bienvenue (une fois par session) */}
        {showWelcomeTip && (
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-purple-500/15 to-blue-500/10 border border-purple-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white mb-1">Bienvenue sur NOESIS</p>
              <p className="text-xs text-gray-400 mb-3">
                Parcourez l&apos;Explorateur pour découvrir les données, jouez au Quiz pour gagner de l&apos;XP et débloquer de nouvelles cartes. Maintien long (0,7 s) sur le logo en haut pour les secrets.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('noesis_welcome_seen', '1');
                  setShowWelcomeTip(false);
                }}
                className="text-xs font-medium text-purple-300 hover:text-purple-200"
              >
                Compris
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('noesis_welcome_seen', '1');
                setShowWelcomeTip(false);
              }}
              className="p-1 rounded hover:bg-white/10 text-gray-500"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Vue Dashboard */}
        {currentView === 'dashboard' && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">
                Bienvenue, <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{firstName.trim() || 'Initié'}</span>
              </h2>
              <p className="text-gray-500 text-sm">
                Relevez des défis au quiz pour gagner de l&apos;XP et débloquer données et succès — chaque bonne réponse compte.
              </p>
            </div>

            {/* Quiz — principale source d'XP (intellectuelle) */}
            <button
              type="button"
              onClick={() => setShowQuiz(true)}
              className="w-full mb-4 p-4 rounded-xl text-left bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 hover:border-amber-500/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">Quiz Noesis</p>
                  <p className="text-xs text-gray-400">Relevez le défi : finance, science, géo, tech, culture. Chaque bonne réponse est récompensée (15–35 XP).</p>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400/80 flex-shrink-0" />
              </div>
            </button>

            {/* CTA Pro — données temps réel ; discardable pour nettoyer, réapparaît au retour sur le dashboard (gratuit) */}
            {!effectivePremium && !dashboardDiscardedPro && (
              <div className="relative mb-6 group">
                <button
                  type="button"
                  onClick={() => setShowPaywall(true)}
                  className="w-full p-3 pr-10 rounded-xl text-left bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-medium text-amber-200">Passer en Pro</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Indices + or/pétrole en temps réel</span>
                  <ChevronRight className="w-4 h-4 text-amber-400/70 flex-shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setDashboardDiscardedPro(true); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/10 transition-colors"
                  aria-label="Masquer"
                  title="Masquer (réapparaît quand vous quittez le dashboard)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Comment progresser — conseils orientés quiz + exploration ; croix discard comme le reste */}
            {!dashboardDiscardedProgression && (
              <ProgressionBlock
                xpNeeded={xpNeeded}
                nextLevel={effectiveLevel + 1}
                nextLevelUnlocks={nextLevelUnlocks}
                nextLevelFeatureNames={nextLevelFeatureNames}
                stats={stats}
                exploredCategoriesCount={exploredCategories.size}
                completedChallenges={completedChallenges}
                onGoToExplorer={() => setCurrentView('explorer')}
                onShowChallenges={() => setShowChallenges(true)}
                onShowQuiz={() => setShowQuiz(true)}
                onDismiss={() => setDashboardDiscardedProgression(true)}
              />
            )}
            
            <div className={cn('grid grid-cols-3 mb-6', dashboardGap)}>
              <div className="bg-[#0a0a0a] rounded-xl p-3 text-center border border-white/5">
                <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{getUnlockedWidgets().length}</p>
                <p className="text-[10px] text-gray-500">Data accessibles</p>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-3 text-center border border-white/5">
                <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{WIDGETS.length - getUnlockedWidgets().length}</p>
                <p className="text-[10px] text-gray-500">À débloquer</p>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-3 text-center border border-white/5">
                <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{Math.floor(stats.timeSpent / 60)}h</p>
                <p className="text-[10px] text-gray-500">Temps passé</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  Données en temps réel
                </h3>
                <div className="flex items-center gap-2">
                  {!dashboardEditMode && (
                    <button
                      type="button"
                      onClick={() => setDashboardEditMode(true)}
                      className="text-xs font-medium text-amber-300 hover:text-amber-200 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors flex items-center gap-1.5"
                      aria-label="Réorganiser les cartes"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                      Réorganiser
                    </button>
                  )}
                  <span className="text-xs text-gray-500">
                    {getDashboardWidgets().length} / {WIDGETS.length}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mb-3 flex items-center gap-1.5">
                {dashboardEditMode ? (
                  <>
                    <GripVertical className="w-3.5 h-3.5 text-gray-600" />
                    Glissez pour réorganiser · Retirez avec ✕ · Ajoutez avec +
                  </>
                ) : (
                  <>Maintien long sur une carte ou cliquez sur Réorganiser pour réorganiser ou retirer</>
                )}
              </p>
              {dashboardEditMode && (
                <div className="mb-3 flex items-center justify-between py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="text-xs font-medium text-amber-200">Mode réorganisation</span>
                  <button
                    type="button"
                    onClick={() => setDashboardEditMode(false)}
                    className="text-xs font-semibold text-amber-300 hover:text-amber-200 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
                  >
                    Terminer
                  </button>
                </div>
              )}
              <div className="text-[10px] text-gray-500 mb-3 space-y-1">
                {effectivePremium ? (
                  <p><span className="text-emerald-400/90">Pro</span> : toutes les données marchés affichées ici sont en temps réel (indices, or, pétrole inclus).</p>
                ) : hasAlphaVantageKey() ? (
                  <>
                    <p><span className="text-emerald-400/90">Temps réel</span> : Bitcoin, Ethereum, EUR/USD (CoinGecko, Frankfurter), S&P 500, NASDAQ, CAC 40 (votre clé Alpha Vantage). Autres : <span className="text-amber-400/90" title={INDICATIF_COPY.definition}>indicatif</span>.</p>
                    <p className="text-gray-500/90 italic">{INDICATIF_COPY.definition} {INDICATIF_COPY.lack} <button type="button" onClick={() => setShowPaywall(true)} className="text-amber-400/90 underline underline-offset-1 not-italic">Passer en Pro</button> pour tout débloquer sans config.</p>
                  </>
                ) : (
                  <>
                    <p><span className="text-emerald-400/90">Temps réel</span> : Bitcoin, Ethereum, EUR/USD (gratuit). <span className="text-amber-400/90" title={INDICATIF_COPY.definition}>Indicatif</span> : S&P 500, NASDAQ, CAC 40 — {INDICATIF_COPY.definition} Clé Alpha Vantage dans <code className="text-[9px] bg-white/10 px-1 rounded">.env</code> ou <button type="button" onClick={() => setShowPaywall(true)} className="text-amber-400/90 underline underline-offset-1">Pro</button> pour tout en temps réel.</p>
                    <p className="text-gray-500/90 italic">{INDICATIF_COPY.lack} <button type="button" onClick={() => setShowPaywall(true)} className="text-amber-400/90 underline underline-offset-1 not-italic">Passer en Pro</button> pour voir les marchés vivre.</p>
                  </>
                )}
              </div>
              {/* Rappel Pro soft (une fois par session, après quelques consultations) */}
              {!effectivePremium && stats.dataPointsViewed >= 3 && !proReminderDismissed && (
                <div className="mb-3 py-2.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2">
                  <p className="text-[11px] text-amber-200/90">
                    Vous consultez des données indicatives. En Pro : tout en temps réel.
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button type="button" onClick={() => setShowPaywall(true)} className="text-[11px] font-medium text-amber-300 hover:text-amber-200 underline underline-offset-1">Voir Pro</button>
                    <button type="button" onClick={() => { if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('noesis_pro_reminder_dismissed', '1'); setProReminderDismissed(true); }} className="text-[10px] text-gray-500 hover:text-gray-400">×</button>
                  </div>
                </div>
              )}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleWidgetDragEnd}
              >
                <SortableContext
                  items={getDashboardWidgets().map(w => w.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className={cn('grid grid-cols-2 items-stretch', dashboardGap)}>
                    {getDashboardWidgets().map(widget => (
                      <SortableWidgetCard
                        key={widget.id}
                        widget={widget}
                        onRemove={handleRemoveFromDashboard}
                        showEditControls={dashboardEditMode}
                        onLongPress={() => setDashboardEditMode(true)}
                      />
                    ))}
                    {getWidgetsNotOnDashboard().length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddWidgetModal(true)}
                        className="rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        style={{ minHeight: cardMinHeight }}
                      >
                        <Plus className="w-8 h-8" />
                        <span className="text-xs font-medium">Ajouter une donnée</span>
                      </button>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
            
            {getLockedWidgets().length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Prochainement
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {getLockedWidgets().map(widget => (
                    <DataWidgetCard
                      key={widget.id}
                      widget={widget}
                      isLocked
                      onLockedClick={() => setLockedCardCrypticMessage(getLockedCardMessage(widget.id, widget.levelRequired, widget.title))}
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-gray-600 mt-3">
                  Encore {effectiveLifetime ? 0 : Math.max(0, WIDGETS.filter(w => w.levelRequired > effectiveLevel).length - 4)} données à découvrir...
                </p>
              </div>
            )}
            
            <div className={cn('grid grid-cols-2', dashboardGap)}>
              <button
                onClick={() => setShowAchievements(true)}
                className="bg-[#0a0a0a] rounded-xl p-4 text-left border border-white/5 hover:border-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-3">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="font-semibold text-white text-sm">Succès</p>
                <p className="text-xs text-gray-500">Vos accomplissements</p>
              </button>
              <button
                onClick={() => setShowCustomize(true)}
                className="bg-[#0a0a0a] rounded-xl p-4 text-left border border-white/5 hover:border-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                  <Palette className="w-5 h-5 text-purple-400" />
                </div>
                <p className="font-semibold text-white text-sm">Personnaliser</p>
                <p className="text-xs text-gray-500">Thèmes et couleurs</p>
              </button>
              <button
                onClick={() => setShowChallenges(true)}
                className="bg-[#0a0a0a] rounded-xl p-4 text-left border border-white/5 hover:border-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
                <p className="font-semibold text-white text-sm">Défis</p>
                <p className="text-xs text-gray-500">Quiz et accomplissements — récompenses à la clé</p>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="bg-[#0a0a0a] rounded-xl p-4 text-left border border-white/5 hover:border-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mb-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                </div>
                <p className="font-semibold text-white text-sm">Paramètres</p>
                <p className="text-xs text-gray-500">Configuration</p>
              </button>
            </div>
          </>
        )}

        {/* Vue Explorer */}
        {currentView === 'explorer' && (
          <div className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-400" />
                Explorer
              </h2>
              <p className="text-gray-500 text-sm">
                Parcourez les données par catégorie. Choisissez un profil pour pré-remplir votre tableau de bord.
              </p>
            </div>

            {/* Profil de tableau de bord — presets par persona */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                Profil de tableau de bord
              </h3>
              <p className="text-[10px] text-gray-500 mb-3">
                Une sélection par défaut selon votre profil. Vous pouvez ensuite ajouter ou retirer des cartes depuis le dashboard.
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 scrollbar-thin">
                {DASHBOARD_PRESETS.map(preset => {
                  const Icon = preset.icon;
                  const isActive = preset.widgetIds.length === 0
                    ? dashboardWidgetIds.length === 0
                    : dashboardWidgetIds.length > 0 && preset.widgetIds.length > 0 &&
                      preset.widgetIds.every(id => dashboardWidgetIds.includes(id)) &&
                      dashboardWidgetIds.every(id => preset.widgetIds.includes(id));
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setDashboardWidgetIds(preset.widgetIds);
                        if (preset.widgetIds.length > 0) {
                          setWidgetOrder(preset.widgetIds);
                        }
                      }}
                      className={cn(
                        'flex-shrink-0 w-[140px] p-3 rounded-xl border text-left transition-all',
                        isActive
                          ? 'border-purple-500/50 bg-purple-500/10'
                          : 'border-white/10 bg-[#0a0a0a] hover:border-white/20 hover:bg-white/5'
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-2">
                        <Icon className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-xs font-semibold text-white truncate">{preset.name}</p>
                      <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">{preset.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {!explorerCategory ? (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white">Catégories</h3>
                <div className={cn('grid grid-cols-2', dashboardGap)}>
                {WIDGET_CATEGORIES.map(cat => {
                  const count = WIDGETS.filter(w => w.category === cat).length;
                  const unlocked = effectiveLifetime ? count : WIDGETS.filter(w => w.category === cat && w.levelRequired <= effectiveLevel).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        if (!exploredCategories.has(cat)) {
                          setExploredCategories(prev => new Set(prev).add(cat));
                        }
                        setExplorerCategory(cat);
                      }}
                      className="bg-[#0a0a0a] rounded-xl p-4 text-left border border-white/5 hover:border-white/20 transition-all"
                    >
                      <span className="text-sm font-semibold text-white">{WIDGET_CATEGORY_LABELS[cat] ?? cat}</span>
                      <p className="text-xs text-gray-500 mt-1">{unlocked} / {count} accessibles</p>
                    </button>
                  );
                })}
              </div>
            </div>
            ) : (
              <>
                <button
                  onClick={() => setExplorerCategory(null)}
                  className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-4"
                >
                  ← Retour aux catégories
                </button>
                <h3 className="text-sm font-semibold text-white mb-3">{WIDGET_CATEGORY_LABELS[explorerCategory] ?? explorerCategory}</h3>
                <p className="text-[10px] text-gray-500 mb-3">
                  Les données retirées du tableau restent débloquées ici ; ajoutez-les à l&apos;écran principal avec +.
                </p>
                <div className={cn('grid grid-cols-2', dashboardGap)}>
                  {WIDGETS.filter(w => w.category === explorerCategory).map(widget => {
                    const isUnlocked = effectiveLifetime || widget.levelRequired <= effectiveLevel;
                    const notOnDashboard = dashboardWidgetIds.length > 0 && !dashboardWidgetIds.includes(widget.id);
                    return (
                      <div key={widget.id} className="relative">
                        <DataWidgetCard
                          widget={widget}
                          isLocked={!isUnlocked}
                          onLockedClick={!isUnlocked ? () => setLockedCardCrypticMessage(getLockedCardMessage(widget.id, widget.levelRequired, widget.title)) : undefined}
                        />
                        {isUnlocked && notOnDashboard && (
                          <button
                            type="button"
                            onClick={() => handleAddToDashboard(widget.id)}
                            className="mt-2 w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Ajouter au tableau
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Vue Profil — accomplissements et récompenses (défis, quiz, succès) */}
        {currentView === 'profil' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <User className="w-6 h-6 text-purple-400" />
                Profil
              </h2>
              <p className="text-gray-500 text-sm">
                Vos accomplissements et récompenses — défi après défi.
              </p>
            </div>
            {/* Carte profil — identité, progression, actions */}
            <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-5 pb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/10">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <label htmlFor="profil-firstname" className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1.5">
                      Prénom
                    </label>
                    <input
                      id="profil-firstname"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Initié"
                      maxLength={50}
                      autoComplete="given-name"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0f0f0f] border border-white/10 text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none text-base font-semibold"
                    />
                    <p className="text-xs text-gray-500 mt-2">Niveau {level} · {xp} / {xpToNextLevel} XP</p>
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5 pt-0">
                <div className="rounded-xl bg-[#080808] border border-white/5 p-3">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                    <span>{xp} XP</span>
                    <span>{xpToNextLevel} XP</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSettings(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-gray-200 hover:bg-white/10 hover:border-white/20 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Réglages
                  </button>
                  {!effectiveLifetime && (
                    <button
                      type="button"
                      onClick={() => setShowLifetimePaywall(true)}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-amber-200/90 hover:text-amber-200 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/30 transition-colors"
                    >
                      <Crown className="w-4 h-4 text-amber-400/80" />
                      <span>Accès à vie</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Vos découvertes — récompenses cachées qui différencient l'app */}
            {discoveredSecrets.length > 0 && (
              <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Vos découvertes
                </h3>
                <p className="text-[10px] text-gray-500 mb-3">
                  Vous faites partie du petit nombre qui a trouvé ces secrets.
                </p>
                <div className="flex flex-wrap gap-2">
                  {discoveredSecrets.map((secretId) => {
                    const f = unlockedFeatures.find(u => u.id === secretId);
                    const name = f?.name ?? secretId;
                    return (
                      <span
                        key={secretId}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-xs font-medium text-purple-200"
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bloc Quiz & Défis — au cœur de la récompense */}
            <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-amber-400" />
                Quiz & Défis
              </h3>
              <p className="text-[10px] text-gray-400 mb-3">
                Chaque bonne réponse et chaque défi relevé vous rapproche du niveau suivant.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#0a0a0a]/80 rounded-lg p-3 text-center border border-white/5">
                  <p className="text-lg font-bold text-amber-400">{stats.quizCorrect}</p>
                  <p className="text-[10px] text-gray-500">Bonnes réponses</p>
                </div>
                <div className="bg-[#0a0a0a]/80 rounded-lg p-3 text-center border border-white/5">
                  <p className="text-lg font-bold text-amber-400">{stats.bestQuizStreak}</p>
                  <p className="text-[10px] text-gray-500">Meilleure série</p>
                </div>
                <div className="bg-[#0a0a0a]/80 rounded-lg p-3 text-center border border-white/5">
                  <p className="text-lg font-bold text-amber-400">{stats.quizSeriesCompleted}</p>
                  <p className="text-[10px] text-gray-500">Séries de 5</p>
                </div>
                <div className="bg-[#0a0a0a]/80 rounded-lg p-3 text-center border border-white/5">
                  <p className="text-lg font-bold text-amber-400">{stats.streakDaysQuiz}</p>
                  <p className="text-[10px] text-gray-500">Série (jours)</p>
                </div>
                <div className="bg-[#0a0a0a]/80 rounded-lg p-3 text-center border border-white/5 col-span-2">
                  <p className="text-lg font-bold text-emerald-400">{completedChallenges.size}/4</p>
                  <p className="text-[10px] text-gray-500">Défis complétés</p>
                </div>
              </div>
              {/* Maîtrise par catégorie — objectifs longs termes, respect de l'intelligence */}
              {Object.keys(stats.categoryCorrect).length > 0 && (
                <div className="mb-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Maîtrise par catégorie</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(QUIZ_CATEGORY_LABELS).map(([key, label]) => {
                      const cur = stats.categoryCorrect[key] ?? 0;
                      const target = 20;
                      const pct = Math.min(100, Math.floor((cur / target) * 100));
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 w-16 truncate">{label}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                            <div className="h-full rounded-full bg-amber-500/60 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-amber-400/90 tabular-nums">{cur}/{target}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1.5">20 bonnes réponses par catégorie = succès Maîtrise</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuiz(true)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-amber-500/20 text-amber-200 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                >
                  Lancer le Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setShowChallenges(true)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-white/20 text-white hover:bg-white/5 transition-colors"
                >
                  Voir les Défis
                </button>
              </div>
            </div>

            <div className={cn('grid grid-cols-2', dashboardGap)}>
              <div className="bg-[#0a0a0a] rounded-xl p-3 text-center border border-white/5">
                <p className="text-lg font-bold text-white">{getUnlockedWidgets().length}</p>
                <p className="text-[10px] text-gray-500">Données débloquées</p>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-3 text-center border border-white/5">
                <p className="text-lg font-bold text-white">{achievements.filter(a => a.unlockedAt).length}</p>
                <p className="text-[10px] text-gray-500">Succès débloqués</p>
              </div>
            </div>
            {/* Pro / Lifetime — statut et accès à vie (visible ici, pas caché dans Réglages) */}
            {(effectivePremium || effectiveLifetime) ? (
              <div className={cn(
                'rounded-xl p-4 border',
                'bg-amber-500/10 border-amber-500/30'
              )}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-500/20">
                      <Crown className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{BRAND.proName}</p>
                      <p className="text-xs text-gray-500">
                        {effectiveLifetime ? 'Tout débloqué — Membre à vie' : 'Données temps réel sans config'}
                      </p>
                    </div>
                  </div>
                  {effectiveLifetime ? (
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-amber-500/30 text-amber-200">Membre à vie</span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">Pro</span>
                  )}
                </div>
                {!effectiveLifetime && (
                  <button
                    type="button"
                    onClick={() => setShowLifetimePaywall(true)}
                    className="mt-3 w-full text-center text-xs text-amber-400 hover:text-amber-300 py-1.5 rounded-lg hover:bg-amber-500/10 transition-colors"
                  >
                    Découvrir l&apos;offre NOESIS Lifetime — Accès à vie
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-white/5 overflow-hidden bg-[#0a0a0a]">
                <button
                  type="button"
                  onClick={() => setShowPaywall(true)}
                  className={cn(
                    'w-full p-4 flex items-center justify-between gap-3 text-left',
                    'hover:bg-white/[0.03] transition-colors'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5">
                      <Crown className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{BRAND.proName}</p>
                      <p className="text-xs text-gray-500">Indices + or/pétrole en temps réel</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/30">
                    Passer en Pro
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowLifetimePaywall(true)}
                  className="w-full px-4 py-2.5 text-xs text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/5 border-t border-white/5 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400/80" />
                  NOESIS Lifetime — Accès à vie
                </button>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => setShowAchievements(true)}
                className="w-full bg-[#0a0a0a] rounded-xl p-4 flex items-center gap-3 border border-white/5 hover:border-white/20"
              >
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-sm">Succès</p>
                  <p className="text-xs text-gray-500">Tous vos accomplissements débloqués</p>
                </div>
              </button>
              <button
                onClick={() => setShowCustomize(true)}
                className="w-full bg-[#0a0a0a] rounded-xl p-4 flex items-center gap-3 border border-white/5 hover:border-white/20"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-sm">Personnalisation</p>
                  <p className="text-xs text-gray-500">Thèmes et couleurs</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Toast — feedback ajout au tableau */}
      {toastMessage && (
        <div className="fixed left-4 right-4 z-[45] bottom-20 max-w-sm mx-auto px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm font-medium text-center shadow-lg animate-fade-in-up safe-area-bottom">
          {toastMessage}
        </div>
      )}
      
      {/* Bottom Navigation — Dashboard (gauche), Défis, Explorer, Profil */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
        <div className="max-w-lg mx-auto flex items-center justify-around p-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              currentView === 'dashboard' ? "text-blue-400" : "text-gray-500 hover:text-gray-300"
            )}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[10px]">Dashboard</span>
          </button>
          <button
            onClick={() => setShowChallenges(true)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              showChallenges ? "text-amber-400" : "text-gray-500 hover:text-gray-300"
            )}
            aria-label="Ouvrir les Défis"
          >
            <Target className="w-5 h-5" />
            <span className="text-[10px]">Défis</span>
          </button>
          <button
            onClick={() => { setCurrentView('explorer'); setExplorerCategory(null); }}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              currentView === 'explorer' ? "text-blue-400" : "text-gray-500 hover:text-gray-300"
            )}
          >
            <Globe className="w-5 h-5" />
            <span className="text-[10px]">Explorer</span>
          </button>
          <button
            onClick={() => setCurrentView('profil')}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              currentView === 'profil' ? "text-blue-400" : "text-gray-500 hover:text-gray-300"
            )}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Profil</span>
          </button>
        </div>
      </nav>

      {/* Déverrouillage mode développeur — mot de passe après 10 taps sur le badge */}
      {showDevUnlockPrompt && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-black/70 safe-area-inset">
          <div className="w-full max-w-xs rounded-xl border border-amber-500/40 bg-[#0a0a0a] shadow-xl p-4">
            <p className="text-sm font-semibold text-amber-200 mb-1">Mode développeur</p>
            <p className="text-[10px] text-gray-500 mb-3">Entrez le mot de passe pour déverrouiller.</p>
            <input
              type="password"
              value={devPasswordInput}
              onChange={(e) => { setDevPasswordInput(e.target.value); setDevPasswordError(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const ok = devPasswordInput === DEV_PASSWORD; setDevPasswordError(!ok); if (ok) { setDevUnlocked(true); setShowDevUnlockPrompt(false); setShowDevPanel(true); setDevPasswordInput(''); } } }}
              placeholder="Mot de passe"
              className="w-full py-2.5 px-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 mb-2"
              autoFocus
            />
            {devPasswordError && <p className="text-[10px] text-red-400 mb-2">Mot de passe incorrect.</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setShowDevUnlockPrompt(false); setDevPasswordInput(''); setDevPasswordError(false); }}
                className="flex-1 py-2 rounded-lg text-xs font-medium bg-white/10 text-gray-300 hover:bg-white/20"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  const ok = devPasswordInput === DEV_PASSWORD;
                  setDevPasswordError(!ok);
                  if (ok) {
                    setDevUnlocked(true);
                    setShowDevUnlockPrompt(false);
                    setShowDevPanel(true);
                    setDevPasswordInput('');
                  }
                }}
                className="flex-1 py-2 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-200 hover:bg-amber-500/30"
              >
                Déverrouiller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode développeur — prévisualiser niveau ou Lifetime (tout débloqué) sans modifier la progression */}
      {showDevPanel && (
        <div className="fixed bottom-24 left-4 right-4 z-[45] max-w-sm mx-auto rounded-xl border border-amber-500/40 bg-[#0a0a0a] shadow-xl shadow-amber-500/10 p-4 safe-area-bottom">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-amber-200">Mode développeur</span>
            <button type="button" onClick={() => { setShowDevPanel(false); setDevLevelOverride(null); setDevLifetimeOverride(false); setDevPremiumOverride(null); }} className="p-1 rounded hover:bg-white/10 text-gray-400" aria-label="Fermer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mb-2">
            Prévisualiser l’UI : niveau et abonnement (gratuit / premium / lifetime). Réversible.
          </p>
          {/* État réel (sauvegardé) — toujours visible pour revenir à la progression réelle */}
          <div className="mb-3 p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10">
            <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">État réel (sauvegardé)</p>
            <p className="text-sm text-emerald-200/90">
              Niveau <strong>{level}</strong> · <strong>{xp}</strong> / {xpToNextLevel} XP
            </p>
            <p className="text-[10px] text-emerald-300/70 mt-1">
              {(devLevelOverride != null || devLifetimeOverride) ? 'Prévisualisation active — utilisez le bouton ci-dessous pour revenir.' : 'Aucune prévisualisation.'}
            </p>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label htmlFor="dev-level" className="text-xs text-gray-400 shrink-0 w-20">Niveau :</label>
            <select
              id="dev-level"
              value={devLifetimeOverride ? 'lifetime' : (devLevelOverride != null ? String(devLevelOverride) : '')}
              onChange={(e) => {
                const v = e.target.value;
                if (v === 'lifetime') {
                  setDevLifetimeOverride(true);
                  setDevLevelOverride(null);
                } else if (v === '') {
                  setDevLifetimeOverride(false);
                  setDevLevelOverride(null);
                } else {
                  setDevLifetimeOverride(false);
                  setDevLevelOverride(Number(v));
                }
              }}
              className="flex-1 py-2 pl-3 pr-8 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="">Réel (niveau {level})</option>
              {Array.from({ length: Math.max(50, ...WIDGETS.map(w => w.levelRequired)) }, (_, i) => i + 1).map((n) => (
                <option key={n} value={String(n)}>Niveau {n}</option>
              ))}
              <option value="lifetime">Lifetime — tout débloqué</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-400 shrink-0 w-20">Abonnement :</span>
            <div className="flex gap-1 flex-1">
              <button
                type="button"
                onClick={() => { setDevPremiumOverride(false); setDevLifetimeOverride(false); }}
                className={cn('flex-1 py-2 rounded-lg text-xs font-medium', devPremiumOverride === false && !devLifetimeOverride ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40' : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-transparent')}
              >
                Gratuit
              </button>
              <button
                type="button"
                onClick={() => { setDevPremiumOverride(true); setDevLifetimeOverride(false); }}
                className={cn('flex-1 py-2 rounded-lg text-xs font-medium', devPremiumOverride === true && !devLifetimeOverride ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40' : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-transparent')}
              >
                Premium
              </button>
              <button
                type="button"
                onClick={() => { setDevPremiumOverride(true); setDevLifetimeOverride(true); }}
                className={cn('flex-1 py-2 rounded-lg text-xs font-medium', devLifetimeOverride ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40' : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-transparent')}
              >
                Lifetime
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => { setDevLevelOverride(null); setDevLifetimeOverride(false); setDevPremiumOverride(null); }}
              className="w-full py-2.5 rounded-lg text-sm font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-500/30"
            >
              Revenir à mon état réel — Niveau {level} · {xp}/{xpToNextLevel} XP
            </button>
            <button
              type="button"
              onClick={() => setShowDevPanel(false)}
              className="py-2 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-200 hover:bg-amber-500/30"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Message cryptique au clic sur une carte verrouillée (Explorer) — exercice de pensée */}
      {lockedCardCrypticMessage && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-black/70 safe-area-inset" onClick={() => setLockedCardCrypticMessage(null)}>
          <div
            className="w-full max-w-sm rounded-2xl border border-amber-500/30 bg-[#0a0a0a] shadow-xl shadow-amber-500/10 p-5 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] text-amber-400/80 uppercase tracking-wider mb-3">Indice</p>
            <p className="text-base text-gray-200 italic mb-5 leading-relaxed">
              « {lockedCardCrypticMessage} »
            </p>
            <p className="text-[10px] text-gray-500 mb-4">
              Résous ce que ça signifie dans l&apos;app pour continuer le déblocage.
            </p>
            <button
              type="button"
              onClick={() => setLockedCardCrypticMessage(null)}
              className="w-full py-2.5 rounded-xl text-sm font-medium bg-amber-500/20 text-amber-200 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
            >
              Compris
            </button>
          </div>
        </div>
      )}
      
      {/* Modals */}
      <AchievementsModal isOpen={showAchievements} onClose={() => setShowAchievements(false)} />
      <CustomizationPanel isOpen={showCustomize} onClose={() => setShowCustomize(false)} />
      <SecretMenuErrorBoundary isOpen={showSecretMenu} onClose={() => setShowSecretMenu(false)}>
        <SecretMenu isOpen={showSecretMenu} onClose={() => setShowSecretMenu(false)} />
      </SecretMenuErrorBoundary>
      <ChallengesModal
        isOpen={showChallenges}
        onClose={() => setShowChallenges(false)}
        exploredCategoriesCount={exploredCategories.size}
        completedChallenges={completedChallenges}
        onLaunchQuiz={() => { setShowChallenges(false); setShowQuiz(true); }}
        onGoToExplorer={() => { setShowChallenges(false); setCurrentView('explorer'); setExplorerCategory(null); }}
      />
      <QuizPanel isOpen={showQuiz} onClose={() => setShowQuiz(false)} onOpenPaywall={() => { setShowQuiz(false); setShowPaywall(true); }} />
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} onUpgrade={() => setShowProWelcome(true)} />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onOpenPaywall={() => { setShowSettings(false); setShowPaywall(true); }}
        onOpenLifetimePaywall={() => { setShowSettings(false); setShowLifetimePaywall(true); }}
        onOpenPrivacy={() => { setShowSettings(false); setShowPrivacy(true); }}
        effectivePremium={effectivePremium}
        effectiveLifetime={effectiveLifetime}
      />
      <LifetimePaywallModal isOpen={showLifetimePaywall} onClose={() => setShowLifetimePaywall(false)} />
      <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

      {/* Bienvenue Pro — après upgrade */}
      {showProWelcome && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm safe-area-inset">
          <div className="w-full max-w-sm rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/30 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-xl font-bold text-amber-200 mb-1">Bienvenue en Pro</p>
            <p className="text-sm text-gray-400 mb-4">
              Toutes les données marchés sont maintenant en temps réel (indices, or, pétrole). Le quiz inclut 2–3 questions d&apos;actualité par série.
            </p>
            <button
              type="button"
              onClick={() => setShowProWelcome(false)}
              className="w-full py-3 rounded-xl font-semibold bg-amber-500/30 text-amber-200 border border-amber-500/50 hover:bg-amber-500/40 transition-colors"
            >
              Super !
            </button>
          </div>
        </div>
      )}

      {/* Célébration niveau — sentiment de récompense */}
      {showLevelUpCelebration != null && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 rounded-2xl p-8 max-w-sm w-full text-center">
            <p className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
              Niveau {showLevelUpCelebration} !
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Vous débloquez de nouvelles données et options. Continuez à progresser.
            </p>
            <button
              type="button"
              onClick={() => setShowLevelUpCelebration(null)}
              className="w-full py-3 rounded-xl font-semibold bg-amber-500/30 text-amber-200 border border-amber-500/50 hover:bg-amber-500/40 transition-colors"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
      {/* Toast succès débloqué — sentiment de récompense */}
      {lastUnlockedAchievementId != null && (() => {
        const ach = achievements.find(a => a.id === lastUnlockedAchievementId);
        const name = ach?.name ?? 'Succès débloqué';
        const desc = ach?.description ?? '';
        return (
          <div
            role="alert"
            className="fixed top-20 left-4 right-4 z-[105] mx-auto max-w-sm rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-4 shadow-lg shadow-amber-500/10 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/30 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-200">{name}</p>
                {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
              </div>
              <button
                type="button"
                onClick={() => clearLastUnlockedAchievement()}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white shrink-0"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })()}
      {/* Modal Découverte secrète — moment « wow » */}
      {lastDiscoveredSecretId != null && (() => {
        const feature = unlockedFeatures.find(f => f.id === lastDiscoveredSecretId);
        const discovery = SECRET_DISCOVERY[lastDiscoveredSecretId];
        const name = feature?.name ?? lastDiscoveredSecretId;
        const wowMessage = discovery?.wowMessage ?? 'Vous avez découvert un secret.';
        const benefit = discovery?.benefit ?? 'Récompense débloquée';
        return (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/40 rounded-2xl p-8 max-w-sm w-full text-center">
              <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider mb-2">Découverte</p>
              <p className="text-xl font-bold text-white mb-2">{name}</p>
              <p className="text-sm text-gray-300 mb-4">{wowMessage}</p>
              <p className="text-xs text-amber-400/90 mb-1">+50 XP</p>
              <p className="text-xs text-gray-500 mb-6">{benefit}</p>
              <button
                type="button"
                onClick={() => clearLastDiscoveredSecret()}
                className="w-full py-3 rounded-xl font-semibold bg-purple-500/30 text-purple-200 border border-purple-500/50 hover:bg-purple-500/40 transition-colors"
              >
                Incroyable
              </button>
            </div>
          </div>
        );
      })()}
      {/* Modal Ajouter une donnée au tableau */}
      {showAddWidgetModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="max-w-lg mx-auto flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" />
              Ajouter au tableau
            </h2>
            <button onClick={() => setShowAddWidgetModal(false)} className="p-2 rounded-full hover:bg-white/10 text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">Choisissez une donnée à afficher sur l&apos;écran principal.</p>
          <div className="grid grid-cols-2 gap-2">
            {getWidgetsNotOnDashboard().map(widget => {
              const Icon = widget.icon;
              return (
                <button
                  key={widget.id}
                  type="button"
                  onClick={() => handleAddToDashboard(widget.id)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 text-left flex items-center gap-2 transition-colors"
                >
                  <Icon className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-sm font-medium text-white truncate">{widget.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
