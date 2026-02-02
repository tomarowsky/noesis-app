import { useState } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { 
  Trophy, 
  X, 
  Lock, 
  Unlock, 
  Star,
  Footprints,
  Search,
  BarChart2,
  Clock,
  Key,
  Eye,
  Crown,
  Sun,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Achievement } from '@/types';

interface AchievementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getAchievementIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    'footprints': <Footprints className="w-5 h-5" />,
    'search': <Search className="w-5 h-5" />,
    'bar-chart-2': <BarChart2 className="w-5 h-5" />,
    'clock': <Clock className="w-5 h-5" />,
    'key': <Key className="w-5 h-5" />,
    'eye': <Eye className="w-5 h-5" />,
    'crown': <Crown className="w-5 h-5" />,
    'sun': <Sun className="w-5 h-5" />
  };
  return icons[iconName] || <Star className="w-5 h-5" />;
};

const getRarityColor = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common': return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    case 'rare': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    case 'epic': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
    case 'legendary': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    case 'mythic': return 'text-rose-400 border-rose-400/30 bg-rose-400/10';
    default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
  }
};

const getRarityLabel = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common': return 'Commun';
    case 'rare': return 'Rare';
    case 'epic': return 'Épique';
    case 'legendary': return 'Légendaire';
    case 'mythic': return 'Mythique';
    default: return 'Commun';
  }
};

export function AchievementsPanel({ isOpen, onClose }: AchievementsPanelProps) {
  const { achievements } = useProgressStore();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  const filteredAchievements = achievements.filter(ach => {
    if (filter === 'unlocked') return ach.unlockedAt;
    if (filter === 'locked') return !ach.unlockedAt;
    return true;
  });
  
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const progress = Math.round((unlockedCount / achievements.length) * 100);
  
  if (!isOpen) return null;
  
  return (
    <div className="hidden-menu safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Succès</h2>
            <p className="text-xs text-muted-foreground">
              {unlockedCount} / {achievements.length} débloqués
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progression globale</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">Chaque succès débloqué = bonus XP (Commun 35 → Mythique 750).</p>
      </div>
      
      {/* Filters */}
      <div className="flex gap-2 p-4 border-b border-border/50">
        {(['all', 'unlocked', 'locked'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              filter === f 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {f === 'all' ? 'Tous' : f === 'unlocked' ? 'Débloqués' : 'Verrouillés'}
          </button>
        ))}
      </div>
      
      {/* Achievements List */}
      <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {filteredAchievements.map((achievement, index) => (
          <div
            key={achievement.id}
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border transition-all duration-300",
              achievement.unlockedAt 
                ? getRarityColor(achievement.rarity)
                : "border-border/50 bg-muted/30 opacity-60"
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
              achievement.unlockedAt 
                ? "bg-current/20" 
                : "bg-muted"
            )}>
              {achievement.unlockedAt ? (
                getAchievementIcon(achievement.icon)
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={cn(
                  "font-semibold truncate",
                  !achievement.unlockedAt && "text-muted-foreground"
                )}>
                  {achievement.name}
                </h3>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full uppercase tracking-wider",
                  getRarityColor(achievement.rarity)
                )}>
                  {getRarityLabel(achievement.rarity)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {achievement.description}
              </p>
              
              {achievement.unlockedAt && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Unlock className="w-3 h-3" />
                  Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            
            {achievement.unlockedAt && achievement.rarity === 'mythic' && (
              <Sparkles className="w-5 h-5 text-rose-400 animate-pulse flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
