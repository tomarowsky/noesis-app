import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, Achievement, UnlockedFeature, UserStats, Customizations } from '@/types';

interface ProgressState extends UserProgress {
  // Actions
  addXp: (amount: number, source?: string) => void;
  checkLevelUp: () => boolean;
  unlockAchievement: (achievementId: string) => void;
  unlockFeature: (featureId: string) => void;
  discoverSecret: (secretId: string) => void;
  updateStats: (updates: Partial<UserStats>) => void;
  updateCustomizations: (updates: Partial<Customizations>) => void;
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
        lastVisit: null
      },
      customizations: INITIAL_CUSTOMIZATIONS,

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
            }
            
            if (shouldUnlock) {
              return { ...ach, unlockedAt: new Date().toISOString() };
            }
            return ach;
          });
          
          return {
            xp: remainingXp,
            totalXp: newTotalXp,
            xpToNextLevel: xpNeeded,
            level: newLevel,
            unlockedFeatures: updatedUnlocks,
            achievements: updatedAchievements
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
        set((state) => {
          if (state.discoveredSecrets.includes(secretId)) return state;
          
          const newSecrets = [...state.discoveredSecrets, secretId];
          
          // Débloquer la fonctionnalité secrète
          const updatedUnlocks = state.unlockedFeatures.map(feature =>
            feature.id === secretId
              ? { ...feature, unlockedAt: new Date().toISOString() }
              : feature
          );
          
          // Bonus XP pour avoir trouvé un secret
          const secretUnlock = updatedUnlocks.find(f => f.id === secretId);
          if (secretUnlock) {
            get().addXp(50, 'secret_discovery');
          }
          
          return {
            discoveredSecrets: newSecrets,
            unlockedFeatures: updatedUnlocks,
            stats: {
              ...state.stats,
              secretsFound: newSecrets.length
            }
          };
        });
      },

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
        return state.unlockedFeatures.filter(f => 
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
          stats: {
            dataPointsViewed: 0,
            secretsFound: 0,
            timeSpent: 0,
            interactions: 0,
            streakDays: 0,
            lastVisit: null
          },
          customizations: INITIAL_CUSTOMIZATIONS
        });
      }
    }),
    {
      name: 'noesis-progress',
      version: 1
    }
  )
);
