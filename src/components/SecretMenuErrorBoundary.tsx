import { Component, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
}

interface State {
  hasError: boolean;
}

/** Error boundary pour SecretMenu : si le menu plante au rendu, on affiche un fallback au lieu d'un écran noir. */
export class SecretMenuErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && this.props.isOpen && !prevProps.isOpen) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.props.isOpen) return null;
    if (this.state.hasError) {
      return (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0c0c0c] p-6 safe-area-top safe-area-bottom"
          style={{ isolation: 'isolate' }}
        >
          <p className="text-white font-semibold mb-2">Une erreur s&apos;est produite</p>
          <p className="text-gray-400 text-sm mb-4 text-center">Le menu secret a rencontré un problème.</p>
          <button
            type="button"
            onClick={() => { this.setState({ hasError: false }); this.props.onClose(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/30 text-purple-200 font-medium"
          >
            <X className="w-4 h-4" />
            Fermer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
