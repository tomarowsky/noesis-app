import { useState, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgressStore } from '@/store/progressStore';
import { fetchRealtimeForWidget, REALTIME_WIDGET_IDS } from '@/services/marketData';

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
}

// 50+ Widgets de données ultra-pertinents
const WIDGETS: DataWidget[] = [
  // ===== FINANCE & ÉCONOMIE (Niveaux 1-10) =====
  {
    id: 'sp500',
    title: 'S&P 500',
    category: 'finance',
    rarity: 'common',
    levelRequired: 1,
    data: {
      value: '$5,234.87',
      change: 1.23,
      context: 'Indice boursier américain',
      insight: 'Les marchés montrent une résilience remarquable malgré la volatilité',
      source: 'Bloomberg'
    },
    refreshInterval: 30,
    icon: Trending
  },
  {
    id: 'nasdaq',
    title: 'NASDAQ',
    category: 'finance',
    rarity: 'common',
    levelRequired: 1,
    data: {
      value: '$16,432.78',
      change: 2.15,
      context: 'Indice tech américain',
      insight: 'La tech continue sa domination avec les IA génératives',
      source: 'NASDAQ'
    },
    refreshInterval: 30,
    icon: LineChart
  },
  {
    id: 'cac40',
    title: 'CAC 40',
    category: 'finance',
    rarity: 'common',
    levelRequired: 1,
    data: {
      value: '7,432.15',
      change: -0.45,
      context: 'Indice boursier français',
      insight: 'Le marché français attend les résultats des banques',
      source: 'Euronext'
    },
    refreshInterval: 30,
    icon: BarChart3
  },
  {
    id: 'eurusd',
    title: 'EUR/USD',
    category: 'finance',
    rarity: 'common',
    levelRequired: 1,
    data: {
      value: '1.0845',
      change: 0.32,
      context: 'Taux de change',
      insight: 'L\'euro se stabilise face aux incertitudes économiques',
      source: 'Forex'
    },
    refreshInterval: 15,
    icon: Activity
  },
  {
    id: 'gold',
    title: 'Or',
    category: 'finance',
    rarity: 'uncommon',
    levelRequired: 2,
    data: {
      value: '$2,145.30',
      change: 0.87,
      context: 'Prix de l\'once',
      insight: 'L\'or reste un refuge privilégié en période d\'incertitude',
      source: 'LBMA'
    },
    refreshInterval: 60,
    icon: Gem
  },
  {
    id: 'oil',
    title: 'Pétrole Brent',
    category: 'finance',
    rarity: 'uncommon',
    levelRequired: 2,
    data: {
      value: '$78.45',
      change: -1.23,
      context: 'Prix du baril',
      insight: 'Les tensions géopolitiques influencent les cours',
      source: 'ICE'
    },
    refreshInterval: 60,
    icon: Droplets
  },
  {
    id: 'bitcoin',
    title: 'Bitcoin',
    category: 'crypto',
    rarity: 'rare',
    levelRequired: 3,
    data: {
      value: '$67,432',
      change: 5.67,
      context: 'BTC/USD',
      insight: 'Le halving approche, les investisseurs sont optimistes',
      source: 'CoinGecko'
    },
    refreshInterval: 15,
    icon: Database
  },
  {
    id: 'ethereum',
    title: 'Ethereum',
    category: 'crypto',
    rarity: 'rare',
    levelRequired: 3,
    data: {
      value: '$3,456',
      change: 3.21,
      context: 'ETH/USD',
      insight: 'Les ETFs Ethereum gagnent en popularité',
      source: 'CoinGecko'
    },
    refreshInterval: 15,
    icon: Database
  },
  {
    id: 'fed_rate',
    title: 'Taux Fed',
    category: 'finance',
    rarity: 'epic',
    levelRequired: 5,
    data: {
      value: '5.25%',
      change: 0,
      context: 'Taux directeur',
      insight: 'La Fed maintient ses taux, vigilante sur l\'inflation',
      source: 'Federal Reserve'
    },
    refreshInterval: 3600,
    icon: Banknote
  },
  {
    id: 'inflation',
    title: 'Inflation US',
    category: 'finance',
    rarity: 'epic',
    levelRequired: 5,
    data: {
      value: '3.2%',
      change: -0.1,
      context: 'IPC annuel',
      insight: 'L\'inflation ralentit mais reste au-dessus de l\'objectif',
      source: 'BLS'
    },
    refreshInterval: 86400,
    icon: Trending
  },
  {
    id: 'unemployment',
    title: 'Chômage US',
    category: 'finance',
    rarity: 'legendary',
    levelRequired: 7,
    data: {
      value: '3.7%',
      change: 0.1,
      context: 'Taux de chômage',
      insight: 'Le marché du travail reste résilient',
      source: 'BLS'
    },
    refreshInterval: 86400,
    icon: Users
  },
  {
    id: 'gdp',
    title: 'PIB US',
    category: 'finance',
    rarity: 'legendary',
    levelRequired: 7,
    data: {
      value: '$27.4T',
      change: 2.5,
      context: 'Produit Intérieur Brut',
      insight: 'La croissance américaine dépasse les attentes',
      source: 'BEA'
    },
    refreshInterval: 86400,
    icon: PieChart
  },
  {
    id: 'debt',
    title: 'Dette US',
    category: 'finance',
    rarity: 'mythic',
    levelRequired: 10,
    data: {
      value: '$34.6T',
      change: 6.2,
      context: 'Dette publique',
      insight: 'La dette atteint des niveaux historiques',
      source: 'Treasury'
    },
    refreshInterval: 86400,
    icon: Shield
  },

  // ===== TECH & INNOVATION (Niveaux 3-15) =====
  {
    id: 'ai_funding',
    title: 'Levées IA',
    category: 'tech',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: '$4.2B',
      change: 45,
      context: 'Investissements ce mois',
      insight: 'L\'IA générative domine les levées de fonds',
      source: 'Crunchbase'
    },
    refreshInterval: 86400,
    icon: Cpu
  },
  {
    id: 'unicorns',
    title: 'Licornes',
    category: 'tech',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: '1,247',
      change: -12,
      context: 'Startups > $1B',
      insight: 'Le marché des licornes se rationalise',
      source: 'CB Insights'
    },
    refreshInterval: 86400,
    icon: Crown
  },
  {
    id: 'semiconductor',
    title: 'Semiconducteurs',
    category: 'tech',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: '$587B',
      change: 8.3,
      context: 'Marché mondial',
      insight: 'La pénurie de puces s\'atténue progressivement',
      source: 'Gartner'
    },
    refreshInterval: 86400,
    icon: Cpu
  },
  {
    id: 'quantum',
    title: 'Quantum Computing',
    category: 'tech',
    rarity: 'legendary',
    levelRequired: 8,
    data: {
      value: '1,121',
      change: 23,
      context: 'Qubits record (IBM)',
      insight: 'L\'informatique quantique accélère son développement',
      source: 'IBM Research'
    },
    refreshInterval: 86400,
    icon: Atom
  },
  {
    id: 'space',
    title: 'SpaceX',
    category: 'tech',
    rarity: 'legendary',
    levelRequired: 9,
    data: {
      value: '$180B',
      change: 15,
      context: 'Valorisation',
      insight: 'Le secteur spatial privé explose',
      source: 'PitchBook'
    },
    refreshInterval: 86400,
    icon: Rocket
  },

  // ===== GÉOPOLITIQUE & SOCIÉTÉ (Niveaux 4-20) =====
  {
    id: 'geopolitical',
    title: 'Index Tension',
    category: 'geopolitics',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: '6.3/10',
      change: 0.2,
      context: 'Niveau de tension mondial',
      insight: 'Les tensions Moyen-Orient restent élevées',
      source: 'IISS'
    },
    refreshInterval: 3600,
    icon: Globe
  },
  {
    id: 'conflicts',
    title: 'Conflits actifs',
    category: 'geopolitics',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: '32',
      change: 2,
      context: 'Conflits armés',
      insight: 'Le nombre de conflits atteint un niveau historique',
      source: 'UCDP'
    },
    refreshInterval: 86400,
    icon: Shield
  },
  {
    id: 'refugees',
    title: 'Réfugiés',
    category: 'geopolitics',
    rarity: 'legendary',
    levelRequired: 8,
    data: {
      value: '114M',
      change: 8,
      context: 'Personnes déplacées',
      insight: 'Record historique de déplacés dans le monde',
      source: 'UNHCR'
    },
    refreshInterval: 86400,
    icon: Users
  },
  {
    id: 'nuclear',
    title: 'Têtes nucléaires',
    category: 'geopolitics',
    rarity: 'mythic',
    levelRequired: 12,
    data: {
      value: '12,121',
      change: -410,
      context: 'Stock mondial',
      insight: 'La réduction des arsenaux nucléaires continue',
      source: 'SIPRI'
    },
    refreshInterval: 86400,
    icon: Radio
  },

  // ===== SCIENCE & DÉCOUVERTES (Niveaux 3-18) =====
  {
    id: 'publications',
    title: 'Publications',
    category: 'science',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: '4,847',
      change: 12,
      context: 'Papers aujourd\'hui',
      insight: 'La recherche scientifique s\'accélère',
      source: 'PubMed'
    },
    refreshInterval: 86400,
    icon: BookOpen
  },
  {
    id: 'arxiv',
    title: 'arXiv',
    category: 'science',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: '523',
      change: 8,
      context: 'Preprints aujourd\'hui',
      insight: 'L\'open science gagne du terrain',
      source: 'arXiv'
    },
    refreshInterval: 86400,
    icon: Database
  },
  {
    id: 'climate',
    title: 'CO₂ Atmosphère',
    category: 'science',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: '424.2',
      change: 2.4,
      context: 'ppm CO₂',
      insight: 'Les concentrations de CO₂ continuent d\'augmenter',
      source: 'NOAA'
    },
    refreshInterval: 86400,
    icon: Wind
  },
  {
    id: 'temperature',
    title: 'Température',
    category: 'science',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: '+1.18°C',
      change: 0.05,
      context: 'Anomalie vs 1850-1900',
      insight: '2024 pourrait être l\'année la plus chaude jamais enregistrée',
      source: 'NASA'
    },
    refreshInterval: 86400,
    icon: Sun
  },
  {
    id: 'ice',
    title: 'Fonte glaciaire',
    category: 'science',
    rarity: 'legendary',
    levelRequired: 9,
    data: {
      value: '-267',
      change: -12,
      context: 'Gt/an (Antarctique)',
      insight: 'La fonte des glaces s\'accélère',
      source: 'NASA'
    },
    refreshInterval: 86400,
    icon: Droplets
  },
  {
    id: 'biodiversity',
    title: 'Biodiversité',
    category: 'science',
    rarity: 'mythic',
    levelRequired: 11,
    data: {
      value: '69%',
      change: -4,
      context: 'Déclin depuis 1970',
      insight: 'La biodiversité s\'effondre à un rythme alarmant',
      source: 'WWF'
    },
    refreshInterval: 86400,
    icon: TreePine
  },
  {
    id: 'extinctions',
    title: 'Extinctions',
    category: 'science',
    rarity: 'mythic',
    levelRequired: 13,
    data: {
      value: '680',
      change: 12,
      context: 'Espèces éteintes (depuis 1700)',
      insight: 'Nous sommes dans la 6ème extinction de masse',
      source: 'IUCN'
    },
    refreshInterval: 86400,
    icon: Heart
  },

  // ===== SANTÉ & MÉDECINE (Niveaux 3-17) =====
  {
    id: 'life_expectancy',
    title: 'Espérance vie',
    category: 'health',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: '73.2',
      change: 0.3,
      context: 'Années (monde)',
      insight: 'L\'espérance de vie repart à la hausse post-COVID',
      source: 'OMS'
    },
    refreshInterval: 86400,
    icon: Heart
  },
  {
    id: 'pandemic',
    title: 'COVID-19',
    category: 'health',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: '7.0M',
      change: 0.01,
      context: 'Décès cumulés',
      insight: 'La pandémie entre dans une phase endémique',
      source: 'OMS'
    },
    refreshInterval: 86400,
    icon: Stethoscope
  },
  {
    id: 'vaccines',
    title: 'Vaccinations',
    category: 'health',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: '13.5B',
      change: 0.1,
      context: 'Doses administrées',
      insight: 'La couverture vaccinale reste inégale',
      source: 'OMS'
    },
    refreshInterval: 86400,
    icon: Syringe
  },
  {
    id: 'antibiotics',
    title: 'Résistance',
    category: 'health',
    rarity: 'legendary',
    levelRequired: 9,
    data: {
      value: '1.27M',
      change: 8,
      context: 'Décès/an (AMR)',
      insight: 'La résistance aux antibiotiques est une urgence sanitaire',
      source: 'Lancet'
    },
    refreshInterval: 86400,
    icon: Pill
  },
  {
    id: 'longevity',
    title: 'Longévité',
    category: 'health',
    rarity: 'mythic',
    levelRequired: 14,
    data: {
      value: '122',
      change: 0,
      context: 'Record (Jeanne Calment)',
      insight: 'La recherche sur la longévité fait des progrès',
      source: 'Gerontology'
    },
    refreshInterval: 86400,
    icon: Dna
  },

  // ===== DÉMOGRAPHIE & POPULATION (Niveaux 2-16) =====
  {
    id: 'population',
    title: 'Population',
    category: 'demographics',
    rarity: 'common',
    levelRequired: 2,
    data: {
      value: '8.1B',
      change: 0.9,
      context: 'Humains sur Terre',
      insight: 'La croissance démographique ralentit',
      source: 'ONU'
    },
    refreshInterval: 86400,
    icon: Users
  },
  {
    id: 'birth_rate',
    title: 'Fécondité',
    category: 'demographics',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: '2.3',
      change: -0.1,
      context: 'Enfants/femme',
      insight: 'Le taux de fécondité mondial continue de baisser',
      source: 'ONU'
    },
    refreshInterval: 86400,
    icon: Users
  },
  {
    id: 'urbanization',
    title: 'Urbanisation',
    category: 'demographics',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: '57%',
      change: 0.5,
      context: 'Population urbaine',
      insight: 'La majorité de l\'humanité vit en ville',
      source: 'ONU'
    },
    refreshInterval: 86400,
    icon: Building
  },
  {
    id: 'aging',
    title: 'Vieillissement',
    category: 'demographics',
    rarity: 'epic',
    levelRequired: 7,
    data: {
      value: '10%',
      change: 0.3,
      context: 'Population > 65 ans',
      insight: 'La population mondiale vieillit rapidement',
      source: 'ONU'
    },
    refreshInterval: 86400,
    icon: Clock
  },
  {
    id: 'megacities',
    title: 'Mégapoles',
    category: 'demographics',
    rarity: 'legendary',
    levelRequired: 10,
    data: {
      value: '34',
      change: 2,
      context: 'Villes > 10M habitants',
      insight: 'Les mégapoles continuent de croître',
      source: 'ONU'
    },
    refreshInterval: 86400,
    icon: Building
  },

  // ===== ÉNERGIE & ENVIRONNEMENT (Niveaux 3-19) =====
  {
    id: 'renewable',
    title: 'Énergies vertes',
    category: 'energy',
    rarity: 'uncommon',
    levelRequired: 3,
    data: {
      value: '30%',
      change: 2.1,
      context: 'Part dans le mix',
      insight: 'Les renouvelables progressent rapidement',
      source: 'IEA'
    },
    refreshInterval: 86400,
    icon: Sun
  },
  {
    id: 'solar',
    title: 'Solaire',
    category: 'energy',
    rarity: 'rare',
    levelRequired: 4,
    data: {
      value: '1.4TW',
      change: 22,
      context: 'Capacité installée',
      insight: 'Le solaire devient la source d\'énergie la moins chère',
      source: 'IEA'
    },
    refreshInterval: 86400,
    icon: Sun
  },
  {
    id: 'ev',
    title: 'Voitures électriques',
    category: 'energy',
    rarity: 'epic',
    levelRequired: 6,
    data: {
      value: '14%',
      change: 4.2,
      context: 'Part des ventes',
      insight: 'L\'électrification des transports s\'accélère',
      source: 'IEA'
    },
    refreshInterval: 86400,
    icon: Car
  },
  {
    id: 'batteries',
    title: 'Batteries',
    category: 'energy',
    rarity: 'legendary',
    levelRequired: 9,
    data: {
      value: '$139',
      change: -14,
      context: '$/kWh (pack)',
      insight: 'Les coûts des batteries continuent de chuter',
      source: 'BNEF'
    },
    refreshInterval: 86400,
    icon: Energy
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
    icon: Atom
  },

  // ===== ART & CULTURE (Niveaux 7-20) =====
  {
    id: 'art_market',
    title: 'Marché de l\'Art',
    category: 'art',
    rarity: 'epic',
    levelRequired: 7,
    data: {
      value: '$65.2B',
      change: -4,
      context: 'Volume 2023',
      insight: 'Le marché de l\'art résiste malgré la baisse',
      source: 'Art Basel'
    },
    refreshInterval: 86400,
    icon: ArtPalette
  },
  {
    id: 'auction_record',
    title: 'Record Ventes',
    category: 'art',
    rarity: 'legendary',
    levelRequired: 10,
    data: {
      value: '$450M',
      change: 0,
      context: 'Salvator Mundi',
      insight: 'Le record absolu des enchères d\'art',
      source: 'Christie\'s'
    },
    refreshInterval: 86400,
    icon: Gem
  },
  {
    id: 'nft',
    title: 'NFTs',
    category: 'art',
    rarity: 'mythic',
    levelRequired: 12,
    data: {
      value: '$8.7B',
      change: -62,
      context: 'Volume 2023',
      insight: 'Le marché des NFTs s\'est effondré',
      source: 'CryptoSlam'
    },
    refreshInterval: 86400,
    icon: Database
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
    icon: Idea
  },
  {
    id: 'happiness',
    title: 'Bonheur',
    category: 'philosophy',
    rarity: 'legendary',
    levelRequired: 11,
    data: {
      value: '6.4/10',
      change: 0.1,
      context: 'World Happiness Report',
      insight: 'Les pays nordiques dominent le classement',
      source: 'UN'
    },
    refreshInterval: 86400,
    icon: Heart
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
    icon: Brain
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
      source: 'Réseau Élitiste'
    },
    refreshInterval: 3600,
    icon: Crown
  },
  {
    id: 'dark_pool',
    title: 'Dark Pools',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 22,
    data: {
      value: '$287B',
      change: 12,
      context: 'Volume mensuel',
      insight: 'Les transactions hors marché dominent',
      source: 'FINRA'
    },
    refreshInterval: 86400,
    icon: Shield
  },
  {
    id: 'satellite',
    title: 'Satellites',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 25,
    data: {
      value: '8,947',
      change: 342,
      context: 'Satellites actifs',
      insight: 'Starlink domine l\'espace orbital',
      source: 'UCS'
    },
    refreshInterval: 86400,
    icon: Satellite
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
    icon: Atom
  },
  {
    id: 'singularity',
    title: 'Singularité',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 35,
    data: {
      value: '2045',
      change: 0,
      context: 'Prédiction Kurzweil',
      insight: 'L\'IA surpassera l\'intelligence humaine',
      source: 'Futurism'
    },
    refreshInterval: 86400,
    icon: Cpu
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
    icon: Telescope
  },
  {
    id: 'simulation',
    title: 'Hypothèse Simulation',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 45,
    data: {
      value: '50%',
      change: 0,
      context: 'Probabilité estimée',
      insight: 'Vivons-nous dans une simulation ?',
      source: 'Oxford'
    },
    refreshInterval: 86400,
    icon: Cpu
  },
  {
    id: 'ultimate_truth',
    title: 'Vérité Ultime',
    category: 'exclusive',
    rarity: 'mythic',
    levelRequired: 50,
    data: {
      value: '42',
      change: 0,
      context: 'La réponse',
      insight: 'La réponse à la grande question sur la vie, l\'univers et le reste',
      source: 'Deep Thought'
    },
    refreshInterval: 86400,
    icon: Idea
  },
];

// Composant Widget — données réelles quand dispo, sinon indicatives ; XP à l'ouverture et au refresh
function DataWidgetCard({ widget, isLocked = false }: { widget: DataWidget; isLocked?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [widgetData, setWidgetData] = useState(widget.data);
  const [isRealtime, setIsRealtime] = useState(false);
  const addXp = useProgressStore(s => s.addXp);
  const updateStats = useProgressStore(s => s.updateStats);
  const isRealtimeWidget = REALTIME_WIDGET_IDS.includes(widget.id);

  // Chargement initial des données réelles pour les widgets supportés
  useEffect(() => {
    if (isLocked || !isRealtimeWidget) return;
    let cancelled = false;
    fetchRealtimeForWidget(widget.id).then(quote => {
      if (cancelled || !quote) return;
      setWidgetData(prev => ({
        ...prev,
        value: quote.value,
        change: quote.change,
        context: quote.context,
        source: quote.source,
      }));
      setIsRealtime(true);
    });
    return () => { cancelled = true; };
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
          setIsRealtime(true);
        } else {
          setWidgetData(prev => ({ ...prev, change: (prev.change ?? 0) + (Math.random() - 0.5) * 2 }));
        }
      } catch {
        setWidgetData(prev => ({ ...prev, change: (Math.random() - 0.5) * 2 }));
      }
    } else {
      setTimeout(() => {
        setWidgetData(prev => ({ ...prev, change: (Math.random() - 0.5) * 5 }));
        setIsRefreshing(false);
      }, 800);
      addXp(2, 'data_refresh');
      const current = useProgressStore.getState().stats.dataPointsViewed;
      updateStats({ dataPointsViewed: current + 1 });
      return;
    }
    addXp(2, 'data_refresh');
    const current = useProgressStore.getState().stats.dataPointsViewed;
    updateStats({ dataPointsViewed: current + 1 });
    setIsRefreshing(false);
  };

  const handleExpand = () => {
    if (isLocked) return;
    const next = !isExpanded;
    setIsExpanded(next);
    if (next) {
      addXp(5, 'data_view');
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
    return (
      <div className="relative overflow-hidden rounded-xl p-3 bg-[#0a0a0a] border border-white/5 opacity-50">
        <Lock className="w-6 h-6 text-gray-600 mb-2 mx-auto" />
        <p className="text-[10px] text-gray-500 text-center">
          Niv. {widget.levelRequired}
        </p>
        <p className="text-[10px] text-gray-600 text-center truncate">
          {widget.title}
        </p>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02]",
        "bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a]",
        "border",
        getRarityBg()
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
            <span className={cn(
              "text-[8px] px-1.5 py-0.5 rounded font-medium",
              isRealtime ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"
            )}>
              {isRealtime ? 'Temps réel' : 'Chargement…'}
            </span>
          )}
          {!isRealtimeWidget && (
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400/90 font-medium">
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
      
      {/* Main Value */}
      <div className="mb-1">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {widgetData.value}
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
              {Math.abs(widgetData.change).toFixed(1)}%
            </span>
          )}
        </div>
        <p className="text-[9px] text-gray-500 truncate">{widgetData.context}</p>
        <p className="text-[8px] text-gray-600 truncate">Source: {widgetData.source}</p>
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
            <p className="text-xs text-gray-400">{unlockedCount} / {achievements.length} débloqués</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
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

// Modal Personnalisation
function CustomizeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Personnalisation</h2>
            <p className="text-xs text-gray-400">Personnalisez votre expérience</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Thèmes</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/50">
              <p className="font-medium text-blue-400">Sombre</p>
              <p className="text-xs text-gray-400">Actif</p>
            </div>
            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10 opacity-50">
              <p className="font-medium text-gray-400">Clair</p>
              <p className="text-xs text-gray-600">Niveau 5 requis</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Couleurs d'accent</h3>
          <div className="flex gap-3">
            {['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e'].map(color => (
              <button 
                key={color}
                className="w-10 h-10 rounded-full border-2 border-white/20"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal Défis — affiche la progression et les récompenses
function ChallengesModal({
  isOpen,
  onClose,
  exploredCategoriesCount,
  completedChallenges,
}: {
  isOpen: boolean;
  onClose: () => void;
  exploredCategoriesCount: number;
  completedChallenges: Set<string>;
}) {
  const { stats, achievements } = useProgressStore();
  const hasUnlockedAchievement = achievements.some(a => a.unlockedAt);
  const challenges = [
    { id: 'daily_data', name: 'Explorateur du jour', desc: 'Consulter 5 widgets différents', xp: 10, current: stats.dataPointsViewed, target: 5 },
    { id: 'expand_mind', name: 'Ouverture d\'esprit', desc: 'Explorer 3 catégories', xp: 25, current: exploredCategoriesCount, target: 3 },
    { id: 'achiever', name: 'Accomplisseur', desc: 'Débloquer un succès', xp: 50, current: hasUnlockedAchievement ? 1 : 0, target: 1 },
  ];
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Défis</h2>
            <p className="text-xs text-gray-400">Complétez-les pour gagner de l'XP</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="space-y-3">
        {challenges.map(c => {
          const done = completedChallenges.has(c.id);
          const progress = Math.min(c.current, c.target);
          return (
            <div
              key={c.id}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border transition-all",
                done ? "bg-blue-500/10 border-blue-500/30" : "bg-[#0a0a0a] border-white/10"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                done ? "bg-blue-500/20" : "bg-blue-500/10"
              )}>
                <Target className={cn("w-5 h-5", done ? "text-blue-300" : "text-blue-400")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("font-medium text-sm", done ? "text-blue-200" : "text-white")}>{c.name}</p>
                <p className="text-xs text-gray-500">{c.desc}</p>
                {!done && c.target > 1 && (
                  <p className="text-[10px] text-blue-400 mt-1">{progress} / {c.target}</p>
                )}
              </div>
              {done ? (
                <span className="text-xs font-semibold text-emerald-400">+{c.xp} XP ✓</span>
              ) : (
                <span className="text-xs font-semibold text-blue-400">+{c.xp} XP</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Modal Paramètres
function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
          <p className="text-xs text-gray-500">NOESIS — Intelligence Élitiste</p>
        </div>
      </div>
    </div>
  );
}

// Type pour la navigation
type TabView = 'dashboard' | 'explorer' | 'profil';

// Catégories uniques des widgets (pour Explorer)
const WIDGET_CATEGORIES = Array.from(new Set(WIDGETS.map(w => w.category))).sort();

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
  action?: 'open_detail' | 'refresh' | 'explorer' | 'challenges' | 'wait';
};

function getProgressionTips(
  xpNeeded: number,
  dataPointsViewed: number,
  exploredCategoriesCount: number,
  completedChallenges: Set<string>
): ProgressionTip[] {
  const tips: ProgressionTip[] = [];

  // Défi "Explorateur du jour" (5 données) — gros gain
  if (!completedChallenges.has('daily_data')) {
    const rest = 5 - dataPointsViewed;
    if (rest > 0) {
      tips.push({
        id: 'challenge_daily',
        label: rest === 1 ? 'Consultez 1 donnée de plus (ouvrir le détail ou rafraîchir)' : `Consultez encore ${rest} données (ouvrir le détail ou rafraîchir)`,
        sublabel: `Défi « Explorateur du jour » : ${dataPointsViewed}/5 → +10 XP`,
        xp: 10,
        priority: rest <= 2 ? 100 : 50,
        action: 'open_detail',
      });
    }
  }

  // Défi "Ouverture d'esprit" (3 catégories)
  if (!completedChallenges.has('expand_mind') && exploredCategoriesCount < 3) {
    const rest = 3 - exploredCategoriesCount;
    tips.push({
      id: 'challenge_expand',
      label: rest === 1 ? 'Explorez 1 catégorie de plus (onglet Explorer)' : `Explorez ${rest} catégories de plus (onglet Explorer)`,
      sublabel: `Défi « Ouverture d'esprit » : ${exploredCategoriesCount}/3 → +25 XP`,
      xp: 25,
      priority: rest === 1 ? 95 : 45,
      action: 'explorer',
    });
  }

  // À 1 XP du niveau : option la plus rapide
  if (xpNeeded === 1) {
    tips.push({
      id: 'one_xp_left',
      label: 'Plus qu\'1 XP ! Rafraîchissez une donnée (↻) ou restez 1 minute',
      sublabel: '+1 à +2 XP — niveau suivant dans un instant',
      xp: 1,
      priority: 92,
      action: 'refresh',
    });
  }

  // Actions simples selon XP restant
  if (xpNeeded <= 5 && xpNeeded > 0) {
    tips.push({
      id: 'one_detail',
      label: 'Ouvrez le détail d\'une donnée ci-dessous (cliquez sur une carte)',
      sublabel: '+5 XP — vous y êtes presque !',
      xp: 5,
      priority: 90,
      action: 'open_detail',
    });
  }
  if (xpNeeded <= 2 && xpNeeded > 0) {
    tips.push({
      id: 'two_refresh',
      label: 'Rafraîchissez 1 donnée (icône ↻ sur une carte)',
      sublabel: '+2 XP',
      xp: 2,
      priority: 85,
      action: 'refresh',
    });
  }

  // Nombre d'actions nécessaires pour atteindre le niveau
  const openCount = Math.ceil(xpNeeded / 5);
  const refreshCount = Math.ceil(xpNeeded / 2);
  if (openCount <= 6 && xpNeeded > 0) {
    tips.push({
      id: 'open_n',
      label: openCount === 1 ? 'Ouvrez 1 détail de donnée' : `Ouvrez ${openCount} détails de données (cliquez sur les cartes)`,
      sublabel: `+${Math.min(openCount * 5, xpNeeded)} XP`,
      xp: openCount * 5,
      priority: 70,
      action: 'open_detail',
    });
  }
  if (refreshCount <= 10 && xpNeeded > 0) {
    tips.push({
      id: 'refresh_n',
      label: refreshCount === 1 ? 'Rafraîchissez 1 donnée (icône ↻)' : `Rafraîchissez ${refreshCount} données (icône ↻ sur les cartes)`,
      sublabel: `+${Math.min(refreshCount * 2, xpNeeded)} XP`,
      xp: refreshCount * 2,
      priority: 60,
      action: 'refresh',
    });
  }

  // Explorer une catégorie (première fois = +3 XP)
  tips.push({
    id: 'explore_one',
    label: 'Explorez une nouvelle catégorie (onglet Explorer en bas)',
    sublabel: '+3 XP par nouvelle catégorie',
    xp: 3,
    priority: 40,
    action: 'explorer',
  });

  // Défis
  tips.push({
    id: 'challenges',
    label: 'Consultez les Défis (bouton ci-dessous) et complétez-en un',
    sublabel: '+10 à +50 XP selon le défi',
    xp: 25,
    priority: 30,
    action: 'challenges',
  });

  // Rester actif
  tips.push({
    id: 'wait',
    label: 'Rester sur l\'app : +1 XP par minute',
    sublabel: 'En attendant, ouvrez des données pour aller plus vite',
    xp: 1,
    priority: 10,
    action: 'wait',
  });

  return tips.sort((a, b) => b.priority - a.priority);
}

// Bloc "Comment progresser" — conseils dynamiques, jamais bloquant
function ProgressionBlock({
  xpNeeded,
  level,
  nextLevelUnlocks,
  stats,
  exploredCategoriesCount,
  completedChallenges,
  onGoToExplorer,
  onShowChallenges,
}: {
  xpNeeded: number;
  level: number;
  nextLevelUnlocks: string[];
  stats: { dataPointsViewed: number; timeSpent: number };
  exploredCategoriesCount: number;
  completedChallenges: Set<string>;
  onGoToExplorer: () => void;
  onShowChallenges: () => void;
}) {
  const [showAllWays, setShowAllWays] = useState(false);
  const tips = getProgressionTips(xpNeeded, stats.dataPointsViewed, exploredCategoriesCount, completedChallenges);
  const mainTip = tips[0];
  const otherTips = tips.slice(1, 4);

  return (
    <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-blue-400" />
        Comment progresser
      </h3>
      <p className="text-xs text-gray-400 mb-3">
        Il vous faut <span className="font-semibold text-white">{xpNeeded} XP</span> pour atteindre le niveau {level + 1}.
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
          {showAllWays ? 'Masquer le rappel' : 'Rappel : toutes les façons de gagner de l\'XP'}
        </button>
        {showAllWays && (
          <ul className="text-[11px] text-gray-500 space-y-1 mt-2 pt-2 border-t border-white/5">
            <li className="flex items-center gap-2">Ouvrir le détail d'une donnée : <span className="text-emerald-400">+5 XP</span></li>
            <li className="flex items-center gap-2">Rafraîchir une donnée (icône ↻) : <span className="text-emerald-400">+2 XP</span></li>
            <li className="flex items-center gap-2">Explorer une nouvelle catégorie : <span className="text-emerald-400">+3 XP</span></li>
            <li className="flex items-center gap-2">Compléter un défi : <span className="text-emerald-400">+10 à 50 XP</span></li>
            <li className="flex items-center gap-2">Rester actif (1 min) : <span className="text-emerald-400">+1 XP</span></li>
          </ul>
        )}
      </div>

      {nextLevelUnlocks.length > 0 && (
        <div className="pt-3 mt-3 border-t border-white/5">
          <p className="text-[10px] text-gray-500 mb-1">Au niveau {level + 1} vous débloquerez :</p>
          <p className="text-[11px] text-gray-400">
            {nextLevelUnlocks.slice(0, 5).join(', ')}
            {nextLevelUnlocks.length > 5 && ` +${nextLevelUnlocks.length - 5} autres`}
          </p>
        </div>
      )}
    </div>
  );
}

// App principale — progression via le store (XP, level, stats)
export default function App() {
  const { level, xp, xpToNextLevel, addXp, updateStats, stats, getProgressPercentage } = useProgressStore();
  const progress = getProgressPercentage();
  const [currentView, setCurrentView] = useState<TabView>('dashboard');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [explorerCategory, setExplorerCategory] = useState<string | null>(null);
  const [exploredCategories, setExploredCategories] = useState<Set<string>>(new Set());
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const achievements = useProgressStore(s => s.achievements);

  // Synchroniser le temps passé avec le store (chaque minute)
  useEffect(() => {
    const interval = setInterval(() => {
      updateStats({ timeSpent: stats.timeSpent + 1 });
      addXp(1, 'time');
    }, 60000);
    return () => clearInterval(interval);
  }, [updateStats, addXp, stats.timeSpent]);

  // Vérifier les défis et attribuer l'XP quand les conditions sont remplies
  useEffect(() => {
    if (stats.dataPointsViewed >= 5 && !completedChallenges.has('daily_data')) {
      addXp(10, 'challenge_daily_data');
      setCompletedChallenges(prev => new Set(prev).add('daily_data'));
    }
    if (exploredCategories.size >= 3 && !completedChallenges.has('expand_mind')) {
      addXp(25, 'challenge_expand_mind');
      setCompletedChallenges(prev => new Set(prev).add('expand_mind'));
    }
    const hasUnlockedAchievement = achievements.some(a => a.unlockedAt);
    if (hasUnlockedAchievement && !completedChallenges.has('achiever')) {
      addXp(50, 'challenge_achiever');
      setCompletedChallenges(prev => new Set(prev).add('achiever'));
    }
  }, [stats.dataPointsViewed, exploredCategories.size, achievements, completedChallenges, addXp]);

  const getUnlockedWidgets = () => WIDGETS.filter(w => w.levelRequired <= level);
  const getLockedWidgets = () => WIDGETS.filter(w => w.levelRequired > level).slice(0, 4);
  const nextLevelUnlocks = getWidgetsUnlockingAtLevel(level + 1);
  const xpNeeded = xpToNextLevel - xp;
  
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5">
        <div className="p-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">NOESIS</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Intelligence Élitiste</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20">
                <Zap className="w-4 h-4" />
                <span>{level}</span>
              </div>
            </div>
          </div>
          
          {/* XP Bar */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>{xp} XP</span>
              <span>{xpToNextLevel} XP</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="p-4 pb-28 max-w-lg mx-auto">
        {/* Vue Dashboard */}
        {currentView === 'dashboard' && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">
                Bienvenue, <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Initié</span>
              </h2>
              <p className="text-gray-500 text-sm">
                Découvrez {WIDGETS.length}+ données exclusives et progressez pour débloquer plus de contenu.
              </p>
            </div>

            {/* Comment progresser — dynamique et interactif, conseils selon la progression */}
            <ProgressionBlock
              xpNeeded={xpNeeded}
              level={level}
              nextLevelUnlocks={nextLevelUnlocks}
              stats={stats}
              exploredCategoriesCount={exploredCategories.size}
              completedChallenges={completedChallenges}
              onGoToExplorer={() => setCurrentView('explorer')}
              onShowChallenges={() => setShowChallenges(true)}
            />
            
            <div className="grid grid-cols-3 gap-3 mb-6">
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  Données en temps réel
                </h3>
                <span className="text-xs text-gray-500">
                  {getUnlockedWidgets().length} / {WIDGETS.length}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mb-3">
                Bitcoin, Ethereum, EUR/USD : <span className="text-emerald-400/90">temps réel</span> (CoinGecko, Frankfurter). Autres : données indicatives, sources citées.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {getUnlockedWidgets().map(widget => (
                  <DataWidgetCard key={widget.id} widget={widget} />
                ))}
              </div>
            </div>
            
            {getLockedWidgets().length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Prochainement
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {getLockedWidgets().map(widget => (
                    <DataWidgetCard key={widget.id} widget={widget} isLocked />
                  ))}
                </div>
                <p className="text-center text-xs text-gray-600 mt-3">
                  Encore {WIDGETS.filter(w => w.levelRequired > level).length - 4} données à découvrir...
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
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
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <p className="font-semibold text-white text-sm">Défis</p>
                <p className="text-xs text-gray-500">Missions quotidiennes</p>
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-400" />
                Explorer
              </h2>
              <p className="text-gray-500 text-sm">
                Parcourez les données par catégorie.
              </p>
            </div>
            {!explorerCategory ? (
              <div className="grid grid-cols-2 gap-3">
                {WIDGET_CATEGORIES.map(cat => {
                  const count = WIDGETS.filter(w => w.category === cat).length;
                  const unlocked = WIDGETS.filter(w => w.category === cat && w.levelRequired <= level).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        if (!exploredCategories.has(cat)) {
                          addXp(3, 'explore_category');
                          setExploredCategories(prev => new Set(prev).add(cat));
                        }
                        setExplorerCategory(cat);
                      }}
                      className="bg-[#0a0a0a] rounded-xl p-4 text-left border border-white/5 hover:border-white/20 transition-all"
                    >
                      <span className="text-sm font-semibold text-white capitalize">{cat}</span>
                      <p className="text-xs text-gray-500 mt-1">{unlocked} / {count} accessibles</p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setExplorerCategory(null)}
                  className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-4"
                >
                  ← Retour aux catégories
                </button>
                <h3 className="text-sm font-semibold text-white mb-3 capitalize">{explorerCategory}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {WIDGETS.filter(w => w.category === explorerCategory).map(widget => (
                    <DataWidgetCard
                      key={widget.id}
                      widget={widget}
                      isLocked={widget.levelRequired > level}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Vue Profil */}
        {currentView === 'profil' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <User className="w-6 h-6 text-purple-400" />
                Profil
              </h2>
              <p className="text-gray-500 text-sm">
                Votre progression et vos statistiques.
              </p>
            </div>
            <div className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Initié</p>
                  <p className="text-xs text-gray-500">Niveau {level}</p>
                </div>
              </div>
              <div className="mb-2 flex justify-between text-[10px] text-gray-500">
                <span>{xp} XP</span>
                <span>{xpToNextLevel} XP</span>
              </div>
              <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0a0a0a] rounded-xl p-3 text-center border border-white/5">
                <p className="text-lg font-bold text-white">{getUnlockedWidgets().length}</p>
                <p className="text-[10px] text-gray-500">Données débloquées</p>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-3 text-center border border-white/5">
                <p className="text-lg font-bold text-white">{Math.floor(stats.timeSpent / 60)}h</p>
                <p className="text-[10px] text-gray-500">Temps passé</p>
              </div>
            </div>
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
                  <p className="text-xs text-gray-500">Voir mes accomplissements</p>
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
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-t border-white/5">
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
      
      {/* Modals */}
      <AchievementsModal isOpen={showAchievements} onClose={() => setShowAchievements(false)} />
      <CustomizeModal isOpen={showCustomize} onClose={() => setShowCustomize(false)} />
      <ChallengesModal
        isOpen={showChallenges}
        onClose={() => setShowChallenges(false)}
        exploredCategoriesCount={exploredCategories.size}
        completedChallenges={completedChallenges}
      />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
