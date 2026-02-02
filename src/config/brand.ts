/**
 * Configuration de marque NOESIS
 *
 * Positionnement : inclusif et orienté valeur (quiz, marchés, culture) pour
 * améliorer rétention et monétisation, sans le côté "élitiste" qui peut freiner
 * l’adoption et la conversion.
 */

export const BRAND = {
  /** Nom de l’app (affiché dans le header, titre onglet, etc.) */
  appName: 'NOESIS',
  /** Slogan / sous-titre : valeur claire (quiz + données + culture), inclusif */
  tagline: 'Quiz, marchés & culture',
  /** Nom de l’offre payante (cohérent avec le nom d’app) */
  proName: 'NOESIS Pro',
  /** Titre de la page (document) */
  documentTitle: 'NOESIS — Quiz, marchés & culture',
  /** Texte « À propos » dans les paramètres */
  aboutText: 'NOESIS — Quiz, marchés & culture',
  /** Chemin de l'icône / logo (web : favicon, apple-touch-icon, PWA) */
  logoPath: '/AppIcon-1024.png',
} as const;
