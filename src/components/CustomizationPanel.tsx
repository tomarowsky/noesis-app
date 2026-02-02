import { useState } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { 
  X, 
  Palette, 
  Check, 
  Layout,
  Type,
  Sparkles,
  Zap,
  Grid,
  List,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { cn, hexToHsl } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface CustomizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCENT_COLORS = [
  { id: 'blue', name: 'Bleu Cobalt', value: '#3b82f6', level: 1 },
  { id: 'gold', name: 'Or Premium', value: '#f59e0b', level: 5 },
  { id: 'purple', name: 'Violet Royal', value: '#8b5cf6', level: 10 },
  { id: 'emerald', name: 'Émeraude', value: '#10b981', level: 3 },
  { id: 'rose', name: 'Rose', value: '#f43f5e', level: 7 },
  { id: 'cyan', name: 'Cyan', value: '#06b6d4', level: 12 },
  { id: 'orange', name: 'Orange', value: '#f97316', level: 15 },
];

const THEMES = [
  { id: 'dark', name: 'Sombre', level: 1 },
  { id: 'minimalist', name: 'Minimaliste', level: 7 },
  { id: 'neon', name: 'Néon', level: 15 },
  { id: 'matrix', name: 'Matrix', level: 1, secret: 'secret_matrix' },
  { id: 'retro', name: 'Rétro', level: 1, secret: 'secret_retro' },
  { id: 'gold', name: 'Or', level: 5, secret: 'secret_gold_rush' },
  { id: 'master', name: 'Maître', level: 25 },
];

const FONT_STYLES = [
  { id: 'modern', name: 'Moderne', level: 1 },
  { id: 'classic', name: 'Classique', level: 5 },
  { id: 'mono', name: 'Monospace', level: 10 },
];

const LAYOUTS = [
  { id: 'default', name: 'Défaut', icon: Grid, level: 1 },
  { id: 'compact', name: 'Compact', icon: List, level: 3 },
  { id: 'expanded', name: 'Étendu', icon: Maximize2, level: 10 },
];

export function CustomizationPanel({ isOpen, onClose }: CustomizationPanelProps) {
  const { 
    customizations, 
    updateCustomizations, 
    resetCustomizations, 
    level, 
    discoveredSecrets 
  } = useProgressStore();
  
  const [activeTab, setActiveTab] = useState<'theme' | 'color' | 'font' | 'layout'>('theme');
  
  const isFeatureUnlocked = (_featureId: string, requiredLevel: number, secretId?: string) => {
    if (secretId) {
      return discoveredSecrets.includes(secretId);
    }
    return level >= requiredLevel;
  };
  
  const handleColorChange = (color: typeof ACCENT_COLORS[0]) => {
    if (!isFeatureUnlocked(color.id, color.level)) return;
    updateCustomizations({ accentColor: color.value });
    const hsl = hexToHsl(color.value);
    document.documentElement.style.setProperty('--primary', hsl);
    document.documentElement.style.setProperty('--accent', hsl);
    document.documentElement.style.setProperty('--ring', hsl);
  };
  
  const handleThemeChange = (theme: typeof THEMES[0]) => {
    if (!isFeatureUnlocked(theme.id, theme.level, theme.secret)) return;
    updateCustomizations({ theme: theme.id });
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    if (theme.id !== 'dark') {
      document.body.classList.add(`theme-${theme.id}`);
    }
  };
  
  const handleFontChange = (font: typeof FONT_STYLES[0]) => {
    if (!isFeatureUnlocked(font.id, font.level)) return;
    updateCustomizations({ fontStyle: font.id });
  };
  
  const handleLayoutChange = (layout: typeof LAYOUTS[0]) => {
    if (!isFeatureUnlocked(layout.id, layout.level)) return;
    updateCustomizations({ layout: layout.id });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="hidden-menu safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Personnalisation</h2>
            <p className="text-xs text-muted-foreground">
              Personnalisez votre expérience
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
      
      {/* Tabs */}
      <div className="flex gap-1 p-2 border-b border-border/50 overflow-x-auto">
        {[
          { id: 'theme', label: 'Thème', icon: Layout },
          { id: 'color', label: 'Couleur', icon: Palette },
          { id: 'font', label: 'Police', icon: Type },
          { id: 'layout', label: 'Layout', icon: Grid },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Thèmes disponibles
            </h3>
            {THEMES.map(theme => {
              const isUnlocked = isFeatureUnlocked(theme.id, theme.level, theme.secret);
              const isActive = customizations.theme === theme.id;
              
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme)}
                  disabled={!isUnlocked}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl border transition-all",
                    isActive 
                      ? "border-primary bg-primary/10" 
                      : "border-border/50 bg-muted/30",
                    !isUnlocked && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    theme.id === 'matrix' && "bg-green-500/20 text-green-400",
                    theme.id === 'retro' && "bg-pink-500/20 text-pink-400",
                    theme.id === 'neon' && "bg-purple-500/20 text-purple-400",
                    theme.id === 'gold' && "bg-yellow-500/20 text-yellow-400",
                    theme.id === 'master' && "bg-white/20 text-white",
                    (theme.id === 'dark' || theme.id === 'minimalist') && "bg-gray-500/20 text-gray-400"
                  )}>
                    <Layout className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{theme.name}</p>
                    {!isUnlocked && (
                      <p className="text-xs text-muted-foreground">
                        {theme.secret 
                          ? 'Secret requis' 
                          : `Niveau ${theme.level} requis`}
                      </p>
                    )}
                  </div>
                  {isActive && <Check className="w-5 h-5 text-primary" />}
                </button>
              );
            })}
          </div>
        )}
        
        {/* Color Tab */}
        {activeTab === 'color' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Couleurs d'accent
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {ACCENT_COLORS.map(color => {
                const isUnlocked = level >= color.level;
                const currentAccent = (customizations.accentColor ?? '').trim().toLowerCase();
                const isActive = currentAccent === color.value.trim().toLowerCase();
                
                return (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color)}
                    disabled={!isUnlocked}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all",
                      isActive 
                        ? "border-primary bg-primary/10" 
                        : "border-border/50 bg-muted/30",
                      !isUnlocked && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: color.value }}
                    />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{color.name}</p>
                      {!isUnlocked && (
                        <p className="text-xs text-muted-foreground">
                          Niv. {color.level}
                        </p>
                      )}
                    </div>
                    {isActive && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Font Tab */}
        {activeTab === 'font' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Styles de police
            </h3>
            {FONT_STYLES.map(font => {
              const isUnlocked = level >= font.level;
              const isActive = customizations.fontStyle === font.id;
              
              return (
                <button
                  key={font.id}
                  onClick={() => handleFontChange(font)}
                  disabled={!isUnlocked}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl border transition-all",
                    isActive 
                      ? "border-primary bg-primary/10" 
                      : "border-border/50 bg-muted/30",
                    !isUnlocked && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Type className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={cn(
                      "font-semibold",
                      font.id === 'modern' && "font-sans",
                      font.id === 'classic' && "font-serif",
                      font.id === 'mono' && "font-mono"
                    )}>
                      {font.name}
                    </p>
                    {!isUnlocked && (
                      <p className="text-xs text-muted-foreground">
                        Niveau {font.level} requis
                      </p>
                    )}
                  </div>
                  {isActive && <Check className="w-5 h-5 text-primary" />}
                </button>
              );
            })}
          </div>
        )}
        
        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Dispositions
            </h3>
            {LAYOUTS.map(layout => {
              const isUnlocked = level >= layout.level;
              const isActive = customizations.layout === layout.id;
              
              return (
                <button
                  key={layout.id}
                  onClick={() => handleLayoutChange(layout)}
                  disabled={!isUnlocked}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-xl border transition-all",
                    isActive 
                      ? "border-primary bg-primary/10" 
                      : "border-border/50 bg-muted/30",
                    !isUnlocked && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <layout.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{layout.name}</p>
                    {!isUnlocked && (
                      <p className="text-xs text-muted-foreground">
                        Niveau {layout.level} requis
                      </p>
                    )}
                  </div>
                  {isActive && <Check className="w-5 h-5 text-primary" />}
                </button>
              );
            })}
          </div>
        )}
        
        {/* Effects Section */}
        <div className="mt-6 pt-6 border-t border-border/50 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Effets visuels
          </h3>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Effets de particules</p>
                <p className="text-xs text-muted-foreground">Particules animées en arrière-plan</p>
              </div>
            </div>
            <Switch 
              checked={customizations.particleEffects}
              onCheckedChange={(checked) => updateCustomizations({ particleEffects: checked })}
              disabled={level < 5}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Animations</p>
                <p className="text-xs text-muted-foreground">Transitions et animations fluides</p>
              </div>
            </div>
            <Switch 
              checked={customizations.animations}
              onCheckedChange={(checked) => updateCustomizations({ animations: checked })}
            />
          </div>
        </div>

        {/* Rétablir les paramètres par défaut */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Rétablir thème, couleur, police, layout et effets par défaut ?')) {
                resetCustomizations();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Rétablir les paramètres par défaut
          </button>
        </div>
      </div>
    </div>
  );
}
