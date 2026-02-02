// Types pour l'app NOESIS — Quiz, marchés & culture

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
  /** Quiz : réponses données */
  quizAnswered: number;
  /** Quiz : réponses correctes */
  quizCorrect: number;
  /** Quiz : série de bonnes réponses en cours */
  quizStreak: number;
  /** Quiz : meilleure série */
  bestQuizStreak: number;
  /** Quiz : séries de 5 complétées */
  quizSeriesCompleted: number;
  /** Quiz : bonnes réponses par catégorie (finance, science, etc.) — maîtrise */
  categoryCorrect: Record<string, number>;
  /** Quiz : date (YYYY-MM-DD) de la dernière série complétée — pour streak */
  lastSeriesDate: string | null;
  /** Quiz : jours consécutifs avec au moins une série complétée */
  streakDaysQuiz: number;
  /** Quiz : date du dernier bonus « défi du jour » (+15 XP) */
  lastDailyBonusDate: string | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  condition: AchievementCondition;
}

export interface AchievementCondition {
  type: 'level' | 'xp' | 'secrets' | 'data_viewed' | 'time' | 'interactions' | 'streak' | 'quiz_correct' | 'quiz_streak' | 'quiz_series' | 'category_correct' | 'custom';
  value: number;
  /** Pour type 'category_correct' : clé de catégorie (finance, science, etc.) */
  category?: string;
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

/** Question de quiz (Q&A type jeu de société + actualité) */
export interface QuizQuestion {
  id: string;
  category: 'finance' | 'science' | 'geopolitics' | 'tech' | 'culture' | 'general' | 'actualité';
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: 1 | 2 | 3; // 1 = facile, 2 = moyen, 3 = difficile → impacte XP
  explanation?: string;
  /** Questions d'actualité : récentes, pour s'informer (Pro = plus présentes) */
  isCurrentEvents?: boolean;
}
