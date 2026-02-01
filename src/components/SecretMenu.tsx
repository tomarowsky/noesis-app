import { useState, useEffect } from 'react';
import { useProgressStore } from '@/store/progressStore';
import { 
  X, 
  Lock, 
  Unlock, 
  Key, 
  Eye, 
  Sparkles,
  Terminal,
  Gamepad2,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecretMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Codes secrets et leurs déclencheurs
const SECRET_CODES: Record<string, string[]> = {
  'secret_matrix': ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
  'secret_retro': ['r', 'e', 't', 'r', 'o'],
  'secret_gold_rush': ['g', 'o', 'l', 'd'],
  'secret_quantum': ['q', 'u', 'a', 'n', 't', 'u', 'm'],
  'secret_42': ['4', '2']
};

export function SecretMenu({ isOpen, onClose }: SecretMenuProps) {
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [discoveredCode, setDiscoveredCode] = useState<string | null>(null);
  const { discoveredSecrets, unlockFeature, addXp, level } = useProgressStore();
  
  const hiddenUnlocks = useProgressStore(state => state.getHiddenUnlocks());
  
  // Écouter les touches pour les codes secrets
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeySequence(prev => {
        const newSequence = [...prev, key].slice(-15);
        
        // Vérifier les codes secrets
        Object.entries(SECRET_CODES).forEach(([secretId, code]) => {
          const codeStr = code.join('').toLowerCase();
          const sequenceStr = newSequence.join('');
          
          if (sequenceStr.endsWith(codeStr) && !discoveredSecrets.includes(secretId)) {
            // Vérifier le niveau requis
            const secretUnlock = hiddenUnlocks.find(u => u.id === secretId);
            if (secretUnlock && level >= secretUnlock.levelRequired) {
              unlockFeature(secretId);
              setDiscoveredCode(secretId);
              addXp(100, 'secret_code');
              
              setTimeout(() => setDiscoveredCode(null), 3000);
            }
          }
        });
        
        return newSequence;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, discoveredSecrets, hiddenUnlocks, level, unlockFeature, addXp]);
  
  const getSecretIcon = (secretId: string) => {
    switch (secretId) {
      case 'secret_matrix': return <Terminal className="w-5 h-5" />;
      case 'secret_retro': return <Gamepad2 className="w-5 h-5" />;
      case 'secret_gold_rush': return <Sparkles className="w-5 h-5" />;
      case 'secret_quantum': return <Zap className="w-5 h-5" />;
      case 'secret_42': return <Key className="w-5 h-5" />;
      default: return <Key className="w-5 h-5" />;
    }
  };
  
  const getSecretName = (secretId: string) => {
    const names: Record<string, string> = {
      'secret_matrix': 'Mode Matrix',
      'secret_retro': 'Thème Rétro',
      'secret_gold_rush': 'Ruée vers l\'Or',
      'secret_quantum': 'Données Quantiques',
      'secret_illuminati': 'Illuminati',
      'secret_time_travel': 'Voyage Temporel',
      'secret_42': 'La Réponse'
    };
    return names[secretId] || secretId;
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="hidden-menu safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Secrets & Mystères</h2>
            <p className="text-xs text-muted-foreground">
              {discoveredSecrets.length} / {hiddenUnlocks.length + discoveredSecrets.length} découverts
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
      
      {/* Content */}
      <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {/* Instructions */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">
            Des secrets sont cachés dans l'app. Trouvez les codes pour débloquer des fonctionnalités exclusives.
          </p>
          <p className="text-xs text-primary">
            Indice: Certains codes sont célèbres, d'autres nécessitent de l'exploration...
          </p>
        </div>
        
        {/* Séquence de touches (debug) */}
        {showSequence && keySequence.length > 0 && (
          <div className="p-2 rounded bg-muted text-xs font-mono">
            {keySequence.join(' ')}
          </div>
        )}
        
        {/* Secrets découverts */}
        {discoveredSecrets.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Unlock className="w-4 h-4 text-green-400" />
              Secrets Débloqués
            </h3>
            <div className="space-y-2">
              {discoveredSecrets.map(secretId => (
                <div 
                  key={secretId}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/30",
                    discoveredCode === secretId && "secret-unlocked"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    {getSecretIcon(secretId)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-400">{getSecretName(secretId)}</p>
                    <p className="text-xs text-muted-foreground">Débloqué !</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Secrets à découvrir */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            Secrets Cachés
          </h3>
          <div className="space-y-2">
            {hiddenUnlocks.map(secret => (
              <div 
                key={secret.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50 opacity-70"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-muted-foreground">???</p>
                  {secret.hint && (
                    <p className="text-xs text-muted-foreground italic">
                      "{secret.hint}"
                    </p>
                  )}
                </div>
                {level < secret.levelRequired && (
                  <span className="text-xs text-muted-foreground">
                    Niv. {secret.levelRequired}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Easter Egg: Afficher la séquence */}
        <button
          onClick={() => setShowSequence(!showSequence)}
          className="w-full p-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showSequence ? 'Cacher' : 'Afficher'} la séquence
        </button>
      </div>
      
      {/* Notification de découverte */}
      {discoveredCode && (
        <div className="absolute bottom-20 left-4 right-4 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-green-400 animate-pulse" />
            <div>
              <p className="font-semibold text-green-400">Secret découvert !</p>
              <p className="text-sm text-muted-foreground">
                {getSecretName(discoveredCode)} est maintenant disponible
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
