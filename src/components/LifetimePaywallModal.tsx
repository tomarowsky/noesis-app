import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { LIFETIME_FEATURES, PRICING, PAYWALL_COPY } from '@/config/pricing';
import { useProgressStore } from '@/store/progressStore';
import { Check, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LifetimePaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Paywall dédié à l'offre Lifetime — accessible uniquement depuis les Réglages.
 * Effet reflet / exclusivité pour créer un sentiment de rareté.
 */
export function LifetimePaywallModal({ isOpen, onClose }: LifetimePaywallModalProps) {
  const setLifetime = useProgressStore((s) => s.setLifetime);

  const handleSelectLifetime = () => {
    setLifetime(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-lg bg-[#0a0a0a] border-0 text-left max-h-[90vh] overflow-y-auto p-0 overflow-hidden"
        showCloseButton={true}
      >
        {/* Bordure dégradé + reflet pour effet exclusivité */}
        <div className="relative rounded-xl">
          <div
            className="absolute inset-0 rounded-xl opacity-90"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, transparent 40%, transparent 60%, rgba(251,191,36,0.08) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            className="absolute inset-0 rounded-xl opacity-50 lifetime-shine-reflect"
            style={{
              background: 'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.05) 60%, transparent 100%)',
              backgroundSize: '200% 100%',
              pointerEvents: 'none',
            }}
          />
          <div className="relative rounded-xl border border-amber-500/30 bg-gradient-to-b from-[#0f0a05] to-[#0a0a0a] p-5">
            <DialogHeader className="pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="flex items-center gap-2 text-white">
                  <Crown className="w-5 h-5 text-amber-400" />
                  {PAYWALL_COPY.lifetimeTitle}
                </DialogTitle>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/30 text-amber-200 border border-amber-500/50">
                  {PRICING.lifetime.badge}
                </span>
              </div>
              <DialogDescription className="text-amber-200/80 text-sm mt-1">
                {PAYWALL_COPY.lifetimeSubtitle}
              </DialogDescription>
            </DialogHeader>

            <p className="text-[11px] text-amber-200/70 mb-4">
              {PAYWALL_COPY.lifetimeWhy}
            </p>

            <ul className="space-y-2.5 mb-5">
              {LIFETIME_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-amber-100/90">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleSelectLifetime}
              className={cn(
                'w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2',
                'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black',
                'hover:from-amber-400 hover:via-amber-300 hover:to-amber-400 transition-all',
                'border border-amber-400/60 shadow-lg shadow-amber-500/25',
                'relative overflow-hidden'
              )}
            >
              <Crown className="w-5 h-5" />
              <span>
                {PAYWALL_COPY.lifetimeCta} — {PRICING.lifetime.priceEur} €
              </span>
            </button>

            <DialogFooter className="text-[10px] text-gray-500 border-t border-amber-500/10 pt-3 mt-4">
              Offre exclusive, accessible depuis les Réglages. Un seul paiement, à vie.
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
