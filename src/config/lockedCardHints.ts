/**
 * Messages cryptiques affichés au clic sur une carte verrouillée (Explorer).
 * Exercice de pensée : l'utilisateur doit faire le lien avec la progression (niveau, quiz, XP).
 * Randomisé par carte et par clic pour maximiser les configurations.
 */

/** Messages avec {N} = nombre, {Nth} = ordinal (1ère, 12e) */
export const LOCKED_HINTS_WITH_LEVEL: string[] = [
  'La {Nth} marche ouvre la porte.',
  'Au degré {N}, la serrure cède.',
  'Monte jusqu\'à l\'étape {N}.',
  'Le palier {N} déverrouille.',
  'Quand tu atteindras le {Nth} échelon…',
  'La porte s\'ouvre au niveau {N}.',
  'L\'initié de rang {N} peut entrer.',
  'Seul le {Nth} degré ouvre ce coffre.',
  'La {Nth} marche de l\'escalier. Pas avant.',
  'Au niveau {N}, la lumière vient.',
  'Grimpe jusqu\'au {Nth} barreau.',
  'Le gardien cède au {Nth} voyageur.',
  'La clé est au {Nth} étage.',
  'Pas avant le {Nth} pas.',
  'L\'ordre {N} ouvre la serrure.',
  'La {Nth} porte sur le chemin.',
  'Attends le {Nth} jour de l\'ascension.',
  'Le {Nth} degré de sagesse débloque.',
  'La carte se lit à partir du niveau {N}.',
  'Un initié de niveau {N} verrait ce qui est caché.',
];

/** Messages orientés XP / quiz (pas de niveau explicite) */
export const LOCKED_HINTS_XP_QUIZ: string[] = [
  'Les bonnes réponses pavent le chemin.',
  'Chaque bonne réponse rapproche.',
  'Le quiz ouvre des portes.',
  'L\'XP est la clé.',
  'Réponds, monte, débloque.',
  'Les séries de cinq mènent à la lumière.',
  'La sagesse s\'acquiert question après question.',
  'Chaque bonne réponse est une marche.',
  'Le savoir déverrouille.',
  'Joue. Monte. Ouvre.',
  'Les défis du quiz mènent ici.',
  'L\'expérience accumulée ouvre les coffres.',
  'Chaque série complétée rapproche.',
  'La persévérance au quiz est récompensée.',
  'Les points d\'expérience forgent les clés.',
  'Réponds encore. La porte attend.',
  'Le quiz est l\'escalier.',
  'Bonne réponse après bonne réponse.',
  'L\'ascension passe par les questions.',
  'Les initiés ont répondu avant de voir.',
];

/** Messages génériques / mystérieux */
export const LOCKED_HINTS_GENERIC: string[] = [
  'L\'ascension déverrouille.',
  'La progression est la clé.',
  'Certains disent que les initiés montent.',
  'La curiosité mène au déblocage.',
  'Continue. La serrure n\'est pas éternelle.',
  'Ce qui est fermé peut s\'ouvrir — avec le temps.',
  'Pas encore. Mais bientôt.',
  'La patience et l\'effort ouvrent toutes les portes.',
  'Tu n\'es pas assez avancé. Pour l\'instant.',
  'La voie est longue. Continue.',
  'Un indice : monte.',
  'La serrure répond à la progression.',
  'Ce qui est caché se révèle à qui avance.',
  'L\'app récompense ceux qui persistent.',
  'Pas ici. Pas encore.',
  'La porte connaît ton niveau.',
  'Réfléchis : comment débloquer dans cette app ?',
  'Quiz. XP. Niveau. La réponse est dans l\'app.',
  'Un exercice de pensée : comment ouvrir cette carte ?',
  'La clé n\'est pas un mot de passe. C\'est une marche.',
];

const ALL_WITH_LEVEL = LOCKED_HINTS_WITH_LEVEL;
const ALL_XP = LOCKED_HINTS_XP_QUIZ;
const ALL_GENERIC = LOCKED_HINTS_GENERIC;

function formatOrdinal(n: number): string {
  if (n === 1) return '1ère';
  return n + 'e';
}

/**
 * Retourne un message cryptique aléatoire pour une carte verrouillée.
 * Randomisation basée sur widgetId + levelRequired + seed (timestamp ou compteur)
 * pour maximiser la variété entre cartes et entre clics.
 */
export function getLockedCardMessage(
  widgetId: string,
  levelRequired: number,
  _title: string,
  seed?: number
): string {
  const s = seed ?? Date.now();
  const hash = (widgetId + levelRequired + s).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = (i: number) => (hash + i * 31) % 100;

  // Choisir une catégorie (pondérée : plus de niveau pour donner l'indice principal)
  const categoryChoice = rng(1) % 100;
  let pool: string[];
  let replaceLevel = false;
  if (categoryChoice < 45) {
    pool = ALL_WITH_LEVEL;
    replaceLevel = true;
  } else if (categoryChoice < 75) {
    pool = ALL_XP;
  } else {
    pool = ALL_GENERIC;
  }

  const index = Math.abs(rng(2) + Math.floor(s / 1000)) % pool.length;
  let message = pool[index];
  if (replaceLevel) {
    message = message.replace(/\{Nth\}/g, formatOrdinal(levelRequired)).replace(/\{N\}/g, String(levelRequired));
  }
  return message;
}
