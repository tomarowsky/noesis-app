// Types pour l'app NOESIS - Intelligence Élitiste

export interface UserProgress {
  level: number;
  xp: number;
  totalXp: number;
  xpToNextLevel: number;
  achievements: Achievement[];
  unlockedFeatures: UnlockedFeature[];
  discoveredSecrets: string[];
  stats: UserStats;
  customizations: Customizations;
}

export interface UserStats {
  dataPointsViewed: number;
  secretsFound: number;
  timeSpent: number; // en minutes
  interactions: number;
  streakDays: number;
  lastVisit: string | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  condition: AchievementCondition;
}

export interface AchievementCondition {
  type: 'level' | 'xp' | 'secrets' | 'data_viewed' | 'time' | 'interactions' | 'streak' | 'custom';
  value: number;
}

export interface UnlockedFeature {
  id: string;
  name: string;
  description: string;
  category: 'interface' | 'data' | 'customization' | 'secret' | 'power';
  unlockedAt: string;
  levelRequired: number;
  hidden: boolean;
  hint?: string;
}

export interface Customizations {
  theme: string;
  accentColor: string;
  fontStyle: string;
  particleEffects: boolean;
  animations: boolean;
  layout: string;
}

export interface DataWidget {
  id: string;
  title: string;
  description: string;
  category: 'finance' | 'crypto' | 'science' | 'geopolitics' | 'tech' | 'art' | 'philosophy';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  levelRequired: number;
  data: WidgetData;
  lastUpdated: string;
  refreshInterval: number; // en secondes
}

export interface WidgetData {
  value: string | number;
  change?: number;
  context: string;
  insight: string;
  source: string;
  lastUpdated?: string;
}

export interface SecretMenu {
  id: string;
  name: string;
  description: string;
  trigger: SecretTrigger;
  unlocked: boolean;
  content: SecretContent;
}

export interface SecretTrigger {
  type: 'sequence' | 'gesture' | 'code' | 'time' | 'combination' | 'easter_egg';
  pattern?: string[];
  code?: string;
  timeWindow?: { start: string; end: string };
}

export interface SecretContent {
  type: 'menu' | 'widget' | 'customization' | 'data' | 'message';
  data: unknown;
}

export interface LevelConfig {
  level: number;
  name: string;
  xpRequired: number;
  unlocks: string[];
  hint: string;
}

export interface GameState {
  isPlaying: boolean;
  currentChallenge: Challenge | null;
  completedChallenges: string[];
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'puzzle' | 'sequence' | 'knowledge' | 'discovery';
  difficulty: number;
  reward: Reward;
}

export interface Reward {
  xp: number;
  feature?: string;
  customization?: string;
  secret?: string;
}
