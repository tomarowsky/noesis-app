import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { FREE_FEATURES, PRO_FEATURES, PRICING, PAYWALL_COPY, INDICATIF_COPY } from '@/config/pricing';
import { useProgressStore } from '@/store/progressStore';
import { Check, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Appelé après upgrade Pro (avant onClose) pour afficher la célébration. */
  onUpgrade?: () => void;
}

/** Paywall Pro uniquement (mensuel / annuel). L'offre Lifetime a son propre paywall, accessible depuis les Réglages. */
export function PaywallModal({ isOpen, onClose, onUpgrade }: PaywallModalProps) {
  const setPremium = useProgressStore((s) => s.setPremium);

  const handleSelectPro = (_yearly: boolean) => {
    setPremium(true);
    onUpgrade?.();
    onClose();
  };

  const handleRestore = () => {
    // Restauration via App Store — à brancher sur votre IAP
    setPremium(true);
    onUpgrade?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-lg bg-[#0a0a0a] border-white/10 text-left max-h-[90vh] overflow-y-auto"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-amber-400" />
            {PAYWALL_COPY.title}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {PAYWALL_COPY.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {PAYWALL_COPY.freeTitle}
            </p>
            <p className="text-[10px] text-gray-500 mb-2">{PAYWALL_COPY.freeSubtitle}</p>
            <ul className="space-y-1.5">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-400">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-gray-500 mt-2 border-t border-white/5 pt-2 italic">{INDICATIF_COPY.definition} En Pro : temps réel — les marchés évoluent sous vos yeux.</p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {PAYWALL_COPY.proTitle}
            </p>
            <p className="text-[10px] text-amber-200/80 mb-2">{PAYWALL_COPY.proSubtitle}</p>
            <ul className="space-y-1.5">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-amber-100/90">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-[10px] text-gray-500 border-t border-white/5 pt-3 mt-1">
          {PAYWALL_COPY.whyPro}
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleSelectPro(true)}
            className={cn(
              'w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2',
              'bg-amber-500 text-black hover:bg-amber-400 transition-colors',
              'border border-amber-400/50'
            )}
          >
            {PRICING.yearly.label} — {PRICING.yearly.priceEur} € / {PRICING.yearly.period}
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-300/30 text-amber-900">
              {PRICING.yearly.badge}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectPro(false)}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
          >
            {PRICING.monthly.label} — {PRICING.monthly.priceEur} € / {PRICING.monthly.period}
          </button>
        </div>

        <DialogFooter className="flex flex-col gap-2 text-[10px] text-gray-500 border-t border-white/5 pt-3">
          <button
            type="button"
            onClick={handleRestore}
            className="text-amber-400 hover:text-amber-300 underline underline-offset-1 w-full text-center py-1"
          >
            {PAYWALL_COPY.restore}
          </button>
          <span>{PAYWALL_COPY.termsNote}</span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
