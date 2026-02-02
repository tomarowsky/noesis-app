import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, Achievement, UnlockedFeature, UserStats, Customizations } from '@/types';

interface ProgressState extends UserProgress {
  /** Abonnement Pro (données temps réel sans config, or/pétrole, etc.) */
  isPremium: boolean;
  /** Accès à vie : tout Pro + toutes les données débloquées + expérience exclusive */
  isLifetime: boolean;
  /** Ordre personnalisé des widgets sur le dashboard (ids). Vide = ordre par défaut. */
  widgetOrder: string[];
  /** Ids des widgets affichés sur l'écran principal. Vide = tous les débloqués. */
  dashboardWidgetIds: string[];
  /** Prénom de l'utilisateur (affiché dans "Bienvenue, …" sur le dashboard). Vide = "Initié". */
  firstName: string;
  /** Niveau de difficulté adaptatif du quiz (1.0–3.0) : mis à jour après chaque réponse pour proposer des questions pertinentes. */
  quizAdaptiveLevel: number;
  // Actions
  setFirstName: (value: string) => void;
  /** Met à jour le niveau adaptatif après une réponse (bonne → +0.12, mauvaise → -0.18), borné [1, 3]. */
  updateQuizAdaptiveLevel: (correct: boolean) => void;
  setPremium: (value: boolean) => void;
  setLifetime: (value: boolean) => void;
  setWidgetOrder: (order: string[]) => void;
  setDashboardWidgetIds: (ids: string[]) => void;
  addXp: (amount: number, source?: string) => void;
  /** Enregistre une réponse au quiz : met à jour les stats (dont categoryCorrect, streak) et accorde l'XP. Optionnel : category pour la maîtrise. */
  addQuizResult: (correct: boolean, difficulty: 1 | 2 | 3, category?: string) => { xpEarned: number; dailyBonusApplied?: boolean };
  checkLevelUp: () => boolean;
  unlockAchievement: (achievementId: string) => void;
  unlockFeature: (featureId: string) => void;
  discoverSecret: (secretId: string) => void;
  /** Dernière découverte (pour afficher la modal "wow") — éphémère, non persisté */
  lastDiscoveredSecretId: string | null;
  clearLastDiscoveredSecret: () => void;
  /** Dernier succès débloqué (pour toast) — éphémère, non persisté */
  lastUnlockedAchievementId: string | null;
  clearLastUnlockedAchievement: () => void;
  updateStats: (updates: Partial<UserStats>) => void;
  updateCustomizations: (updates: Partial<Customizations>) => void;
  /** Rétablit thème, couleur, police, layout et effets aux valeurs par défaut. */
  resetCustomizations: () => void;
  getProgressPercentage: () => number;
  getAvailableUnlocks: () => UnlockedFeature[];
  getHiddenUnlocks: () => UnlockedFeature[];
  resetProgress: () => void;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    name: 'Premiers Pas',
    description: 'Atteindre le niveau 2',
    icon: 'footprints',
    unlockedAt: null,
    rarity: 'common',
    condition: { type: 'level', value: 2 }
  },
  {
    id: 'seeker',
    name: 'Chercheur',
    description: 'Découvrir votre premier secret',
    icon: 'search',
    unlockedAt: null,
    rarity: 'common',
    condition: { type: 'secrets', value: 1 }
  },
  {
    id: 'data_enthusiast',
    name: 'Amateur de Données',
    description: 'Consulter 50 points de données',
    icon: 'bar-chart-2',
    unlockedAt: null,
    rarity: 'common',
    condition: { type: 'data_viewed', value: 50 }
  },
  {
    id: 'dedicated',
    name: 'Dévoué',
    description: 'Passer 1 heure sur l\'app',
    icon: 'clock',
    unlockedAt: null,
    rarity: 'rare',
    condition: { type: 'time', value: 60 }
  },
  {
    id: 'insider',
    name: 'Initié',
    description: 'Atteindre le niveau 10',
    icon: 'key',
    unlockedAt: null,
    rarity: 'rare',
    condition: { type: 'level', value: 10 }
  },
  {
    id: 'secret_hunter',
    name: 'Chasseur de Secrets',
    description: 'Découvrir 10 secrets cachés',
    icon: 'eye',
    unlockedAt: null,
    rarity: 'epic',
    condition: { type: 'secrets', value: 10 }
  },
  {
    id: 'master',
    name: 'Maître',
    description: 'Atteindre le niveau 25',
    icon: 'crown',
    unlockedAt: null,
    rarity: 'legendary',
    condition: { type: 'level', value: 25 }
  },
  {
    id: 'enlightened',
    name: 'L\'Éveillé',
    description: 'Découvrir tous les secrets',
    icon: 'sun',
    unlockedAt: null,
    rarity: 'mythic',
    condition: { type: 'secrets', value: 20 }
  },
  // Succès Quiz — récompensent l’engagement intellectuel
  {
    id: 'quiz_first',
    name: 'Première Réponse',
    description: 'Répondre correctement à votre première question au quiz',
    icon: 'check-circle',
    unlockedAt: null,
    rarity: 'common',
    condition: { type: 'quiz_correct', value: 1 }
  },
  {
    id: 'quiz_ten',
    name: 'Dix Bonnes Réponses',
    description: 'Totaliser 10 bonnes réponses au quiz',
    icon: 'target',
    unlockedAt: null,
    rarity: 'uncommon',
    condition: { type: 'quiz_correct', value: 10 }
  },
  {
    id: 'quiz_streak_3',
    name: 'Série de 3',
    description: 'Enchaîner 3 bonnes réponses d\'affilée au quiz',
    icon: 'zap',
    unlockedAt: null,
    rarity: 'uncommon',
    condition: { type: 'quiz_streak', value: 3 }
  },
  {
    id: 'quiz_series',
    name: 'Série Complète',
    description: 'Terminer une série de 5 questions au quiz',
    icon: 'award',
    unlockedAt: null,
    rarity: 'rare',
    condition: { type: 'quiz_series', value: 1 }
  },
  {
    id: 'quiz_hundred',
    name: 'Cent Bonnes Réponses',
    description: 'Totaliser 100 bonnes réponses au quiz',
    icon: 'target',
    unlockedAt: null,
    rarity: 'epic',
    condition: { type: 'quiz_correct', value: 100 }
  },
  {
    id: 'mastery_finance',
    name: 'Maîtrise Finance',
    description: '20 bonnes réponses en Finance',
    icon: 'bar-chart-2',
    unlockedAt: null,
    rarity: 'rare',
    condition: { type: 'category_correct', value: 20, category: 'finance' }
  },
  {
    id: 'mastery_science',
    name: 'Maîtrise Science',
    description: '20 bonnes réponses en Science',
    icon: 'atom',
    unlockedAt: null,
    rarity: 'rare',
    condition: { type: 'category_correct', value: 20, category: 'science' }
  },
  {
    id: 'mastery_geopolitics',
    name: 'Maîtrise Géopolitique',
    description: '20 bonnes réponses en Géopolitique',
    icon: 'globe',
    unlockedAt: null,
    rarity: 'rare',
    condition: { type: 'category_correct', value: 20, category: 'geopolitics' }
  },
  {
    id: 'mastery_tech',
    name: 'Maîtrise Tech',
    description: '20 bonnes réponses en Tech',
    icon: 'cpu',
    unlockedAt: null,
    rarity: 'rare',
    condition: { type: 'category_correct', value: 20, category: 'tech' }
  },
  {
    id: 'mastery_actualite',
    name: 'Maîtrise Actualité',
    description: '20 bonnes réponses en Actualité',
    icon: 'globe',
    unlockedAt: null,
    rarity: 'rare',
    condition: { type: 'category_correct', value: 20, category: 'actualité' }
  },
  {
    id: 'streak_week',
    name: 'Série de 7 Jours',
    description: 'Compléter au moins une série de 5 questions pendant 7 jours consécutifs',
    icon: 'flame',
    unlockedAt: null,
    rarity: 'epic',
    condition: { type: 'streak', value: 7 }
  }
];

const INITIAL_UNLOCKS: UnlockedFeature[] = [
  // Niveau 1 - Défaut
  { id: 'basic_widgets', name: 'Widgets Basiques', description: 'Accès aux données financières de base', category: 'data', unlockedAt: new Date().toISOString(), levelRequired: 1, hidden: false },
  { id: 'dark_theme', name: 'Thème Sombre', description: 'Interface sombre élégante', category: 'customization', unlockedAt: new Date().toISOString(), levelRequired: 1, hidden: false },
  
  // Niveau 2 - Débloquable
  { id: 'crypto_data', name: 'Données Crypto', description: 'Accès aux données cryptomonnaies', category: 'data', unlockedAt: '', levelRequired: 2, hidden: false },
  { id: 'blue_accent', name: 'Accent Bleu', description: 'Couleur d\'accent bleue cobalt', category: 'customization', unlockedAt: '', levelRequired: 2, hidden: false },
  
  // Niveau 3
  { id: 'tech_insights', name: 'Insights Tech', description: 'Données sur l\'innovation technologique', category: 'data', unlockedAt: '', levelRequired: 3, hidden: false },
  { id: 'compact_layout', name: 'Layout Compact', description: 'Disposition plus dense des widgets', category: 'interface', unlockedAt: '', levelRequired: 3, hidden: false },
  
  // Niveau 5
  { id: 'geopolitics', name: 'Géopolitique', description: 'Analyses géopolitiques en temps réel', category: 'data', unlockedAt: '', levelRequired: 5, hidden: false },
  { id: 'gold_accent', name: 'Accent Or', description: 'Couleur d\'accent or premium', category: 'customization', unlockedAt: '', levelRequired: 5, hidden: false },
  { id: 'particle_effects', name: 'Effets Particules', description: 'Animations de particules subtiles', category: 'customization', unlockedAt: '', levelRequired: 5, hidden: false },
  
  // Niveau 7
  { id: 'science_feed', name: 'Flux Science', description: 'Découvertes scientifiques récentes', category: 'data', unlockedAt: '', levelRequired: 7, hidden: false },
  { id: 'minimalist_theme', name: 'Thème Minimaliste', description: 'Interface ultra-épurée', category: 'customization', unlockedAt: '', levelRequired: 7, hidden: false },
  
  // Niveau 10
  { id: 'art_culture', name: 'Art & Culture', description: 'Données sur le marché de l\'art', category: 'data', unlockedAt: '', levelRequired: 10, hidden: false },
  { id: 'purple_accent', name: 'Accent Violet', description: 'Couleur d\'accent violet royal', category: 'customization', unlockedAt: '', levelRequired: 10, hidden: false },
  { id: 'advanced_animations', name: 'Animations Avancées', description: 'Transitions et animations complexes', category: 'customization', unlockedAt: '', levelRequired: 10, hidden: false },
  
  // Niveau 15
  { id: 'philosophy_wisdom', name: 'Sagesse Philosophique', description: 'Citations et concepts philosophiques', category: 'data', unlockedAt: '', levelRequired: 15, hidden: false },
  { id: 'neon_theme', name: 'Thème Néon', description: 'Interface avec effets néon', category: 'customization', unlockedAt: '', levelRequired: 15, hidden: false },
  
  // Niveau 20
  { id: 'exclusive_data', name: 'Données Exclusives', description: 'Accès aux données les plus rares', category: 'data', unlockedAt: '', levelRequired: 20, hidden: false },
  { id: 'custom_dashboard', name: 'Dashboard Personnalisé', description: 'Créez votre propre tableau de bord', category: 'interface', unlockedAt: '', levelRequired: 20, hidden: false },
  
  // Niveau 25
  { id: 'master_theme', name: 'Thème Maître', description: 'Thème ultime réservé aux maîtres', category: 'customization', unlockedAt: '', levelRequired: 25, hidden: false },
  { id: 'god_mode', name: 'Mode Dieu', description: 'Contrôle total de l\'interface', category: 'power', unlockedAt: '', levelRequired: 25, hidden: false },
  
  // SECRETS - Cachés
  { id: 'secret_matrix', name: 'Mode Matrix', description: 'Thème Matrix vert', category: 'secret', unlockedAt: '', levelRequired: 1, hidden: true, hint: 'Tapez le code célèbre...' },
  { id: 'secret_retro', name: 'Thème Rétro', description: 'Interface style années 80', category: 'secret', unlockedAt: '', levelRequired: 1, hidden: true, hint: 'Le passé revient...' },
  { id: 'secret_gold_rush', name: 'Ruée vers l\'Or', description: 'Accès aux données or historiques', category: 'secret', unlockedAt: '', levelRequired: 5, hidden: true, hint: 'Cherchez l\'or...' },
  { id: 'secret_quantum', name: 'Données Quantiques', description: 'Données sur l\'informatique quantique', category: 'secret', unlockedAt: '', levelRequired: 10, hidden: true, hint: 'Où le chat est mort et vivant...' },
  { id: 'secret_illuminati', name: 'Illuminati', description: 'Accès aux théories du complot', category: 'secret', unlockedAt: '', levelRequired: 15, hidden: true, hint: 'L\'œil qui voit tout...' },
  { id: 'secret_time_travel', name: 'Voyage Temporel', description: 'Données historiques exclusives', category: 'secret', unlockedAt: '', levelRequired: 20, hidden: true, hint: '1.21 gigawatts...' },
  { id: 'secret_42', name: 'La Réponse', description: 'La réponse à tout', category: 'secret', unlockedAt: '', levelRequired: 42, hidden: true, hint: 'La réponse ultime...' },
  { id: 'secret_triforce', name: 'Triforce', description: 'Le pouvoir en trois', category: 'secret', unlockedAt: '', levelRequired: 7, hidden: true, hint: 'Le pouvoir en trois...' },
  { id: 'secret_pi', name: 'Pi', description: 'Le nombre transcendant', category: 'secret', unlockedAt: '', levelRequired: 3, hidden: true, hint: '3.14159...' },
  { id: 'secret_omega', name: 'Oméga', description: 'La fin et le commencement', category: 'secret', unlockedAt: '', levelRequired: 25, hidden: true, hint: 'Dernière lettre...' },
  { id: 'secret_iddqd', name: 'Mode Dieu (IDDQD)', description: 'Référence légendaire', category: 'secret', unlockedAt: '', levelRequired: 13, hidden: true, hint: 'Tapez comme en 1993...' },
  { id: 'secret_moon', name: 'Lune', description: 'La nuit appelle', category: 'secret', unlockedAt: '', levelRequired: 5, hidden: true, hint: 'Quand la nuit tombe...' },
];

const INITIAL_CUSTOMIZATIONS: Customizations = {
  theme: 'dark',
  accentColor: '#3b82f6',
  fontStyle: 'modern',
  particleEffects: false,
  animations: true,
  layout: 'default'
};

const calculateXpToNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      level: 1,
      xp: 0,
      totalXp: 0,
      xpToNextLevel: calculateXpToNextLevel(1),
      achievements: INITIAL_ACHIEVEMENTS,
      unlockedFeatures: INITIAL_UNLOCKS,
      discoveredSecrets: [],
      stats: {
        dataPointsViewed: 0,
        secretsFound: 0,
        timeSpent: 0,
        interactions: 0,
        streakDays: 0,
        lastVisit: null,
        quizAnswered: 0,
        quizCorrect: 0,
        quizStreak: 0,
        bestQuizStreak: 0,
        quizSeriesCompleted: 0,
        categoryCorrect: {},
        lastSeriesDate: null,
        streakDaysQuiz: 0,
        lastDailyBonusDate: null,
      },
      customizations: INITIAL_CUSTOMIZATIONS,
      isPremium: false,
      isLifetime: false,
      widgetOrder: [],
      dashboardWidgetIds: [],
      firstName: '',
      quizAdaptiveLevel: 1.5,
      lastDiscoveredSecretId: null,
      lastUnlockedAchievementId: null,

      setFirstName: (value: string) => {
        set({ firstName: (value ?? '').trim().slice(0, 50) });
      },

      setPremium: (value: boolean) => {
        set({ isPremium: value });
      },

      setLifetime: (value: boolean) => {
        set((s) => ({
          isLifetime: value,
          isPremium: value ? true : s.isPremium,
        }));
      },

      setWidgetOrder: (order: string[]) => {
        set({ widgetOrder: order });
      },

      setDashboardWidgetIds: (ids: string[]) => {
        set({ dashboardWidgetIds: ids });
      },

      updateQuizAdaptiveLevel: (correct: boolean) => {
        set((state) => {
          const delta = correct ? 0.12 : -0.18;
          const next = Math.max(1, Math.min(3, state.quizAdaptiveLevel + delta));
          return { quizAdaptiveLevel: next };
        });
      },

      addQuizResult: (correct: boolean, difficulty: 1 | 2 | 3, category?: string) => {
        const state = get();
        const newAnswered = state.stats.quizAnswered + 1;
        const newCorrect = state.stats.quizCorrect + (correct ? 1 : 0);
        const newStreak = correct ? state.stats.quizStreak + 1 : 0;
        const newBestStreak = Math.max(state.stats.bestQuizStreak, newStreak);
        const baseXp = correct ? (difficulty === 1 ? 15 : difficulty === 2 ? 25 : 35) : 0;
        const streakBonus = correct && newStreak >= 3 ? 10 : 0;
        const isSeriesComplete = newAnswered % 5 === 0;
        const seriesBonus = correct && isSeriesComplete ? 25 : 0;

        const today = new Date().toISOString().slice(0, 10);
        let dailyBonusApplied = false;
        let dailyBonusXp = 0;
        if (isSeriesComplete && state.stats.lastDailyBonusDate !== today) {
          dailyBonusXp = 15;
          dailyBonusApplied = true;
        }

        const newCategoryCorrect = { ...state.stats.categoryCorrect };
        if (category != null && correct) {
          newCategoryCorrect[category] = (newCategoryCorrect[category] ?? 0) + 1;
        }

        let newLastSeriesDate = state.stats.lastSeriesDate;
        let newStreakDaysQuiz = state.stats.streakDaysQuiz;
        let newLastDailyBonusDate = state.stats.lastDailyBonusDate;
        if (isSeriesComplete) {
          newLastSeriesDate = today;
          if (state.stats.lastSeriesDate === null) {
            newStreakDaysQuiz = 1;
          } else {
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            if (state.stats.lastSeriesDate === yesterday) {
              newStreakDaysQuiz = state.stats.streakDaysQuiz + 1;
            } else if (state.stats.lastSeriesDate !== today) {
              newStreakDaysQuiz = 1;
            }
          }
          if (dailyBonusApplied) newLastDailyBonusDate = today;
        }

        const xpEarned = baseXp + streakBonus + seriesBonus + dailyBonusXp;
        set({
          stats: {
            ...state.stats,
            quizAnswered: newAnswered,
            quizCorrect: newCorrect,
            quizStreak: newStreak,
            bestQuizStreak: newBestStreak,
            quizSeriesCompleted: correct && isSeriesComplete ? state.stats.quizSeriesCompleted + 1 : state.stats.quizSeriesCompleted,
            categoryCorrect: newCategoryCorrect,
            lastSeriesDate: newLastSeriesDate,
            streakDaysQuiz: newStreakDaysQuiz,
            lastDailyBonusDate: newLastDailyBonusDate,
          },
        });
        if (xpEarned > 0) get().addXp(xpEarned, 'quiz');
        return { xpEarned, dailyBonusApplied };
      },

      addXp: (amount: number, _source?: string) => {
        set((state) => {
          const newXp = state.xp + amount;
          const newTotalXp = state.totalXp + amount;
          
          // Vérifier le level up
          let newLevel = state.level;
          let remainingXp = newXp;
          let xpNeeded = state.xpToNextLevel;
          
          while (remainingXp >= xpNeeded) {
            remainingXp -= xpNeeded;
            newLevel++;
            xpNeeded = calculateXpToNextLevel(newLevel);
          }
          
          // Débloquer automatiquement les fonctionnalités du nouveau niveau
          const updatedUnlocks = state.unlockedFeatures.map(feature => {
            if (feature.levelRequired <= newLevel && !feature.unlockedAt) {
              return { ...feature, unlockedAt: new Date().toISOString() };
            }
            return feature;
          });
          
          // Vérifier les achievements
          const updatedAchievements = state.achievements.map(ach => {
            if (ach.unlockedAt) return ach;
            
            let shouldUnlock = false;
            switch (ach.condition.type) {
              case 'level':
                shouldUnlock = newLevel >= ach.condition.value;
                break;
              case 'xp':
                shouldUnlock = newTotalXp >= ach.condition.value;
                break;
              case 'secrets':
                shouldUnlock = state.discoveredSecrets.length >= ach.condition.value;
                break;
              case 'data_viewed':
                shouldUnlock = state.stats.dataPointsViewed >= ach.condition.value;
                break;
              case 'time':
                shouldUnlock = state.stats.timeSpent >= ach.condition.value;
                break;
              case 'quiz_correct':
                shouldUnlock = state.stats.quizCorrect >= ach.condition.value;
                break;
              case 'streak':
                shouldUnlock = state.stats.streakDaysQuiz >= ach.condition.value;
                break;
              case 'quiz_streak':
                shouldUnlock = state.stats.bestQuizStreak >= ach.condition.value;
                break;
              case 'quiz_series':
                shouldUnlock = state.stats.quizSeriesCompleted >= ach.condition.value;
                break;
              case 'category_correct': {
                const cat = (ach.condition as { category?: string }).category;
                shouldUnlock = cat != null && (state.stats.categoryCorrect[cat] ?? 0) >= ach.condition.value;
                break;
              }
            }
            
            if (shouldUnlock) {
              return { ...ach, unlockedAt: new Date().toISOString() };
            }
            return ach;
          });
          const firstNewlyUnlocked = updatedAchievements.find(
            (ach, i) => !state.achievements[i]?.unlockedAt && ach.unlockedAt
          );
          const lastUnlockedAchievementId = firstNewlyUnlocked?.id ?? null;
          
          return {
            xp: remainingXp,
            totalXp: newTotalXp,
            xpToNextLevel: xpNeeded,
            level: newLevel,
            unlockedFeatures: updatedUnlocks,
            achievements: updatedAchievements,
            lastUnlockedAchievementId,
          };
        });
      },

      checkLevelUp: () => {
        const state = get();
        return state.xp >= state.xpToNextLevel;
      },

      unlockAchievement: (achievementId: string) => {
        set((state) => ({
          achievements: state.achievements.map(ach =>
            ach.id === achievementId && !ach.unlockedAt
              ? { ...ach, unlockedAt: new Date().toISOString() }
              : ach
          )
        }));
      },

      unlockFeature: (featureId: string) => {
        set((state) => ({
          unlockedFeatures: state.unlockedFeatures.map(feature =>
            feature.id === featureId && !feature.unlockedAt
              ? { ...feature, unlockedAt: new Date().toISOString() }
              : feature
          )
        }));
      },

      discoverSecret: (secretId: string) => {
        const state = get();
        if (state.discoveredSecrets.includes(secretId)) return;
        const newSecrets = [...state.discoveredSecrets, secretId];
        const updatedUnlocks = state.unlockedFeatures.map(feature =>
          feature.id === secretId
            ? { ...feature, unlockedAt: new Date().toISOString() }
            : feature
        );
        set({
          discoveredSecrets: newSecrets,
          unlockedFeatures: updatedUnlocks,
          lastDiscoveredSecretId: secretId,
          stats: { ...state.stats, secretsFound: newSecrets.length }
        });
        // Bonus XP en dehors du set() pour éviter boucle / mises à jour en cascade
        get().addXp(50, 'secret_discovery');
      },

      clearLastDiscoveredSecret: () => set({ lastDiscoveredSecretId: null }),

      clearLastUnlockedAchievement: () => set({ lastUnlockedAchievementId: null }),

      updateStats: (updates: Partial<UserStats>) => {
        set((state) => ({
          stats: { ...state.stats, ...updates }
        }));
      },

      updateCustomizations: (updates: Partial<Customizations>) => {
        set((state) => ({
          customizations: { ...state.customizations, ...updates }
        }));
      },

      resetCustomizations: () => {
        set({ customizations: INITIAL_CUSTOMIZATIONS });
      },

      getProgressPercentage: () => {
        const state = get();
        return Math.floor((state.xp / state.xpToNextLevel) * 100);
      },

      getAvailableUnlocks: () => {
        const state = get();
        return state.unlockedFeatures.filter(f => 
          f.unlockedAt && !f.hidden
        );
      },

      getHiddenUnlocks: () => {
        const state = get();
        const features = state.unlockedFeatures ?? [];
        return features.filter(f =>
          f.hidden && !f.unlockedAt
        );
      },

      resetProgress: () => {
        set({
          level: 1,
          xp: 0,
          totalXp: 0,
          xpToNextLevel: calculateXpToNextLevel(1),
          achievements: INITIAL_ACHIEVEMENTS,
          unlockedFeatures: INITIAL_UNLOCKS,
          discoveredSecrets: [],
          lastDiscoveredSecretId: null,
          lastUnlockedAchievementId: null,
          stats: {
            dataPointsViewed: 0,
            secretsFound: 0,
            timeSpent: 0,
            interactions: 0,
            streakDays: 0,
            lastVisit: null,
            quizAnswered: 0,
            quizCorrect: 0,
            quizStreak: 0,
            bestQuizStreak: 0,
            quizSeriesCompleted: 0,
            categoryCorrect: {},
            lastSeriesDate: null,
            streakDaysQuiz: 0,
            lastDailyBonusDate: null,
          },
          customizations: INITIAL_CUSTOMIZATIONS,
          isPremium: false,
          isLifetime: false,
          widgetOrder: [],
          dashboardWidgetIds: [],
          firstName: '',
          quizAdaptiveLevel: 1.5,
        });
      }
    }),
    {
      name: 'noesis-progress',
      version: 12,
      partialize: (state) => {
        const { lastDiscoveredSecretId: _1, lastUnlockedAchievementId: _2, ...rest } = state;
        return rest;
      },
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as { stats?: Partial<UserStats>; achievements?: Achievement[]; isPremium?: boolean; firstName?: string };
        if (version < 2 && state?.stats) {
          state.stats = {
            ...state.stats,
            quizAnswered: state.stats.quizAnswered ?? 0,
            quizCorrect: state.stats.quizCorrect ?? 0,
            quizStreak: state.stats.quizStreak ?? 0,
            bestQuizStreak: state.stats.bestQuizStreak ?? 0,
            quizSeriesCompleted: state.stats.quizSeriesCompleted ?? 0,
          };
        }
        if (version < 3 && state?.achievements) {
          const existingIds = new Set(state.achievements.map(a => a.id));
          const toAdd = INITIAL_ACHIEVEMENTS.filter(a => !existingIds.has(a.id));
          state.achievements = [...state.achievements, ...toAdd];
        }
        if (version < 4) {
          (state as { isPremium?: boolean }).isPremium = false;
        }
        if (version < 5 && state?.stats) {
          state.stats = {
            ...state.stats,
            categoryCorrect: state.stats.categoryCorrect ?? {},
            lastSeriesDate: state.stats.lastSeriesDate ?? null,
            streakDaysQuiz: state.stats.streakDaysQuiz ?? 0,
            lastDailyBonusDate: state.stats.lastDailyBonusDate ?? null,
          };
        }
        if (version < 5 && state?.achievements) {
          const existingIds = new Set(state.achievements.map(a => a.id));
          const toAdd = INITIAL_ACHIEVEMENTS.filter(a => !existingIds.has(a.id));
          state.achievements = [...state.achievements, ...toAdd];
        }
        if (version < 6) {
          (state as { widgetOrder?: string[] }).widgetOrder = [];
        }
        if (version < 7) {
          (state as { dashboardWidgetIds?: string[] }).dashboardWidgetIds = [];
        }
        if (version < 8) {
          (state as { firstName?: string }).firstName = '';
        }
        if (version < 9 && state?.achievements) {
          const existingIds = new Set(state.achievements.map(a => a.id));
          const toAdd = INITIAL_ACHIEVEMENTS.filter(a => !existingIds.has(a.id));
          state.achievements = [...state.achievements, ...toAdd];
        }
        if (version < 10) {
          (state as { isLifetime?: boolean }).isLifetime = false;
        }
        if (version < 11) {
          (state as { quizAdaptiveLevel?: number }).quizAdaptiveLevel = 1.5;
        }
        // Pathway cartes : niveau >= 1 pour déblocage ; niveau 0 ou négatif = corruption → ramener à 1
        const s = state as { level?: number; xp?: number; xpToNextLevel?: number };
        if (typeof s.level === 'number' && s.level < 1) {
          s.level = 1;
          s.xp = s.xp ?? 0;
          s.xpToNextLevel = s.xpToNextLevel ?? calculateXpToNextLevel(1);
        }
        return persisted;
      },
    }
  )
);
