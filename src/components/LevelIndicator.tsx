import { useEffect, useState } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { Star, Zap, Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LevelIndicator() {
  const { level, xp, xpToNextLevel, getProgressPercentage } = useProgressStore();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(level);
  
  useEffect(() => {
    if (level > prevLevel) {
      setShowLevelUp(true);
      const timer = setTimeout(() => {
        setShowLevelUp(false);
        setPrevLevel(level);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [level, prevLevel]);
  
  const getLevelIcon = () => {
    if (level >= 25) return <Crown className="w-4 h-4" />;
    if (level >= 15) return <Sparkles className="w-4 h-4" />;
    if (level >= 10) return <Star className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };
  
  const getLevelTitle = () => {
    if (level >= 25) return 'Maître';
    if (level >= 20) return 'Expert';
    if (level >= 15) return 'Vétéran';
    if (level >= 10) return 'Initié';
    if (level >= 5) return 'Adepte';
    return 'Novice';
  };
  
  const progress = getProgressPercentage();
  
  return (
    <div className="relative">
      {/* Level Up Animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative text-center animate-fade-in-scale">
            <div className="text-6xl mb-4 animate-bounce-subtle">
              {getLevelIcon()}
            </div>
            <h2 className="text-4xl font-bold text-gradient mb-2">
              NIVEAU {level}
            </h2>
            <p className="text-xl text-muted-foreground">
              {getLevelTitle()} débloqué !
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Sparkles 
                  key={i} 
                  className="w-6 h-6 text-yellow-400 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Compact Level Display */}
      <div className="flex items-center gap-3">
        <div className={cn(
          "level-badge",
          level >= 20 && "animate-pulse-glow"
        )}>
          {getLevelIcon()}
          <span>Niv. {level}</span>
        </div>
        
        <div className="flex-1 min-w-[100px]">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{xp} XP</span>
            <span>{xpToNextLevel} XP</span>
          </div>
          <div className="xp-bar">
            <div 
              className="xp-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
