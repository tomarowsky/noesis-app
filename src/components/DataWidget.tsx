import { useState, useEffect } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { 
  TrendingUp, 
  TrendingDown, 
  Lock, 
  Eye, 
  EyeOff,
  RefreshCw,
  Info,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DataWidget as DataWidgetType } from '@/types';

interface DataWidgetProps {
  widget: DataWidgetType;
  isLocked?: boolean;
  onUnlock?: () => void;
}

// Données simulées pour les widgets
const generateWidgetData = (category: string, _rarity: string): DataWidgetType['data'] => {
  const dataGenerators: Record<string, () => DataWidgetType['data']> = {
    finance: () => ({
      value: `$${(Math.random() * 5000 + 1000).toFixed(2)}`,
      change: (Math.random() - 0.5) * 10,
      context: 'Indice boursier en temps réel',
      insight: 'Les marchés montrent une volatilité accrue',
      source: 'Bloomberg Terminal'
    }),
    crypto: () => ({
      value: `$${(Math.random() * 80000 + 20000).toFixed(0)}`,
      change: (Math.random() - 0.5) * 15,
      context: 'Bitcoin / USD',
      insight: 'Momentum haussier sur les 24h',
      source: 'CoinGecko Pro'
    }),
    tech: () => ({
      value: `${(Math.random() * 100 + 50).toFixed(0)}M`,
      change: Math.random() * 20,
      context: 'Nouvelles levées de fonds',
      insight: 'Le secteur IA domine les investissements',
      source: 'Crunchbase'
    }),
    geopolitics: () => ({
      value: `${(Math.random() * 10 + 1).toFixed(1)}`,
      change: (Math.random() - 0.5) * 2,
      context: 'Indice de tension géopolitique',
      insight: 'Relations internationales sous surveillance',
      source: 'Intelligence Économique'
    }),
    science: () => ({
      value: `${(Math.random() * 50 + 10).toFixed(0)}`,
      change: Math.random() * 5,
      context: 'Publications scientifiques / jour',
      insight: 'Avancée majeure en biotechnologie',
      source: 'Nature Research'
    }),
    art: () => ({
      value: `$${(Math.random() * 100 + 10).toFixed(1)}M`,
      change: (Math.random() - 0.5) * 30,
      context: 'Volume de ventes aux enchères',
      insight: 'Le marché de l\'art contemporain résiste',
      source: 'Artnet Analytics'
    }),
    philosophy: () => ({
      value: `"${['Connais-toi toi-même', 'L\'existence précède l\'essence', 'Le doute est le commencement de la sagesse'][Math.floor(Math.random() * 3)]}"`,
      change: 0,
      context: 'Citation du jour',
      insight: 'Socrate - 470-399 av. J.-C.',
      source: 'Corpus Philosophique'
    })
  };
  
  const generator = dataGenerators[category] || dataGenerators.finance;
  return generator();
};

export function DataWidget({ widget, isLocked = false }: DataWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [widgetData, setWidgetData] = useState(widget.data);
  const updateStats = useProgressStore(state => state.updateStats);
  
  // Rafraîchir les données
  const refreshData = () => {
    if (isLocked) return;
    
    setIsRefreshing(true);
    setTimeout(() => {
      setWidgetData(generateWidgetData(widget.category, widget.rarity));
      setIsRefreshing(false);
      updateStats({ dataPointsViewed: useProgressStore.getState().stats.dataPointsViewed + 1 });
    }, 800);
  };
  
  // Rafraîchissement automatique
  useEffect(() => {
    if (isLocked) return;
    
    const interval = setInterval(refreshData, widget.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [isLocked, widget.refreshInterval]);
  
  const getRarityColor = () => {
    switch (widget.rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      case 'mythic': return 'text-rose-400';
      default: return 'text-gray-400';
    }
  };
  
  const getCategoryIcon = () => {
    switch (widget.category) {
      case 'finance': return '💰';
      case 'crypto': return '₿';
      case 'tech': return '💻';
      case 'geopolitics': return '🌍';
      case 'science': return '🔬';
      case 'art': return '🎨';
      case 'philosophy': return '🧠';
      default: return '📊';
    }
  };
  
  if (isLocked) {
    return (
      <div className="widget-card locked flex flex-col items-center justify-center py-8">
        <Lock className="w-10 h-10 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground text-center">
          Débloque au niveau {widget.levelRequired}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {widget.title}
        </p>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "widget-card cursor-pointer",
        isExpanded && "col-span-2 row-span-2"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getCategoryIcon()}</span>
          <div>
            <h3 className="font-semibold text-sm">{widget.title}</h3>
            <span className={cn("text-xs uppercase tracking-wider", getRarityColor())}>
              {widget.rarity}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {widget.rarity === 'legendary' && (
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              refreshData();
            }}
            className={cn(
              "p-1.5 rounded-lg hover:bg-white/10 transition-colors",
              isRefreshing && "animate-spin"
            )}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Main Value */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gradient">
            {widgetData.value}
          </span>
          {widgetData.change !== undefined && widgetData.change !== 0 && (
            <span className={cn(
              "flex items-center text-sm",
              widgetData.change > 0 ? "text-green-400" : "text-red-400"
            )}>
              {widgetData.change > 0 ? (
                <TrendingUp className="w-4 h-4 mr-0.5" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-0.5" />
              )}
              {Math.abs(widgetData.change).toFixed(2)}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{widgetData.context}</p>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in-up">
          <div className="flex items-start gap-2 mb-3">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{widgetData.insight}</p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Source: {widgetData.source}</span>
            <span>
              Mis à jour: {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          {widget.rarity === 'mythic' && (
            <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-rose-500/30">
              <p className="text-xs text-rose-300">
                🔮 Donnée exclusive - Niveau {widget.levelRequired} requis
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="capitalize">{widget.category}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <><EyeOff className="w-3 h-3" /> Réduire</>
          ) : (
            <><Eye className="w-3 h-3" /> Détails</>
          )}
        </button>
      </div>
    </div>
  );
}
