import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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

// Codes clavier (desktop) — séquences de touches
const SECRET_CODES: Record<string, string[]> = {
  'secret_matrix': ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
  'secret_retro': ['r', 'e', 't', 'r', 'o'],
  'secret_gold_rush': ['g', 'o', 'l', 'd'],
  'secret_quantum': ['q', 'u', 'a', 'n', 't', 'u', 'm'],
  'secret_42': ['4', '2']
};

// Codes texte (iPhone / clavier virtuel) — taper dans le champ ci-dessous
const TEXT_CODES: Record<string, string> = {
  'retro': 'secret_retro',
  'gold': 'secret_gold_rush',
  'quantum': 'secret_quantum',
  '42': 'secret_42',
  'matrix': 'secret_matrix',
  'konami': 'secret_matrix',
  'illuminati': 'secret_illuminati',
  'oeil': 'secret_illuminati',
  'delorean': 'secret_time_travel',
  'bttf': 'secret_time_travel',
  'gigawatts': 'secret_time_travel',
  '121': 'secret_time_travel',
  'voyage': 'secret_time_travel',
  'triforce': 'secret_triforce',
  'zelda': 'secret_triforce',
  'pi': 'secret_pi',
  '314': 'secret_pi',
  'omega': 'secret_omega',
  'iddqd': 'secret_iddqd',
  'lune': 'secret_moon',
  'moon': 'secret_moon',
};

export function SecretMenu({ isOpen, onClose }: SecretMenuProps) {
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [discoveredCode, setDiscoveredCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const { discoveredSecrets, discoverSecret, level } = useProgressStore();
  
  const hiddenUnlocks = useProgressStore(state => state.getHiddenUnlocks());

  const tryUnlockByCode = (raw: string) => {
    const normalized = raw.trim().toLowerCase();
    if (!normalized) return;
    const secretId = TEXT_CODES[normalized];
    if (!secretId) {
      setCodeError('Code inconnu');
      return;
    }
    if (discoveredSecrets.includes(secretId)) {
      setCodeError('Déjà débloqué');
      return;
    }
    const secretUnlock = hiddenUnlocks.find(u => u.id === secretId);
    if (!secretUnlock || level < secretUnlock.levelRequired) {
      setCodeError(`Niveau ${secretUnlock?.levelRequired ?? '?'} requis`);
      return;
    }
    discoverSecret(secretId);
    setDiscoveredCode(secretId);
    setCodeInput('');
    setCodeError(null);
    setTimeout(() => setDiscoveredCode(null), 3000);
  };
  
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
              discoverSecret(secretId);
              setDiscoveredCode(secretId);
              setTimeout(() => setDiscoveredCode(null), 3000);
            }
          }
        });
        
        return newSequence;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, discoveredSecrets, hiddenUnlocks, level, discoverSecret]);
  
  const getSecretIcon = (secretId: string) => {
    switch (secretId) {
      case 'secret_matrix': return <Terminal className="w-5 h-5" />;
      case 'secret_retro': return <Gamepad2 className="w-5 h-5" />;
      case 'secret_gold_rush': return <Sparkles className="w-5 h-5" />;
      case 'secret_quantum': return <Zap className="w-5 h-5" />;
      case 'secret_42': return <Key className="w-5 h-5" />;
      case 'secret_illuminati': return <Eye className="w-5 h-5" />;
      case 'secret_time_travel': return <Zap className="w-5 h-5" />;
      case 'secret_triforce': return <Sparkles className="w-5 h-5" />;
      case 'secret_pi': return <Key className="w-5 h-5" />;
      case 'secret_omega': return <Key className="w-5 h-5" />;
      case 'secret_iddqd': return <Zap className="w-5 h-5" />;
      case 'secret_moon': return <Sparkles className="w-5 h-5" />;
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
      'secret_42': 'La Réponse',
      'secret_triforce': 'Triforce',
      'secret_pi': 'Pi',
      'secret_omega': 'Oméga',
      'secret_iddqd': 'Mode Dieu (IDDQD)',
      'secret_moon': 'Lune',
    };
    return names[secretId] || secretId;
  };
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  if (!containerRef.current && typeof document !== 'undefined') {
    containerRef.current = document.createElement('div');
    containerRef.current.id = 'secret-menu-portal';
    document.body.appendChild(containerRef.current);
  }

  if (!isOpen) return null;

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="secret-menu-title"
      className="fixed inset-0 z-[200] flex flex-col bg-[#0c0c0c] safe-area-top safe-area-bottom"
      style={{ minHeight: '100vh' }}
    >
      {/* Header — toujours visible */}
      <div className="flex shrink-0 items-center justify-between p-4 border-b border-white/10 bg-[#111111]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 id="secret-menu-title" className="text-lg font-semibold text-white">Secrets & Mystères</h2>
            <p className="text-xs text-gray-500">
              {discoveredSecrets.length} / {hiddenUnlocks.length + discoveredSecrets.length} découverts
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      {/* Content — scroll fluide iOS */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-4 main-scroll safe-area-bottom bg-[#0c0c0c]"
        style={{ minHeight: 0, WebkitOverflowScrolling: 'touch' }}
      >
        {/* Instructions */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-gray-400 mb-2">
            Des secrets sont cachés dans l'app. Trouvez les codes pour débloquer des fonctionnalités exclusives.
          </p>
          <p className="text-xs text-purple-300">
            Sur iPhone : entrez le code ci-dessous (le clavier s'affiche). Sur ordinateur : vous pouvez aussi taper au clavier.
          </p>
        </div>

        {/* Champ de saisie — iOS : clavier virtuel ; desktop : optionnel */}
        <div className="space-y-2">
          <label htmlFor="secret-code" className="text-sm font-medium text-gray-400">
            Entrer un code
          </label>
          <div className="flex gap-2">
            <input
              id="secret-code"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="ex. retro, gold, 42…"
              value={codeInput}
              onChange={(e) => {
                setCodeInput(e.target.value);
                setCodeError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  tryUnlockByCode(codeInput);
                }
              }}
              className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              type="button"
              onClick={() => tryUnlockByCode(codeInput)}
              className="px-4 py-3 rounded-xl bg-purple-500/30 text-purple-200 font-medium shrink-0 active:scale-[0.98] border border-purple-500/30"
            >
              Valider
            </button>
          </div>
          {codeError && (
            <p className="text-xs text-red-400">{codeError}</p>
          )}
        </div>
        
        {/* Séquence de touches (debug) */}
        {showSequence && keySequence.length > 0 && (
          <div className="p-2 rounded bg-white/5 text-xs font-mono text-gray-400">
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
                    <p className="text-xs text-gray-500">Débloqué !</p>
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
            <Lock className="w-4 h-4 text-gray-500" />
            Secrets Cachés
          </h3>
          <div className="space-y-2">
            {hiddenUnlocks.map(secret => (
              <div 
                key={secret.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-80"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-500">???</p>
                  {secret.hint && (
                    <p className="text-xs text-gray-500 italic">
                      &quot;{secret.hint}&quot;
                    </p>
                  )}
                </div>
                {level < secret.levelRequired && (
                  <span className="text-xs text-gray-500">
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
          className="w-full p-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
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
              <p className="text-sm text-gray-400">
                {getSecretName(discoveredCode)} est maintenant disponible
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return containerRef.current ? createPortal(modal, containerRef.current) : modal;
}
