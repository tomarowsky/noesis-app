import { useState } from 'react';
import { X, Check, XCircle, Zap, Target, ChevronRight, HelpCircle, Flame, Gift, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgressStore } from '@/store/progressStore';
import { QUIZ_QUESTIONS, drawAdaptiveQuestionsWithActualité, getDifficultyStars, QUIZ_DIFFICULTY_MAX } from '@/data/quizQuestions';
import type { QuizQuestion } from '@/types';

const QUESTIONS_PER_SESSION = 5;

interface QuizPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optionnel : ouvrir le paywall Pro (nudge post-série pour les non-Pro). */
  onOpenPaywall?: () => void;
}

export function QuizPanel({ isOpen, onClose, onOpenPaywall }: QuizPanelProps) {
  const [step, setStep] = useState<'intro' | 'playing' | 'result'>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastXpEarned, setLastXpEarned] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [dailyBonusThisSession, setDailyBonusThisSession] = useState(false);
  const [perfectSeriesThisSession, setPerfectSeriesThisSession] = useState(false);

  const addQuizResult = useProgressStore(s => s.addQuizResult);
  const addXp = useProgressStore(s => s.addXp);
  const updateQuizAdaptiveLevel = useProgressStore(s => s.updateQuizAdaptiveLevel);
  const quizAdaptiveLevel = useProgressStore(s => s.quizAdaptiveLevel);
  const stats = useProgressStore(s => s.stats);
  const isPremium = useProgressStore(s => s.isPremium);

  const today = new Date().toISOString().slice(0, 10);
  const dailyChallengeAvailable = stats.lastDailyBonusDate !== today;

  const startSession = () => {
    setQuestions(drawAdaptiveQuestionsWithActualité(QUIZ_QUESTIONS, QUESTIONS_PER_SESSION, quizAdaptiveLevel, isPremium));
    setDailyBonusThisSession(false);
    setPerfectSeriesThisSession(false);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setShowFeedback(false);
    setSessionCorrect(0);
    setSessionXp(0);
    setSessionStreak(0);
    setStep('playing');
  };

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasSelection = selectedIndex !== null;
  const isCorrect = hasSelection && selectedIndex === currentQuestion?.correctIndex;

  const handleSelectOption = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedIndex(optionIndex);
  };

  const handleConfirm = () => {
    if (!currentQuestion || selectedIndex === null || showFeedback) return;
    setShowFeedback(true);
    const correct = selectedIndex === currentQuestion.correctIndex;
    if (correct) {
      setSessionCorrect(c => c + 1);
      setSessionStreak(s => s + 1);
    } else {
      setSessionStreak(0);
    }
    updateQuizAdaptiveLevel(correct);
    const { xpEarned, dailyBonusApplied } = addQuizResult(correct, currentQuestion.difficulty, currentQuestion.category);
    setLastXpEarned(xpEarned);
    setSessionXp(prev => prev + xpEarned);
    if (dailyBonusApplied) setDailyBonusThisSession(true);
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex(i => i + 1);
      setSelectedIndex(null);
      setShowFeedback(false);
    } else {
      // Série parfaite ★★★ : 5/5 en difficulté expert → +10 XP bonus
      const isPerfectExpert = sessionCorrect === 5 && questions.length === 5 && questions.every(q => q.difficulty === 3);
      if (isPerfectExpert) {
        addXp(10, 'quiz_perfect_series');
        setSessionXp(prev => prev + 10);
        setPerfectSeriesThisSession(true);
      }
      setStep('result');
    }
  };

  const handleClose = () => {
    setStep('intro');
    setQuestions([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/98 backdrop-blur-xl flex flex-col">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Quiz Noesis</h2>
            <p className="text-[10px] text-gray-500">
              {step === 'intro' && 'Testez vos connaissances'}
              {step === 'playing' && `Question ${currentIndex + 1}/${questions.length}`}
              {step === 'result' && 'Série terminée'}
            </p>
          </div>
        </div>
        {step === 'playing' && sessionStreak > 0 && (
          <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">
            Série : {sessionStreak}
          </span>
        )}
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full">
        {step === 'intro' && (
          <div className="space-y-6">
            <p className="text-gray-400 text-sm leading-relaxed">
              Culture G et <strong className="text-white/90">actualité</strong> : finance, science, géopolitique, tech, culture, et questions récentes pour vous tenir informé.
              Choisissez une réponse, <strong className="text-white/90">confirmez</strong>, puis découvrez l&apos;explication. Seules les bonnes réponses donnent de l&apos;XP.
            </p>
            {/* Actualité : gratuit = 0–1 question d'actualité ; Pro = 2–3 par série */}
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="text-xs font-medium text-purple-200 mb-1">Questions d&apos;actualité</p>
              <p className="text-[11px] text-gray-400">
                Chaque série inclut des questions sur l&apos;actualité récente (économie, climat, tech, géopolitique).
                {isPremium ? (
                  <> <span className="text-emerald-400">Pro</span> : 2 à 3 questions d&apos;actualité par série pour rester informé.</>
                ) : (
                  <> Gratuit : jusqu&apos;à 1 question d&apos;actualité par série. Passez en Pro pour plus d&apos;actualité.</>
                )}
              </p>
            </div>
            {/* Difficulté adaptative : mise à jour après chaque réponse */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs font-medium text-blue-200 mb-1">Difficulté adaptative</p>
              <p className="text-[11px] text-gray-400">
                Les questions s&apos;ajustent à vous : bonnes réponses → un peu plus difficiles, erreurs → un peu plus faciles.
                Toujours pertinent, dès les premières réponses.
              </p>
            </div>

            {/* Défi du jour + streak — récompense l'engagement sans FOMO (bonus unique par jour) */}
            <div className="grid grid-cols-1 gap-2">
              {dailyChallengeAvailable && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <Gift className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-200">Défi du jour</p>
                    <p className="text-xs text-gray-400">Complétez une série (5 questions) · +15 XP bonus</p>
                  </div>
                </div>
              )}
              {stats.streakDaysQuiz > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                  <Flame className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-200">Série de {stats.streakDaysQuiz} jour{stats.streakDaysQuiz > 1 ? 's' : ''}</p>
                    <p className="text-xs text-gray-400">Au moins une série par jour</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Bonne réponse</p>
                  <p className="text-xs text-gray-500">Facile +15 XP · Moyen +25 XP · Difficile +35 XP</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Bonus série</p>
                  <p className="text-xs text-gray-500">3 bonnes d&apos;affilée → +10 XP · 5 questions → +25 XP</p>
                </div>
              </div>
              <p className="text-[11px] text-amber-500/90">
                Réponse fausse = pas d&apos;XP, mais une explication pour apprendre et réessayer plus tard.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500">
              <span>Réponses : {stats.quizCorrect}/{stats.quizAnswered}</span>
              {stats.quizAnswered > 0 && <span>· Meilleure série : {stats.bestQuizStreak}</span>}
              {stats.streakDaysQuiz > 0 && <span>· Série : {stats.streakDaysQuiz} j.</span>}
            </div>
            <button
              onClick={startSession}
              className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            >
              Lancer 5 questions
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'playing' && currentQuestion && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-400 capitalize">
                {currentQuestion.category}
              </span>
              <span className="text-gray-500" title={`Difficulté de la question : de ★ à ★★★ (max ${QUIZ_DIFFICULTY_MAX}). Les questions sont ordonnées du plus facile au plus difficile dans la série.`}>
                Difficulté {getDifficultyStars(currentQuestion.difficulty)} ({currentQuestion.difficulty}/{QUIZ_DIFFICULTY_MAX})
              </span>
            </div>
            <p className="text-lg font-medium text-white leading-snug">
              {currentQuestion.question}
            </p>

            {/* Choix : clic = sélection uniquement, pas de validation */}
            <div className="space-y-2">
              {currentQuestion.options.map((option, i) => {
                const correct = i === currentQuestion.correctIndex;
                const selected = selectedIndex === i;
                const showAsCorrect = showFeedback && correct;
                const showAsWrong = showFeedback && selected && !correct;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(i)}
                    disabled={showFeedback}
                    className={cn(
                      "w-full p-4 rounded-xl text-left border transition-all",
                      !showFeedback && "hover:border-white/20 hover:bg-white/5 border-white/10",
                      !showFeedback && selected && "border-amber-500/40 bg-amber-500/10",
                      showFeedback && "cursor-default",
                      showAsCorrect && "border-emerald-500/50 bg-emerald-500/10",
                      showAsWrong && "border-red-500/50 bg-red-500/10",
                      showFeedback && !showAsCorrect && !showAsWrong && "opacity-60 border-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {!showFeedback ? (
                        <span
                          className={cn(
                            "w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center",
                            selected ? "border-amber-400 bg-amber-500/30" : "border-white/20"
                          )}
                        >
                          {selected && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                        </span>
                      ) : showAsCorrect ? (
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      ) : showAsWrong ? (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      ) : (
                        <span className="w-5 h-5 flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          showAsCorrect && "text-emerald-200",
                          showAsWrong && "text-red-200",
                          !showFeedback && "text-white"
                        )}
                      >
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Étape 1 : bouton Confirmer (avant feedback) */}
            {!showFeedback && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!hasSelection}
                className={cn(
                  "w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                  hasSelection
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-white/5 text-gray-500 cursor-not-allowed"
                )}
              >
                Confirmer ma réponse
              </button>
            )}

            {/* Étape 2 : après confirmation — cadre explicatif et récompense */}
            {showFeedback && (
              <div className="space-y-4">
                {/* Résultat : bonne réponse = XP ; mauvaise = pas d'XP + explication */}
                {isCorrect ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <p className="text-sm font-semibold text-emerald-300 mb-1">Bonne réponse !</p>
                    {lastXpEarned > 0 && (
                      <p className="text-lg font-bold text-amber-400">+{lastXpEarned} XP</p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
                    <p className="text-sm font-semibold text-red-300">Mauvaise réponse</p>
                    <p className="text-xs text-red-200/90">
                      La bonne réponse était : <strong>{currentQuestion.options[currentQuestion.correctIndex]}</strong>
                    </p>
                    <p className="text-[11px] text-amber-400/90">
                      Pas d&apos;XP cette fois — répondez correctement pour en gagner. Vous pouvez réessayer une prochaine série.
                    </p>
                  </div>
                )}

                {/* Explication (toujours affichée — détaillée pour CSP+, scroll si long) */}
                {currentQuestion.explanation && (
                  <div className="p-4 rounded-xl bg-white/5 border border-amber-500/20 max-h-[40vh] overflow-y-auto">
                    <p className="text-[10px] font-semibold text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                      {currentQuestion.difficulty === 3 ? 'En détail' : 'Le saviez-vous ?'}
                    </p>
                    <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  {lastXpEarned > 0 && (
                    <span className="text-sm font-semibold text-amber-400">+{lastXpEarned} XP</span>
                  )}
                  <button
                    onClick={handleNext}
                    className="ml-auto py-2 px-4 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 flex items-center gap-1"
                  >
                    {isLastQuestion ? 'Voir le résultat' : 'Question suivante'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                {sessionCorrect}/{questions.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">bonnes réponses cette série</p>
              {perfectSeriesThisSession && (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-amber-200">Série parfaite ★★★</span>
                  <span className="text-xs text-amber-400/90">+10 XP bonus</span>
                </div>
              )}
              {sessionXp > 0 && (
                <p className="text-lg font-semibold text-amber-400 mt-2">
                  Vous avez gagné {sessionXp} XP cette série
                  {dailyBonusThisSession && (
                    <span className="block text-sm font-medium text-emerald-400 mt-1">
                      +15 XP Défi du jour
                    </span>
                  )}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-400 text-center">
              Chaque série complétée vous rapproche du niveau suivant. Les explications vous aident à progresser pour les prochaines fois.
            </p>
            {!isPremium && onOpenPaywall && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2">
                <p className="text-[11px] text-amber-200/90">
                  En Pro : 2 à 3 questions d&apos;actualité par série pour rester informé.
                </p>
                <button
                  type="button"
                  onClick={onOpenPaywall}
                  className="shrink-0 text-[11px] font-medium text-amber-300 hover:text-amber-200 underline underline-offset-1"
                >
                  Découvrir Pro
                </button>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={startSession}
                className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-white"
              >
                Nouvelle série
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl font-medium border border-white/20 text-white hover:bg-white/5"
              >
                Retour
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
