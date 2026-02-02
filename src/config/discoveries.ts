/**
 * Messages « wow » et bénéfices affichés lors d'une découverte secrète.
 * Renforce le sentiment de récompense et la différenciation de l'app.
 */

export const SECRET_DISCOVERY: Record<string, { wowMessage: string; benefit: string }> = {
  secret_matrix: {
    wowMessage: 'Vous avez trouvé le code. Bienvenue dans la Matrice.',
    benefit: 'Thème Matrix débloqué',
  },
  secret_retro: {
    wowMessage: 'Le passé revient. Vous faites partie des initiés.',
    benefit: 'Thème Rétro débloqué',
  },
  secret_gold_rush: {
    wowMessage: 'L\'or ne brille pas pour tout le monde. Vous avez l\'œil.',
    benefit: 'Données or historiques débloquées',
  },
  secret_quantum: {
    wowMessage: 'Là où le chat est mort et vivant. Vous pensez autrement.',
    benefit: 'Données quantiques débloquées',
  },
  secret_illuminati: {
    wowMessage: 'L\'œil qui voit tout. Vous êtes entré dans le cercle.',
    benefit: 'Contenu exclusif débloqué',
  },
  secret_time_travel: {
    wowMessage: '1.21 gigawatts. Le voyage temporel commence.',
    benefit: 'Données historiques exclusives',
  },
  secret_42: {
    wowMessage: '42 — La réponse à la grande question. Vous faites partie du petit nombre qui l\'a trouvée.',
    benefit: 'La Réponse débloquée',
  },
  secret_triforce: {
    wowMessage: 'Le pouvoir en trois. Vous avez l\'étoffe d\'un héros.',
    benefit: 'Triforce débloquée',
  },
  secret_pi: {
    wowMessage: 'Le nombre infini. Votre curiosité est transcendante.',
    benefit: 'Pi débloqué',
  },
  secret_omega: {
    wowMessage: 'La fin est un commencement. Vous voyez au-delà.',
    benefit: 'Oméga débloqué',
  },
  secret_iddqd: {
    wowMessage: 'IDDQD. Les vrais savent.',
    benefit: 'Mode Dieu (référence) débloqué',
  },
  secret_moon: {
    wowMessage: 'La lune veille. Vous êtes des noctambules.',
    benefit: 'Lune débloquée',
  },
  secret_nexus: {
    wowMessage: 'Le nexus relie tout. Vous voyez les connexions.',
    benefit: 'Nexus débloqué',
  },
  secret_cosmos: {
    wowMessage: "L'ordre du cosmos. Vous pensez grand.",
    benefit: 'Cosmos débloqué',
  },
  secret_infini: {
    wowMessage: "L'infini n'a pas de fin. Vous allez au bout.",
    benefit: 'Infini débloqué',
  },
  secret_easter: {
    wowMessage: "Œuf de Pâques trouvé ! Vous avez l'œil.",
    benefit: 'Œuf de Pâques débloqué',
  },
};
