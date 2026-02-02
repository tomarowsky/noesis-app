/**
 * URLs et textes légaux pour conformité RGPD / publication Europe et internationale.
 * Avant soumission App Store (iPhone) ou Play Store : renseigner privacyPolicyUrl
 * et privacyContactEmail.
 */

import { BRAND } from './brand';

export const LEGAL = {
  /**
   * URL de la politique de confidentialité (hébergée).
   * Vide = affichage in-app uniquement. Pour publication : mettre l’URL de la page hébergée.
   */
  privacyPolicyUrl: '' as string,

  /**
   * URL des conditions générales d’utilisation (optionnel).
   */
  termsUrl: '' as string,

  /**
   * Nom du responsable du traitement (pour la politique in-app).
   */
  dataControllerName: BRAND.appName,

  /**
   * Contact pour exercer les droits RGPD (e-mail). Recommandé avant publication.
   */
  privacyContactEmail: '' as string,
} as const;
