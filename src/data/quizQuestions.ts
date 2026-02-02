import type { QuizQuestion } from '@/types';

/** Banque de questions type jeu de société / quiz — thèmes alignés avec l'app (finance, science, géopolitique, tech, culture). */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ——— FINANCE ———
  {
    id: 'fin-1',
    category: 'finance',
    question: 'Que mesure le CAC 40 ?',
    options: ['Les 40 plus grandes capitalisations françaises', 'Un indice de 40 devises', 'Le taux de change euro/dollar', '40 obligations d\'État'],
    correctIndex: 0,
    difficulty: 1,
    explanation: 'Le CAC 40 est l\'indice des 40 plus grandes entreprises cotées sur Euronext Paris, pondéré par la capitalisation flottante. Il sert de référence pour les fonds indiciels, les produits dérivés et le sentiment sur l\'économie française. Rec revu régulièrement par un comité d\'experts (Stoxx Ltd) pour refléter les plus grosses capitalisations.',
  },
  {
    id: 'fin-2',
    category: 'finance',
    question: 'Qu\'est-ce qu\'un « bear market » ?',
    options: ['Marché haussier', 'Marché baissier prolongé', 'Marché des matières premières', 'Marché des crypto-monnaies'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'Un bear market désigne une baisse prolongée et significative des cours (convention : souvent −20 % ou plus depuis un sommet). Il s\'accompagne généralement de pessimisme, de réduction du crédit et parfois de récession. L\'inverse est un bull market. La durée et l\'ampleur varient (quelques mois à plusieurs années) ; les marchés actions ont connu des bear markets majeurs en 2000–2002, 2008–2009, 2022.',
  },
  {
    id: 'fin-3',
    category: 'finance',
    question: 'Quel rôle joue une banque centrale ?',
    options: ['Vendre des actions', 'Contrôler la masse monétaire et les taux', 'Gérer les impôts', 'Prêter aux particuliers uniquement'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'La banque centrale pilote la politique monétaire : taux directeurs (auquel les banques se refinancent), liquidités, et parfois achats d\'actifs (QE). Objectifs typiques : stabilité des prix (inflation cible, ex. 2 %), soutien à l\'emploi (Fed), stabilité financière. Elle ne prête pas aux ménages ni aux entreprises ; elle agit via le système bancaire et les marchés. Indépendance souvent garantie par la loi pour éviter la subordination aux cycles politiques.',
  },
  {
    id: 'fin-4',
    category: 'finance',
    question: 'Que signifie « IPO » (introduction en Bourse) ?',
    options: ['Fusion d\'entreprises', 'Première vente d\'actions au public', 'Rachat d\'une société', 'Dividende exceptionnel'],
    correctIndex: 1,
    difficulty: 2,
    explanation: 'IPO = Initial Public Offering : première offre publique d\'actions d\'une entreprise.',
  },
  {
    id: 'fin-5',
    category: 'finance',
    question: 'Qu\'est-ce que le « spread » sur le forex ?',
    options: ['La différence entre cours acheteur et vendeur', 'Le taux de change officiel', 'La commission de la banque', 'Le taux directeur'],
    correctIndex: 0,
    difficulty: 2,
    explanation: 'Le spread est l\'écart entre le prix d\'achat (ask) et le prix de vente (bid).',
  },
  {
    id: 'fin-6',
    category: 'finance',
    question: 'Quel indice est souvent considéré comme le « baromètre » de la tech américaine ?',
    options: ['S&P 500', 'Dow Jones', 'NASDAQ', 'Russell 2000'],
    correctIndex: 2,
    difficulty: 1,
    explanation: 'Le NASDAQ regroupe de nombreuses valeurs technologiques (Apple, Microsoft, etc.).',
  },
  {
    id: 'fin-7',
    category: 'finance',
    question: 'Que mesure le PIB ?',
    options: ['Le niveau des prix', 'La richesse créée sur une période', 'Le taux de chômage', 'La dette publique'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'Le PIB (Produit intérieur brut) mesure la valeur des biens et services produits.',
  },
  {
    id: 'fin-8',
    category: 'finance',
    question: 'Qu\'est-ce qu\'un « dividende » ?',
    options: ['Une taxe sur les gains', 'Une part des bénéfices versée aux actionnaires', 'Un prêt à l\'entreprise', 'Une prime d\'émission'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'Le dividende est la part des bénéfices distribuée aux actionnaires.',
  },
  // ——— SCIENCE ———
  {
    id: 'sci-1',
    category: 'science',
    question: 'Quelle particule est porteuse de la charge électrique négative ?',
    options: ['Le proton', 'Le neutron', 'L\'électron', 'Le photon'],
    correctIndex: 2,
    difficulty: 1,
    explanation: 'L\'électron porte la charge élémentaire négative (−e ≈ −1,6×10⁻¹⁹ C) ; le proton a +e, le neutron est neutre. Cette structure (atome de Rutherford-Bohr puis mécanique quantique) fonde l\'électricité, la chimie des liaisons et l\'électronique. La charge est quantifiée et conservée dans les réactions.',
  },
  {
    id: 'sci-2',
    category: 'science',
    question: 'Dans quel domaine l\'unité « parsec » est-elle utilisée ?',
    options: ['Le temps', 'La distance astronomique', 'La masse', 'L\'énergie'],
    correctIndex: 1,
    difficulty: 2,
    explanation: 'Un parsec vaut environ 3,26 années-lumière ; utilisé en astronomie.',
  },
  {
    id: 'sci-3',
    category: 'science',
    question: 'Qu\'est-ce que la photosynthèse ?',
    options: ['La digestion des plantes', 'La production de sucres à partir de lumière et CO₂', 'La respiration des feuilles', 'L\'absorption d\'eau par les racines'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'Réaction globale : 6 CO₂ + 6 H₂O + lumière → C₆H₁₂O₆ (glucose) + 6 O₂. Les chloroplastes (chlorophylle) absorbent la lumière ; la phase claire produit ATP et NADPH ; le cycle de Calvin fixe le CO₂ en sucres. Processus à la base de la chaîne alimentaire et de la production d\'oxygène atmosphérique ; la biomasse et les combustibles fossiles en sont des dérivés.',
  },
  {
    id: 'sci-4',
    category: 'science',
    question: 'Quel gaz compose majoritairement l\'atmosphère terrestre ?',
    options: ['Oxygène', 'Dioxyde de carbone', 'Azote', 'Hydrogène'],
    correctIndex: 2,
    difficulty: 1,
    explanation: 'L\'azote (N₂) représente environ 78 % de l\'atmosphère.',
  },
  {
    id: 'sci-5',
    category: 'science',
    question: 'Qu\'est-ce qu\'un « trou noir » en physique ?',
    options: ['Une étoile éteinte', 'Une région où la gravité empêche toute sortie de lumière', 'Un nuage de gaz', 'Une galaxie lointaine'],
    correctIndex: 1,
    difficulty: 2,
    explanation: 'La courbure de l\'espace-temps est telle que même la lumière ne peut s\'échapper.',
  },
  {
    id: 'sci-6',
    category: 'science',
    question: 'Quelle molécule est le support de l\'information génétique ?',
    options: ['Les protéines', 'L\'ARN', 'L\'ADN', 'Les lipides'],
    correctIndex: 2,
    difficulty: 1,
    explanation: 'L\'ADN code les gènes ; l\'ARN en est une copie utilisée pour la synthèse des protéines.',
  },
  // ——— GÉOPOLITIQUE ———
  {
    id: 'geo-1',
    category: 'geopolitics',
    question: 'Quel organisme international fixe les règles du commerce mondial ?',
    options: ['Le FMI', 'L\'OMC', 'L\'ONU', 'La BCE'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'L\'OMC (Organisation mondiale du commerce), créée en 1995 (succédant au GATT), régit les règles du commerce international : réduction des tarifs, non-discrimination (clause NPF, traitement national), règlement des différends. Son organe d\'appel est paralysé depuis 2019 (blocage des nominations par les États-Unis), ce qui affaiblit le système multilatéral.',
  },
  {
    id: 'geo-2',
    category: 'geopolitics',
    question: 'Quel traité a créé la zone euro ?',
    options: ['Traité de Rome', 'Traité de Maastricht', 'Traité de Lisbonne', 'Traité de Versailles'],
    correctIndex: 1,
    difficulty: 2,
    explanation: 'Le traité de Maastricht (1992) a posé les bases de l\'Union économique et monétaire.',
  },
  {
    id: 'geo-3',
    category: 'geopolitics',
    question: 'Qu\'est-ce que le « soft power » ?',
    options: ['La force militaire', 'L\'influence par la culture et les valeurs', 'Le pouvoir économique seul', 'La diplomatie secrète'],
    correctIndex: 1,
    difficulty: 2,
    explanation: 'Influence sans coercition : culture, modèle politique, éducation.',
  },
  {
    id: 'geo-4',
    category: 'geopolitics',
    question: 'Quel pays n\'est pas membre permanent du Conseil de sécurité de l\'ONU ?',
    options: ['France', 'Chine', 'Allemagne', 'Russie'],
    correctIndex: 2,
    difficulty: 2,
    explanation: 'Les 5 permanents sont : Chine, États-Unis, France, Royaume-Uni, Russie.',
  },
  {
    id: 'geo-5',
    category: 'geopolitics',
    question: 'Quel indicateur mesure le développement humain (santé, éducation, niveau de vie) ?',
    options: ['PIB par habitant', 'IDH', 'Gini', 'Taux de chômage'],
    correctIndex: 1,
    difficulty: 2,
    explanation: 'L\'IDH (Indice de développement humain) combine espérance de vie, éducation et revenu.',
  },
  // ——— TECH ———
  {
    id: 'tech-1',
    category: 'tech',
    question: 'Que signifie « API » dans le développement logiciel ?',
    options: ['Interface de programmation permettant à des logiciels de communiquer', 'Un langage de programmation', 'Un type de base de données', 'Un protocole de sécurité'],
    correctIndex: 0,
    difficulty: 1,
    explanation: 'Une API (Application Programming Interface) définit comment des logiciels communiquent : endpoints, formats (JSON, XML), authentification. Les APIs REST, GraphQL ou gRPC structurent les services web et les microservices ; elles sont au cœur de l\'économie des plateformes (Google Maps, Stripe, OpenAI) et de l\'intégration des systèmes.',
  },
  {
    id: 'tech-2',
    category: 'tech',
    question: 'Qu\'est-ce que le « machine learning » ?',
    options: ['Un système qui exécute uniquement des instructions fixes', 'Des algorithmes qui s\'améliorent avec les données', 'Un langage de requête', 'Un type de matériel informatique'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'Le ML permet aux modèles d\'apprendre des patterns à partir de données.',
  },
  {
    id: 'tech-3',
    category: 'tech',
    question: 'Quel protocole sécurise les connexions web (cadenas) ?',
    options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
    correctIndex: 2,
    difficulty: 1,
    explanation: 'HTTPS = HTTP + chiffrement (TLS/SSL) pour protéger les échanges.',
  },
  {
    id: 'tech-4',
    category: 'tech',
    question: 'Qu\'est-ce qu\'un « token » dans la blockchain ?',
    options: ['Une clé de sécurité physique', 'Une unité de valeur ou d\'accès sur un protocole', 'Un mot de passe à usage unique', 'Un certificat SSL'],
    correctIndex: 1,
    difficulty: 2,
    explanation: 'Un token peut représenter un actif, un droit de vote ou un accès (ex. NFT).',
  },
  {
    id: 'tech-5',
    category: 'tech',
    question: 'Quelle entreprise a popularisé le concept de « cloud computing » grand public ?',
    options: ['Microsoft uniquement', 'Amazon (AWS), puis Google, Microsoft', 'Apple', 'IBM uniquement'],
    correctIndex: 1,
    difficulty: 2,
    explanation: 'AWS a lancé les services cloud à grande échelle ; Google et Microsoft ont suivi.',
  },
  // ——— CULTURE ———
  {
    id: 'cul-1',
    category: 'culture',
    question: '« Connais-toi toi-même » est une maxime associée à quel courant ?',
    options: ['Stoïcisme', 'Philosophie grecque (Delphes, Socrate)', 'Épicurisme', 'Existentialisme'],
    correctIndex: 1,
    difficulty: 1,
    explanation: '« Gnothi seauton » (Connais-toi toi-même) figurait à l\'entrée du temple d\'Apollon à Delphes. Socrate en a fait le cœur de sa méthode : examiner ses propres croyances, reconnaître son ignorance, et viser une vie examinée. Repris par Platon, les stoïciens et toute la tradition de la philosophie pratique ; distinct de la simple introspection psychologique — il s\'agit d\'une exigence éthique et épistémique.',
  },
  {
    id: 'cul-2',
    category: 'culture',
    question: 'Quel mouvement artistique a introduit la décomposition de la lumière en taches de couleur ?',
    options: ['Renaissance', 'Impressionnisme', 'Cubisme', 'Surréalisme'],
    correctIndex: 1,
    difficulty: 2,
    explanation: 'Les impressionnistes (Monet, Renoir) ont travaillé la lumière et la couleur en touches.',
  },
  {
    id: 'cul-3',
    category: 'culture',
    question: 'Qu\'est-ce que le « marché de l\'art » désigne au sens économique ?',
    options: ['Les musées publics', 'L\'ensemble des ventes et achats d\'œuvres (enchères, galeries)', 'Les subventions à la culture', 'Les droits d\'auteur uniquement'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'Ventes aux enchères, galeries, foires et transactions privées d\'œuvres.',
  },
  {
    id: 'cul-4',
    category: 'culture',
    question: 'Qui a écrit : « Je pense, donc je suis » ?',
    options: ['Platon', 'Aristote', 'Descartes', 'Kant'],
    correctIndex: 2,
    difficulty: 1,
    explanation: 'Descartes, dans le Discours de la méthode (1637) : « Je pense, donc je suis » (cogito ergo sum). Premier principe indubitable après le doute radical (rêve, malin génie) — l\'acte de douter prouve l\'existence d\'un sujet pensant. Fondation du rationalisme moderne et de la priorité de la conscience ; critiqué par les existentialistes (Sartre) et la philosophie de l\'esprit (externalisme).',
  },
  // ——— GÉNÉRAL ———
  {
    id: 'gen-1',
    category: 'general',
    question: 'Quel principe économique décrit la rareté des ressources face à des besoins illimités ?',
    options: ['La loi de l\'offre et de la demande', 'La rareté (problème économique central)', 'Le PIB', 'L\'inflation'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'La rareté : les ressources sont limitées face à des besoins illimités. Conséquence : tout choix a un coût d\'opportunité (ce à quoi on renonce). Fondement de l\'économie (allocation, prix, échange) ; les politiques économiques et sociales sont des arbitrages sous contrainte.',
  },
  {
    id: 'gen-2',
    category: 'general',
    question: 'Que mesure un « indice de confiance » (consommateurs ou entreprises) ?',
    options: ['Le PIB', 'Le sentiment et les anticipations', 'Le taux de chômage', 'La dette publique'],
    correctIndex: 1,
    difficulty: 2,
    explanation: 'Ces enquêtes reflètent les attentes (dépenses, embauches, investissements).',
  },
  {
    id: 'gen-3',
    category: 'general',
    question: 'Qu\'est-ce qu\'une « récession » au sens technique ?',
    options: ['Une hausse des prix', 'Deux trimestres consécutifs de baisse du PIB', 'Une bourse en baisse', 'Une hausse du chômage'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'Définition courante : deux trimestres consécutifs de croissance négative du PIB.',
  },
  {
    id: 'gen-4',
    category: 'general',
    question: 'Quel philosophe a développé l\'idée que « l\'existence précède l\'essence » ?',
    options: ['Platon', 'Hegel', 'Sartre', 'Nietzsche'],
    correctIndex: 2,
    difficulty: 2,
    explanation: 'Sartre (existentialisme) : nous nous définissons par nos actes, pas par une nature fixe.',
  },
  {
    id: 'gen-5',
    category: 'general',
    question: 'Dans une démocratie, à quoi sert la « séparation des pouvoirs » ?',
    options: ['À centraliser l\'État', 'À éviter la concentration du pouvoir (exécutif, législatif, judiciaire)', 'À augmenter les impôts', 'À supprimer les partis'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'Montesquieu : équilibre entre pouvoir exécutif, législatif et judiciaire.',
  },
  // ——— Suite finance / science / tech pour variété ———
  {
    id: 'fin-9',
    category: 'finance',
    question: 'Qu\'est-ce que l\'« effet de levier » (levier financier) ?',
    options: ['Un ratio de liquidité', 'Financer des investissements avec de la dette pour amplifier gains et pertes', 'Un type d\'assurance', 'Un indice boursier'],
    correctIndex: 1,
    difficulty: 3,
    explanation: 'L\'effet de levier : en finançant un actif par de la dette, les variations de valeur (en %) se répercutent sur un capital plus faible, donc le rendement (ou la perte) en pourcentage des fonds propres est amplifié. Ex. : 80 % de dette, 20 % de fonds propres — une baisse de 10 % de l\'actif peut effacer 50 % des fonds propres. Utilisé en finance d\'entreprise (LBO), marchés (marge), immobilier. Régulation (Bâle, ratios de levier) limite l\'exposition pour contenir le risque systémique.',
  },
  {
    id: 'sci-7',
    category: 'science',
    question: 'Quelle constante physique relie l\'énergie d\'un photon à sa fréquence ?',
    options: ['La vitesse de la lumière', 'La constante de Planck', 'La constante de Boltzmann', 'La charge élémentaire'],
    correctIndex: 1,
    difficulty: 2,
    explanation: 'E = h × ν : h est la constante de Planck.',
  },
  {
    id: 'tech-6',
    category: 'tech',
    question: 'Qu\'est-ce qu\'un « bug » en informatique ?',
    options: ['Un virus', 'Une erreur ou un défaut dans un programme', 'Un pare-feu', 'Une mise à jour'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'Défaut de logique ou d\'implémentation qui provoque un comportement incorrect.',
  },
  {
    id: 'geo-6',
    category: 'geopolitics',
    question: 'Quel pays est le premier exportateur mondial de pétrole (brut) ?',
    options: ['Russie', 'États-Unis', 'Arabie saoudite', 'Chine'],
    correctIndex: 2,
    difficulty: 2,
    explanation: 'L\'Arabie saoudite reste parmi les plus gros exportateurs de pétrole brut.',
  },
  {
    id: 'cul-5',
    category: 'culture',
    question: 'Quel philosophe est associé à la « caverne » et aux Idées ?',
    options: ['Aristote', 'Platon', 'Descartes', 'Kant'],
    correctIndex: 1,
    difficulty: 1,
    explanation: 'Platon décrit dans La République l\'allégorie de la caverne et le monde des Idées.',
  },
  // ——— Pool complémentaire (variété, difficulté équilibrée) ———
  { id: 'fin-10', category: 'finance', question: 'Qu\'est-ce qu\'un « ETF » ?', options: ['Un fonds négocié en Bourse qui réplique un indice', 'Une monnaie virtuelle', 'Un prêt bancaire', 'Un impôt'], correctIndex: 0, difficulty: 2, explanation: 'Exchange-Traded Fund : fonds négociable en Bourse, souvent indiciel.' },
  { id: 'fin-11', category: 'finance', question: 'Que signifie « taux directeur » d\'une banque centrale ?', options: ['Le taux auquel les banques se refinancent', 'Le taux de change', 'Le taux d\'imposition', 'Le taux de croissance'], correctIndex: 0, difficulty: 2, explanation: 'Il influence les taux des crédits et de l\'épargne dans l\'économie.' },
  { id: 'sci-8', category: 'science', question: 'Quelle est l\'unité de base de l\'énergie dans le Système international ?', options: ['Le watt', 'Le joule', 'Le newton', 'Le pascal'], correctIndex: 1, difficulty: 1, explanation: 'Le joule (J) ; le watt est une puissance (J/s).' },
  { id: 'sci-9', category: 'science', question: 'Qu\'est-ce que la « sélection naturelle » ?', options: ['Un choix humain des espèces', 'La survie des mieux adaptés à leur environnement', 'Une loi physique', 'Un régime alimentaire'], correctIndex: 1, difficulty: 1, explanation: 'Darwin : les variants favorables se reproduisent davantage.' },
  { id: 'geo-7', category: 'geopolitics', question: 'Quel organisme prête aux États en difficulté financière ?', options: ['L\'OMC', 'Le FMI', 'L\'OMS', 'L\'UNESCO'], correctIndex: 1, difficulty: 1, explanation: 'Le FMI (Fonds monétaire international) accorde des prêts conditionnés.' },
  { id: 'geo-8', category: 'geopolitics', question: 'Qu\'est-ce que l\'« OTAN » ?', options: ['Une organisation économique', 'Une alliance militaire défensive (Atlantique Nord)', 'Une cour de justice', 'Une agence spatiale'], correctIndex: 1, difficulty: 1, explanation: 'Organisation du traité de l\'Atlantique Nord, créée en 1949.' },
  { id: 'tech-7', category: 'tech', question: 'Qu\'est-ce qu\'un « cookie » sur le web ?', options: ['Un virus', 'Un petit fichier stocké par le navigateur (données de session)', 'Un mot de passe', 'Un pare-feu'], correctIndex: 1, difficulty: 1, explanation: 'Données envoyées par un site et renvoyées à chaque visite.' },
  { id: 'tech-8', category: 'tech', question: 'Que signifie « open source » ?', options: ['Gratuit', 'Code source accessible et modifiable selon une licence', 'Sans connexion', 'Réservé aux entreprises'], correctIndex: 1, difficulty: 2, explanation: 'Le code peut être lu, modifié et redistribué sous les conditions de la licence.' },
  { id: 'cul-6', category: 'culture', question: 'Quel mouvement philosophique prône « le plus grand bonheur pour le plus grand nombre » ?', options: ['Stoïcisme', 'Utilitarisme', 'Nihilisme', 'Existentialisme'], correctIndex: 1, difficulty: 2, explanation: 'Bentham, Mill : une action est bonne si elle maximise le bien-être global.' },
  { id: 'gen-6', category: 'general', question: 'Qu\'est-ce que l\'« inflation » ?', options: ['Une baisse des prix', 'Une hausse générale et durable des prix', 'Une bourse en hausse', 'Un taux de chômage élevé'], correctIndex: 1, difficulty: 1, explanation: 'Le pouvoir d\'achat de la monnaie baisse quand les prix montent.' },
  { id: 'gen-7', category: 'general', question: 'Quel philosophe a dit « Je ne sais qu\'une chose, c\'est que je ne sais rien » ?', options: ['Aristote', 'Platon', 'Socrate', 'Descartes'], correctIndex: 2, difficulty: 1, explanation: 'Socrate (via Platon) : posture du questionnement et de l\'humilité.' },
  { id: 'fin-12', category: 'finance', question: 'Qu\'est-ce que la « capitalisation boursière » d\'une entreprise ?', options: ['Son chiffre d\'affaires', 'Cours de l\'action × nombre d\'actions en circulation', 'Son bénéfice net', 'Sa dette'], correctIndex: 1, difficulty: 2, explanation: 'Valeur de marché totale des actions de l\'entreprise.' },
  { id: 'sci-10', category: 'science', question: 'Quelle planète est la plus proche du Soleil ?', options: ['Vénus', 'Mercure', 'Mars', 'Terre'], correctIndex: 1, difficulty: 1, explanation: 'Mercure est la première planète du Système solaire.' },
  { id: 'geo-9', category: 'geopolitics', question: 'Quel pays n\'est pas dans l\'Union européenne ?', options: ['Suède', 'Norvège', 'Pologne', 'Espagne'], correctIndex: 1, difficulty: 1, explanation: 'La Norvège a refusé l\'adhésion par référendum ; elle est dans l\'EEE.' },
  { id: 'tech-9', category: 'tech', question: 'Qu\'est-ce que la « 5G » ?', options: ['Une unité de stockage', 'La cinquième génération de réseaux mobiles', 'Un langage de programmation', 'Un antivirus'], correctIndex: 1, difficulty: 1, explanation: 'Nouvelle norme de téléphonie mobile (débit, latence).' },
  { id: 'cul-7', category: 'culture', question: 'Qui a peint La Joconde ?', options: ['Michel-Ange', 'Raphaël', 'Léonard de Vinci', 'Rembrandt'], correctIndex: 2, difficulty: 1, explanation: 'Léonard de Vinci, début du XVIe siècle (musée du Louvre).' },
  { id: 'gen-8', category: 'general', question: 'Qu\'est-ce que le « PIB par habitant » ?', options: ['Le salaire moyen', 'Le PIB total divisé par la population', 'Le taux de chômage', 'La dette par personne'], correctIndex: 1, difficulty: 1, explanation: 'Indicateur de niveau de vie moyen (richesse produite / nombre d\'habitants).' },
  { id: 'fin-13', category: 'finance', question: 'Qu\'est-ce qu\'une « obligation » ?', options: ['Une action', 'Un titre de dette (emprunt émis par un État ou une entreprise)', 'Une devise', 'Un fonds'], correctIndex: 1, difficulty: 2, explanation: 'L\'émetteur s\'engage à rembourser le capital et à verser des intérêts.' },
  { id: 'sci-11', category: 'science', question: 'Quel gaz les plantes absorbent-elles pour la photosynthèse ?', options: ['L\'oxygène', 'Le dioxyde de carbone (CO₂)', 'L\'azote', 'L\'hydrogène'], correctIndex: 1, difficulty: 1, explanation: 'CO₂ + eau + lumière → glucose + O₂.' },
  { id: 'tech-10', category: 'tech', question: 'Qu\'est-ce qu\'un « phishing » ?', options: ['Un virus', 'Une technique pour voler des identifiants (e-mail / site falsifié)', 'Un pare-feu', 'Un logiciel de sauvegarde'], correctIndex: 1, difficulty: 2, explanation: 'Usurpation d\'identité pour inciter à donner mot de passe ou données.' },

  // ——— ★★★ DIFFICULTÉ MAX — Public CSP+, exigence intellectuelle, explications détaillées ———

  {
    id: 'fin-h1',
    category: 'finance',
    question: 'Qu\'est-ce qu\'un « credit default swap » (CDS) et quel risque principal pose-t-il pour le système ?',
    options: [
      'Un dérivé de crédit : une partie paie une prime pour se protéger contre le défaut d\'un émetteur ; le risque est la contagion et l\'opacité des expositions',
      'Un swap de taux d\'intérêt entre banques',
      'Une assurance-vie liée aux marchés',
      'Un produit structuré garanti par l\'État',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Le CDS est un contrat de garantie contre le défaut d\'un émetteur (dette, obligation). L\'acheteur de protection paie une prime ; le vendeur s\'engage à compenser en cas de défaut. Les CDS ont amplifié la crise de 2008 : expositions opaques (notamment sur Lehman), effet de levier, et interconnexion des contreparties. La régulation (Bâle III, réforme Dodd-Frank) a renforcé la centralisation des compensations (CCP) et la transparence.',
  },
  {
    id: 'fin-h2',
    category: 'finance',
    question: 'En macroéconomie, que signifie une « courbe des taux inversée » (yield curve inversion) et pourquoi est-elle suivie de près ?',
    options: [
      'Les taux courts dépassent les taux longs ; historiquement souvent suivie d\'une récession (anticipation du ralentissement par le marché)',
      'Les taux longs chutent sous l\'influence de la BCE',
      'La courbe reflète une hausse des impôts',
      'Elle indique une forte inflation à court terme',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Une courbe inversée signifie que les taux à court terme (ex. 2 ans) deviennent supérieurs aux taux à long terme (ex. 10 ans). Les investisseurs acceptent un rendement plus bas sur le long terme car ils anticipent un ralentissement (et donc des baisses de taux futures). Cette configuration a souvent précédé des récessions aux États-Unis (avec un décalage de plusieurs trimestres). Ce n\'est pas une causalité mécanique mais un signal d\'anticipations et de prime de risque.',
  },
  {
    id: 'fin-h3',
    category: 'finance',
    question: 'Qu\'est-ce que le « ratio de Tier 1 » (Bâle III) et pourquoi les régulateurs le surveillent-ils ?',
    options: [
      'Fonds propres « durs » (capital + réserves) / actifs pondérés du risque ; il mesure la capacité d\'absorption des pertes sans faillite',
      'Le ratio dette / PIB des États',
      'Le levier des hedge funds',
      'Le taux de couverture des dépôts',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Le Tier 1 (CET1 pour le noyau dur) correspond aux fonds propres les plus solides : capital social, réserves, bénéfices non distribués, moins certaines déductions. Il est rapporté aux actifs pondérés du risque (RWA). Bâle III impose un minimum (ex. 6 % CET1) pour que les banques absorbent les pertes sans recourir aux fonds publics. Un ratio trop bas expose à une crise de confiance et à des ventes forcées d\'actifs.',
  },
  {
    id: 'fin-h4',
    category: 'finance',
    question: 'En finance de marché, qu\'est-ce qu\'un « carry trade » typique et quel est son risque principal ?',
    options: [
      'Emprunter dans une devise à taux bas, placer dans une devise à taux élevé ; le risque est un retournement du taux de change qui peut annuler le gain',
      'Acheter des actions à fort dividende',
      'Arbitrage entre deux places boursières',
      'Vente à découvert d\'obligations d\'État',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Le carry trade consiste à financer un actif en empruntant dans une devise à faible taux (ex. yen, franc suisse) et en investissant dans une devise ou un actif offrant un rendement plus élevé. Le gain vient de l\'écart de taux ; la perte peut venir d\'une appréciation de la devise d\'emprunt (ex. dévaluation du yen en 2022–2023). Très pratiqué avant 2008, il amplifie les mouvements de change quand les positions sont dénouées (unwind) en crise.',
  },
  {
    id: 'fin-h5',
    category: 'finance',
    question: 'Que mesure le « taux réel » (real rate) et pourquoi est-il central pour les banques centrales ?',
    options: [
      'Taux nominal moins l\'inflation anticipée ; il reflète le coût du crédit « en pouvoir d\'achat » et pilote les décisions d\'épargne et d\'investissement',
      'Le taux de la Fed moins le taux de la BCE',
      'Le taux des obligations indexées à l\'inflation uniquement',
      'Le taux de croissance du PIB réel',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Taux réel ≈ taux nominal − inflation (anticipée). Ex. : si le taux nominal est 4 % et l\'inflation anticipée 2 %, le taux réel est environ 2 %. Il détermine l\'incitation à épargner ou à investir « en termes réels ». Les banques centrales visent un taux réel positif en phase de resserrement pour freiner la demande ; un taux réel trop bas longtemps peut surchauffer l\'économie (bulles, inflation).',
  },
  {
    id: 'sci-h1',
    category: 'science',
    question: 'Qu\'est-ce que le « problème de la mesure » en mécanique quantique et pourquoi pose-t-il un défi philosophique ?',
    options: [
      'La transition entre état superposé et résultat unique lors d\'une mesure ; on ne sait pas décrire objectivement « quand » et « comment » la réduction du paquet d\'ondes se produit',
      'La mesure de la vitesse des particules',
      'L\'incertitude sur la position des électrons',
      'La détection des trous noirs',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'En quantique, un système peut être dans une superposition d\'états ; une mesure donne un résultat unique (réduction du paquet d\'ondes). La question ouverte : est-ce l\'interaction avec l\'appareil, un effet de la conscience, ou une dynamique plus profonde (décohérence, théories à variables cachées) ? Les interprétations (Copenhague, mondes multiples, pilot wave, etc.) divergent sur le statut ontologique de cette transition. Aucun consensus strict en physique fondamentale.',
  },
  {
    id: 'sci-h2',
    category: 'science',
    question: 'Quelle est la différence fondamentale entre « reproductibilité » et « réplicabilité » en science empirique ?',
    options: [
      'Repro : même protocole, même équipe, même résultat. Réplic : même question, protocole indépendant (autre labo/méthode) ; la réplicabilité est plus exigeante et révèle la robustesse',
      'Les deux termes sont synonymes',
      'Repro concerne la théorie, réplic les données',
      'Repro = expérience, réplic = méta-analyse',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Reproductibilité : refaire la même expérience (même protocole, mêmes conditions) et obtenir le même résultat — contrôles internes. Réplicabilité : obtenir un résultat cohérent avec une approche ou un échantillon indépendant — validation externe. La « crise de la réplicabilité » (psychologie, médecine, sciences sociales) montre que beaucoup d\'effets publiés ne se répliquent pas ; cela a poussé à la pré-enregistrement, aux protocoles ouverts et aux méta-analyses.',
  },
  {
    id: 'sci-h3',
    category: 'science',
    question: 'En théorie de l\'évolution, que signifie la « sélection de parentèle » (kin selection) et quel concept mathématique la formalise ?',
    options: [
      'Les gènes favorisant des comportements altruistes envers des apparentés peuvent augmenter en fréquence ; formalisée par l\'« inclusive fitness » (Hamilton)',
      'La sélection des parents les plus forts',
      'L\'évolution des familles nombreuses',
      'La sélection sexuelle entre frères et sœurs',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'W.D. Hamilton : un gène peut se propager s\'il favorise la survie d\'individus apparentés qui le partagent (r > 0). La règle « c × r > b » : le coût pour l\'altruiste (c) est compensé par le bénéfice (b) pondéré par le coefficient de parentèle (r). Explique l\'altruisme chez les insectes sociaux (ouvrières stériles), les alarmes chez les vertébrés, etc. Débat avec la sélection de groupe (group selection) sur le niveau auquel la sélection agit.',
  },
  {
    id: 'sci-h4',
    category: 'science',
    question: 'Qu\'est-ce que l\'« énergie noire » en cosmologie et quel rôle joue-t-elle dans l\'évolution de l\'Univers ?',
    options: [
      'Une composante qui agit comme une pression négative (ou constante cosmologique) et accélère l\'expansion de l\'Univers ; dominante aujourd\'hui en densité d\'énergie',
      'La matière invisible des galaxies',
      'L\'énergie des trous noirs supermassifs',
      'La radiation résiduelle du Big Bang',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'L\'énergie noire représente environ 68 % du contenu énergétique de l\'Univers (Planck, 2018). Elle se comporte comme une constante cosmologique Λ : densité d\'énergie quasi constante, pression négative, d\'où une répulsion gravitationnelle. C\'est elle qui accélère l\'expansion depuis quelques milliards d\'années. Nature physique encore inconnue : constante fondamentale, champ dynamique (quintessence), ou modification de la gravité à grande échelle.',
  },
  {
    id: 'sci-h5',
    category: 'science',
    question: 'En épistémologie, que signifie le « critère de falsifiabilité » (Popper) et quelle limite importante lui est souvent opposée ?',
    options: [
      'Une théorie est scientifique si elle peut être réfutée par l\'expérience ; limite : en pratique, les théories sont protégées par des hypothèses auxiliaires (Duhem-Quine)',
      'Une théorie doit être vérifiable par l\'observation',
      'Seules les prédictions exactes comptent',
      'La falsifiabilité définit la vérité',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Popper : la démarcation entre science et non-science repose sur la falsifiabilité — on ne peut pas prouver une théorie, mais on peut la réfuter. Limite (Duhem-Quine) : une prédiction dépend de la théorie ET d\'hypothèses auxiliaires (instruments, conditions) ; en cas d\'échec, on ne sait pas laquelle abandonner. La pratique scientifique combine donc falsificationnisme, corroboration et paradigmes (Kuhn), sans critère unique et simple.',
  },
  {
    id: 'geo-h1',
    category: 'geopolitics',
    question: 'Quelle est la différence institutionnelle majeure entre le « Conseil européen » et le « Conseil de l\'Union européenne » (Conseil des ministres) ?',
    options: [
      'Le Conseil européen réunit les chefs d\'État/gouvernement et définit les orientations politiques ; le Conseil de l\'UE réunit les ministres par domaine et adopte des actes législatifs avec le Parlement',
      'Le premier est consultatif, le second exécutif',
      'Le premier siège à Bruxelles, le second à Strasbourg',
      'Ils ont les mêmes membres mais des rôles différents',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Conseil européen : sommets des 27 chefs d\'État ou de gouvernement (plus le président de la Commission) ; il donne les impulsions politiques (stratégie, crises, nominations). Conseil de l\'UE : formation des ministres (affaires étrangères, économie, etc.) ; il co-légifère avec le Parlement européen et adopte le budget. Ne pas confondre avec le Conseil de l\'Europe (Strasbourg), organisation distincte (CEDH, 47 États).',
  },
  {
    id: 'geo-h2',
    category: 'geopolitics',
    question: 'Qu\'est-ce que la « doctrine Malthus » en géopolitique des ressources et quelle critique majeure lui est faite ?',
    options: [
      'L\'idée que la population croît plus vite que les ressources, d\'où famines et conflits ; critique : le progrès technique et les institutions ont permis d\'augmenter la production et d\'éviter la prédiction (innovation, commerce, droits de propriété)',
      'Une théorie sur les migrations uniquement',
      'La doctrine selon laquelle les ressources sont infinies',
      'Une politique de contrôle des naissances obligatoire',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Malthus (Essai sur le principe de population, 1798) : la population croît géométriquement, les subsistances arithmétiquement — d\'où des « freins » (famine, maladie, guerre). Les malthusiens appliquent cette logique aux ressources (pétrole, eau, terres). Les critiques (économistes, « optimistes ») soulignent : gains de productivité, substitution (énergies, recyclage), innovation induite par la rareté (prix), et le fait que beaucoup de pénuries sont politiques (gouvernance, accès) plutôt que purement physiques.',
  },
  {
    id: 'geo-h3',
    category: 'geopolitics',
    question: 'Quel rôle joue le « droit de veto » au Conseil de sécurité de l\'ONU et pourquoi son usage est-il controversé ?',
    options: [
      'Chaque membre permanent (P5) peut bloquer une résolution ; controversé car il peut paralyser l\'action face à des crimes de masse ou des agressions quand un P5 est partie ou protège un allié',
      'Il permet à tout État membre de bloquer une décision',
      'Il ne s\'applique qu\'aux opérations militaires',
      'Il a été aboli en 1990',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Les 5 membres permanents (Chine, États-Unis, France, Royaume-Uni, Russie) disposent d\'un veto : une seule opposition suffit à faire échouer une résolution. Utilisé des centaines de fois (URSS/Russie et États-Unis en tête). Controverses : blocage sur la Syrie, l\'Ukraine, la Palestine ; propositions de réforme (limiter le veto en cas de crimes de masse, élargir le P5) restent bloquées car toute réforme requiert l\'accord des P5.',
  },
  {
    id: 'geo-h4',
    category: 'geopolitics',
    question: 'Que désigne la « clause de la nation la plus favorisée » (NPF) dans le droit commercial international ?',
    options: [
      'Tout avantage accordé par un pays à un partenaire doit être étendu à tous les membres de l\'OMC concernés ; principe de non-discrimination entre partenaires',
      'Chaque pays choisit son partenaire le plus favori',
      'Une clause réservée aux pays les moins avancés',
      'Un avantage fiscal bilatéral',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Article I du GATT/OMC : si un membre accorde à un autre un avantage (tarif, quota, etc.), il doit l\'accorder à tous les membres. Objectif : éviter le morcellement en blocs préférentiels discriminatoires et stabiliser les gains du commerce. Exceptions : unions douanières, zones de libre-échange, préférences pour les pays en développement. La NPF est le pilier de la réciprocité multilatérale.',
  },
  {
    id: 'tech-h1',
    category: 'tech',
    question: 'Qu\'est-ce que le « problème de l\'alignement » (alignment) en intelligence artificielle et pourquoi est-il central pour la sûreté ?',
    options: [
      'S\'assurer que les objectifs et comportements des systèmes IA restent conformes aux intentions et valeurs humaines ; risque que l\'optimisation littérale conduise à des effets indésirables ou dangereux',
      'Aligner les données d\'entraînement entre pays',
      'Synchroniser les serveurs des modèles',
      'Régler les hyperparamètres des réseaux de neurones',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'L\'alignement (AI alignment) vise à ce que les systèmes puissants (AGI, agents autonomes) poursuivent des buts qui correspondent aux préférences humaines et ne contournent pas les contraintes par des « récompenses de proxy » ou des objectifs mal spécifiés. Ex. : un agent récompensé pour des clics pourrait manipuler l\'utilisateur plutôt que fournir une information utile. Recherche active : RLHF, décomposition des objectifs, vérification formelle, gouvernance.',
  },
  {
    id: 'tech-h2',
    category: 'tech',
    question: 'En informatique théorique, que dit le théorème de « CAP » (Brewer) sur les systèmes distribués ?',
    options: [
      'Un système réparti ne peut garantir simultanément au maximum deux des trois : Cohérence (tous les nœuds voient les mêmes données), Disponibilité (réponse à chaque requête), Tolérance au partitionnement (fonctionnement malgré des coupures réseau)',
      'Les systèmes doivent être Cohérents, Available et Partition-tolerant',
      'Il concerne uniquement les bases NoSQL',
      'Il garantit la sécurité des transactions',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Théorème CAP (formalisation de la conjecture de Brewer) : en cas de partition réseau, on doit choisir entre maintenir la cohérence (refuser ou retarder des écritures) ou la disponibilité (répondre tout de suite, au risque d\'incohérence). En pratique, les systèmes font des compromis (ex. cohérence à terme, quorum). Important pour le choix d\'architectures (bases distribuées, consensus, réplication).',
  },
  {
    id: 'tech-h3',
    category: 'tech',
    question: 'Qu\'est-ce qu\'une « attaque par canal auxiliaire » (side-channel) et pourquoi est-elle difficile à éliminer complètement ?',
    options: [
      'Exploiter des fuites d\'information physiques (temps, consommation, rayonnement) plutôt que des failles logiques ; difficile car tout dispositif physique émet des signaux corrélés aux opérations',
      'Une attaque par un second utilisateur sur le même réseau',
      'Une faille dans un canal de communication chiffré',
      'L\'écoute des ondes radio des routeurs',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Les attaques par canal auxiliaire utilisent des mesures indirectes : temps d\'exécution (timing), consommation électrique (DPA), émissions électromagnétiques, bruit du ventilateur, etc. Elles peuvent révéler des clés ou des données sans casser l\'algorithme. Contre-mesures : masquage, randomisation, matériel sécurisé ; mais la suppression totale est coûteuse et souvent incomplète car tout calcul laisse des traces physiques. Standard en cryptographie matérielle (cartes à puce, TPM).',
  },
  {
    id: 'tech-h4',
    category: 'tech',
    question: 'Que signifie « régularisation L1 » (Lasso) vs « L2 » (Ridge) en machine learning et quelle propriété importante les distingue ?',
    options: [
      'L1 pénalise la valeur absolue des poids, L2 leur carré ; L1 tend à produire des poids exactement nuls (sélection de variables), L2 les réduit sans les annuler',
      'L1 pour les réseaux profonds, L2 pour les modèles linéaires',
      'L1 évite le surajustement, L2 l\'underfitting',
      'Les deux sont équivalentes en pratique',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Régularisation : on ajoute une pénalité à la fonction de perte pour limiter la complexité. Ridge (L2) : λ Σ w² — tous les poids restent non nuls mais diminuent. Lasso (L1) : λ Σ |w| — certains poids deviennent exactement 0, donc sélection automatique de variables. En régression, Lasso est utile pour l\'interprétabilité et la parcimonie ; Elastic Net combine L1 et L2.',
  },
  {
    id: 'cul-h1',
    category: 'culture',
    question: 'Quelle distinction centrale fait Rawls entre « biens premiers » (primary goods) et « capabilités » (Sen) dans la philosophie politique ?',
    options: [
      'Rawls : biens premiers = ressources de base (droits, revenus, opportunités) distribuées équitablement. Sen : ce qui compte est la liberté réelle de réaliser des « fonctionnements » (être en bonne santé, participer) — les capabilités dépendent des conversions personnelles et contextuelles',
      'Les deux concepts sont identiques',
      'Rawls parle de capabilités, Sen de biens premiers',
      'Biens premiers = biens matériels, capabilités = talents',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Rawls (Théorie de la justice) : justice comme équité ; distribution des biens premiers (libertés, revenus, bases du respect de soi). Sen (égalité de quoi ?) : l\'égalité des ressources ne suffit pas — un handicapé a besoin de plus pour atteindre les mêmes « fonctionnements ». Les capabilités sont les libertés réelles de choisir des états et des actions valorisables. Influence sur les indicateurs (IDH, indice de pauvreté multidimensionnelle) et les politiques sociales.',
  },
  {
    id: 'cul-h2',
    category: 'culture',
    question: 'Qu\'est-ce que le « paradoxe de la tolérance » (Popper) et quelle limite pratique lui est souvent opposée ?',
    options: [
      'Une société tolérante doit pouvoir refuser la tolérance à ceux qui menacent de détruire la tolérance ; limite : qui définit et applique cette exception sans glisser vers l\'autoritarisme ?',
      'Il faut tolérer toutes les opinions sans exception',
      'La tolérance est un paradoxe logique',
      'Popper rejette toute limite à la liberté d\'expression',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Popper (La société ouverte et ses ennemis) : si on tolère sans limite, les intolérants peuvent utiliser la liberté pour abolir la liberté ; donc la tolérance ne peut pas s\'étendre à l\'intolérance. Conséquence : interdiction ou limitation des mouvements qui visent à supprimer les droits d\'autrui. Limite : le risque d\'abus (qualifier d\'« intolérant » tout opposant) ; débat permanent sur les limites de la liberté d\'expression (incitation à la haine, désinformation, discours illibéraux).',
  },
  {
    id: 'cul-h3',
    category: 'culture',
    question: 'En histoire des idées, quelle est la thèse centrale de « La structure des révolutions scientifiques » (Kuhn) sur le progrès scientifique ?',
    options: [
      'La science avance par « paradigmes » dominants et « révolutions » où un paradigme en remplace un autre ; le progrès n\'est pas linéaire et cumulatif, les paradigmes sont en partie « incommensurables »',
      'La science progresse par accumulation de faits',
      'Les révolutions sont toujours politiques',
      'Kuhn nie tout progrès scientifique',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Kuhn (1962) : en « science normale », les chercheurs travaillent dans un paradigme (théories, méthodes, problèmes légitimes). Les anomalies s\'accumulent jusqu\'à une « crise » puis une « révolution » : un nouveau paradigme remplace l\'ancien. Les partisans de paradigmes différents ne partagent pas toujours les mêmes critères de preuve (incommensurabilité). Critique du positivisme et influence majeure sur la sociologie et la philosophie des sciences.',
  },
  {
    id: 'cul-h4',
    category: 'culture',
    question: 'Quelle distinction fait Isaiah Berlin entre « liberté négative » et « liberté positive » ?',
    options: [
      'Négative : absence d\'ingérence (être laissé libre de). Positive : capacité à agir selon sa volonté ou à réaliser ses fins (être maître de) ; Berlin alerte sur le risque d\'autoritarisme quand l\'État définit « la vraie » liberté positive',
      'Négative = liberté économique, positive = liberté politique',
      'L\'une est individuelle, l\'autre collective',
      'Berlin rejette la liberté positive',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Berlin (Deux conceptions de la liberté, 1958) : liberté négative = « À quelles interférences suis-je soumis ? » (domaine de non-ingérence). Liberté positive = « Qui me gouverne ? Suis-je autonome ? » (autodétermination). Berlin souligne que l\'idéal de liberté positive a souvent servi à justifier des régimes qui imposaient une « vraie » volonté au peuple (totalitarismes). Débat avec les républicains (Pettit : liberté comme non-domination) et les défenseurs des capabilités (Sen).',
  },
  {
    id: 'gen-h1',
    category: 'general',
    question: 'Qu\'est-ce que le « biais de disponibilité » (Kahneman-Tversky) et comment peut-il affecter les décisions économiques ou politiques ?',
    options: [
      'On surestime la probabilité d\'événements facilement rappelés ou imaginés (médiatisés, récents, frappants) ; peut conduire à sur-réagir à des risques rares ou sous-estimer des risques diffus',
      'On préfère les informations disponibles immédiatement',
      'On sous-estime les risques inconnus',
      'C\'est un biais lié à la mémoire à court terme uniquement',
    ],
    correctIndex: 0,
    difficulty: 3,
    explanation: 'Biais de disponibilité : la fréquence ou la probabilité perçue dépend de la facilité avec laquelle des exemples viennent à l\'esprit. Ex. : surestimation des risques d\'attentat ou d\'accident d\'avion après des faits divers ; sous-estimation des risques chroniques (sédentarité, pollution). En économie et politique : bulles (récits récents de gains), paniques, allocation des dépenses publiques. Connaissance du biais aide à recourir à des données statistiques plutôt qu\'à l\'intuition.',
  },

  // ——— ACTUALITÉ (récent, s'informer — Pro = plus de questions d'actualité) ———
  {
    id: 'act-1',
    category: 'actualité',
    question: 'En 2024, quel pays a rejoint l\'OTAN après des années de neutralité ?',
    options: ['La Finlande', 'La Suède', 'L\'Autriche', 'L\'Irlande'],
    correctIndex: 1,
    difficulty: 1,
    isCurrentEvents: true,
    explanation: 'La Suède a rejoint l\'OTAN en mars 2024, mettant fin à plus de 200 ans de neutralité, dans un contexte de guerre en Ukraine.',
  },
  {
    id: 'act-2',
    category: 'actualité',
    question: 'Quelle banque centrale a maintenu des taux élevés en 2024 pour lutter contre l\'inflation ?',
    options: ['BCE et Fed', 'Seulement la BoJ', 'Uniquement la BCE', 'Aucune'],
    correctIndex: 0,
    difficulty: 1,
    isCurrentEvents: true,
    explanation: 'La Fed et la BCE ont maintenu des taux directeurs élevés en 2024 avant de commencer à les baisser progressivement.',
  },
  {
    id: 'act-3',
    category: 'actualité',
    question: 'Quel sommet climat a fixé des objectifs de réduction des énergies fossiles pour 2030 ?',
    options: ['COP21 Paris', 'COP28 Dubaï', 'COP26 Glasgow', 'COP27 Charm el-Cheikh'],
    correctIndex: 1,
    difficulty: 2,
    isCurrentEvents: true,
    explanation: 'La COP28 (Dubaï, 2023) a acté pour la première fois une « transition hors des énergies fossiles » dans le texte final.',
  },
  {
    id: 'act-4',
    category: 'actualité',
    question: 'Quelle régulation européenne encadre l\'IA générative (ChatGPT, etc.) depuis 2024 ?',
    options: ['RGPD uniquement', 'AI Act', 'Digital Markets Act', 'MiCA'],
    correctIndex: 1,
    difficulty: 2,
    isCurrentEvents: true,
    explanation: 'L\'AI Act (règlement européen sur l\'IA) impose des obligations de transparence et de risque selon le niveau de dangerosité des systèmes d\'IA.',
  },
  {
    id: 'act-5',
    category: 'actualité',
    question: 'En 2024, quel indice boursier américain a atteint des records historiques ?',
    options: ['Uniquement le Dow Jones', 'S&P 500 et NASDAQ', 'Russell 2000 seul', 'Aucun'],
    correctIndex: 1,
    difficulty: 1,
    isCurrentEvents: true,
    explanation: 'Le S&P 500 et le NASDAQ ont enchaîné des records en 2024, portés par les valeurs tech et l\'IA.',
  },
  {
    id: 'act-6',
    category: 'actualité',
    question: 'Quelle crypto-monnaie a obtenu l\'approbation d\'ETF spot aux États-Unis en 2024 ?',
    options: ['Ethereum uniquement', 'Bitcoin puis Ethereum', 'Uniquement des ETF futures', 'Aucune'],
    correctIndex: 1,
    difficulty: 2,
    isCurrentEvents: true,
    explanation: 'Les ETF spot Bitcoin ont été approuvés en janvier 2024 ; les ETF spot Ethereum ont suivi en 2024.',
  },
  {
    id: 'act-7',
    category: 'actualité',
    question: 'Quel conflit a conduit à des sanctions occidentales majeures sur les hydrocarbures en 2022-2024 ?',
    options: ['Syrie', 'Gaza', 'Guerre en Ukraine', 'Yémen'],
    correctIndex: 2,
    difficulty: 1,
    isCurrentEvents: true,
    explanation: 'L\'invasion de l\'Ukraine par la Russie (2022) a déclenché des sanctions sur le pétrole et le gaz russes et une réorientation des approvisionnements.',
  },
  {
    id: 'act-8',
    category: 'actualité',
    question: 'Quelle entreprise tech a lancé des assistants vocaux et des modèles d\'IA « multimodaux » en 2024 ?',
    options: ['Meta seul', 'OpenAI, Google, Apple, Meta', 'Samsung uniquement', 'X (Twitter)'],
    correctIndex: 1,
    difficulty: 1,
    isCurrentEvents: true,
    explanation: 'OpenAI (GPT-4o), Google (Gemini), Apple (Apple Intelligence), Meta (Llama) ont tous renforcé leurs offres IA et assistants en 2024.',
  },
  {
    id: 'act-9',
    category: 'actualité',
    question: 'Quel indicateur de santé publique a reculé dans plusieurs pays après la pandémie de COVID-19 ?',
    options: ['Taux de vaccination infantile', 'Espérance de vie', 'Dépenses de santé', 'Nombre de lits d\'hôpital'],
    correctIndex: 1,
    difficulty: 2,
    isCurrentEvents: true,
    explanation: 'L\'espérance de vie a temporairement reculé dans plusieurs pays (dont les États-Unis) après la pandémie, avant de repartir.',
  },
  {
    id: 'act-10',
    category: 'actualité',
    question: 'Quelle réforme des retraites a été adoptée en France en 2023 ?',
    options: ['Aucune', 'Report de l\'âge légal à 64 ans', 'Réduction des pensions', 'Retraite à points uniquement'],
    correctIndex: 1,
    difficulty: 1,
    isCurrentEvents: true,
    explanation: 'La réforme de 2023 a reporté l\'âge légal de départ à la retraite à 64 ans et accéléré l\'allongement de la durée de cotisation.',
  },
  {
    id: 'act-11',
    category: 'actualité',
    question: 'Quel pays a connu une forte hausse de l\'extrême droite aux élections européennes de 2024 ?',
    options: ['Allemagne uniquement', 'France et Allemagne notamment', 'Italie uniquement', 'Aucun'],
    correctIndex: 1,
    difficulty: 2,
    isCurrentEvents: true,
    explanation: 'En France (RN) et en Allemagne (AfD), l\'extrême droite est arrivée en tête ou en forte progression aux européennes de juin 2024.',
  },
  {
    id: 'act-12',
    category: 'actualité',
    question: 'Quelle région du monde concentre la majorité des semi-conducteurs avancés (puces < 7 nm) ?',
    options: ['Europe', 'États-Unis', 'Taïwan et Corée du Sud', 'Chine'],
    correctIndex: 2,
    difficulty: 2,
    isCurrentEvents: true,
    explanation: 'TSMC (Taïwan) et Samsung (Corée du Sud) dominent la production des puces les plus avancées ; les États-Unis et l\'Europe visent à relocaliser une partie.',
  },
  {
    id: 'act-13',
    category: 'actualité',
    question: 'Quel accord commercial vise à réduire la dépendance à la Chine (« friend-shoring ») ?',
    options: ['RCEP', 'CPTPP uniquement', 'Partenariats type IPEF, accords UE', 'ALENA'],
    correctIndex: 2,
    difficulty: 3,
    isCurrentEvents: true,
    explanation: 'L\'IPEF (Indo-Pacific Economic Framework) et les accords bilatéraux ou régionaux (UE, États-Unis) visent à sécuriser les chaînes d\'approvisionnement et à diversifier les fournisseurs.',
  },
  {
    id: 'act-14',
    category: 'actualité',
    question: 'En 2024, quelle catastrophe naturelle a encore frappé l\'Europe (inondations, feux) ?',
    options: ['Seulement sécheresse', 'Inondations et canicules / feux', 'Uniquement tremblements de terre', 'Aucune majeure'],
    correctIndex: 1,
    difficulty: 1,
    isCurrentEvents: true,
    explanation: 'Inondations (Allemagne, Belgique, Italie…) et feux de forêt / canicules ont marqué plusieurs étés récents en Europe, en lien avec le changement climatique.',
  },
  {
    id: 'act-15',
    category: 'actualité',
    question: 'Quel géant tech a été poursuivi pour pratiques anticoncurrentielles (App Store, recherche) en 2024 ?',
    options: ['Meta uniquement', 'Apple et Google', 'Amazon uniquement', 'Microsoft uniquement'],
    correctIndex: 1,
    difficulty: 1,
    isCurrentEvents: true,
    explanation: 'Apple ( DMA, App Store ) et Google (recherche, Android) font l\'objet de procédures antitrust en Europe et aux États-Unis.',
  },
];

/** Mélange Fisher-Yates (in-place sur un tableau) */
function fisherYates<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/** Pour une question, mélange l'ordre des options et met à jour correctIndex. Retourne une copie. */
export function shuffleQuestionOptions(q: QuizQuestion): QuizQuestion {
  const indices = [0, 1, 2, 3];
  fisherYates(indices);
  const newOptions: [string, string, string, string] = [
    q.options[indices[0]!]!,
    q.options[indices[1]!]!,
    q.options[indices[2]!]!,
    q.options[indices[3]!]!,
  ];
  const newCorrectIndex = indices.indexOf(q.correctIndex) as 0 | 1 | 2 | 3;
  return {
    ...q,
    options: newOptions,
    correctIndex: newCorrectIndex,
  };
}

/**
 * Tire `count` questions aléatoires dans le pool, avec ordre des options mélangé par question.
 * Chaque session / utilisateur a donc un ordre de questions et un ordre de réponses (A/B/C/D) différent.
 */
export function shuffleQuestions(questions: QuizQuestion[], count: number): QuizQuestion[] {
  const copy = [...questions];
  fisherYates(copy);
  const selected = copy.slice(0, count);
  return selected.map(shuffleQuestionOptions);
}

/**
 * Tire `count` questions en équilibrant la difficulté (environ 2 facile, 2 moyen, 1 difficile pour 5 questions),
 * puis mélange l'ordre et les options pour varier l'expérience.
 */
export function drawBalancedQuestions(questions: QuizQuestion[], count: number): QuizQuestion[] {
  const byDiff = { 1: [] as QuizQuestion[], 2: [] as QuizQuestion[], 3: [] as QuizQuestion[] };
  for (const q of questions) {
    if (byDiff[q.difficulty]) byDiff[q.difficulty].push(q);
  }
  fisherYates(byDiff[1]);
  fisherYates(byDiff[2]);
  fisherYates(byDiff[3]);
  const target1 = Math.min(2, byDiff[1].length);
  const target2 = Math.min(2, byDiff[2].length);
  const target3 = Math.min(1, byDiff[3].length);
  const pool: QuizQuestion[] = [
    ...byDiff[1].slice(0, target1),
    ...byDiff[2].slice(0, target2),
    ...byDiff[3].slice(0, target3),
  ];
  let need = count - pool.length;
  if (need > 0) {
    const rest: QuizQuestion[] = [
      ...byDiff[1].slice(target1),
      ...byDiff[2].slice(target2),
      ...byDiff[3].slice(target3),
    ];
    fisherYates(rest);
    for (let i = 0; i < need && i < rest.length; i++) pool.push(rest[i]!);
  }
  fisherYates(pool);
  const selected = pool.slice(0, count);
  selected.sort((a, b) => a.difficulty - b.difficulty);
  return selected.map(shuffleQuestionOptions);
}

/** Modes de difficulté : plus l'utilisateur choisit Expert, plus les questions difficiles (★★★) sont nombreuses. */
export type QuizDifficultyMode = 'facile' | 'standard' | 'expert';

const DIFFICULTY_TARGETS: Record<QuizDifficultyMode, { d1: number; d2: number; d3: number }> = {
  facile: { d1: 3, d2: 2, d3: 0 },
  standard: { d1: 2, d2: 2, d3: 1 },
  expert: { d1: 1, d2: 2, d3: 2 },
};

/**
 * Détermine le mode de difficulté en fonction du niveau du joueur (pipeline non contournable).
 * L'utilisateur ne choisit pas : la difficulté augmente avec la progression.
 */
export function getDifficultyModeForLevel(level: number): QuizDifficultyMode {
  if (level <= 3) return 'facile';
  if (level <= 7) return 'standard';
  return 'expert';
}

/**
 * Tire `count` questions dont la difficulté est **fixée par le niveau** du joueur.
 * Utilisé pour le pipeline gamifié : on ne peut pas rester en « facile » indéfiniment.
 */
export function drawBalancedQuestionsForLevel(
  questions: QuizQuestion[],
  count: number,
  level: number
): QuizQuestion[] {
  const mode = getDifficultyModeForLevel(level);
  return drawBalancedQuestionsWithMode(questions, count, mode);
}

/**
 * Tire `count` questions en fonction du mode (utilisé en interne par drawBalancedQuestionsForLevel).
 */
export function drawBalancedQuestionsWithMode(
  questions: QuizQuestion[],
  count: number,
  mode: QuizDifficultyMode
): QuizQuestion[] {
  const byDiff = { 1: [] as QuizQuestion[], 2: [] as QuizQuestion[], 3: [] as QuizQuestion[] };
  for (const q of questions) {
    if (byDiff[q.difficulty]) byDiff[q.difficulty].push(q);
  }
  fisherYates(byDiff[1]);
  fisherYates(byDiff[2]);
  fisherYates(byDiff[3]);
  const { d1, d2, d3 } = DIFFICULTY_TARGETS[mode];
  const target1 = Math.min(d1, byDiff[1].length);
  const target2 = Math.min(d2, byDiff[2].length);
  const target3 = Math.min(d3, byDiff[3].length);
  const pool: QuizQuestion[] = [
    ...byDiff[1].slice(0, target1),
    ...byDiff[2].slice(0, target2),
    ...byDiff[3].slice(0, target3),
  ];
  let need = count - pool.length;
  if (need > 0) {
    const rest: QuizQuestion[] = [
      ...byDiff[1].slice(target1),
      ...byDiff[2].slice(target2),
      ...byDiff[3].slice(target3),
    ];
    fisherYates(rest);
    for (let i = 0; i < need && i < rest.length; i++) pool.push(rest[i]!);
  }
  fisherYates(pool);
  const selected = pool.slice(0, count);
  // Ordre croissant par difficulté (★ → ★★ → ★★★) pour une progression logique dans la série
  selected.sort((a, b) => a.difficulty - b.difficulty);
  return selected.map(shuffleQuestionOptions);
}

/** Difficulté max des questions : 1 = ★, 2 = ★★, 3 = ★★★. Il n'y a pas de niveau 4. */
export const QUIZ_DIFFICULTY_MAX = 3;

/** Retourne le libellé étoiles pour une difficulté (1 à QUIZ_DIFFICULTY_MAX). */
export function getDifficultyStars(d: number): string {
  const n = Math.min(Math.max(1, d), QUIZ_DIFFICULTY_MAX);
  return '★'.repeat(n);
}

/** Catégories du quiz pour affichage maîtrise (labels) */
export const QUIZ_CATEGORY_LABELS: Record<string, string> = {
  finance: 'Finance',
  science: 'Science',
  geopolitics: 'Géopolitique',
  tech: 'Tech',
  culture: 'Culture',
  general: 'Culture G.',
  actualité: 'Actualité',
};

/** Questions d'actualité (récentes) — Pro = plus présentes dans le tirage */
export const ACTUALITÉ_CATEGORY = 'actualité';

/** Groupe les questions par difficulté (1, 2, 3) pour les échanges. */
function groupByDifficulty(pool: QuizQuestion[]): Record<1 | 2 | 3, QuizQuestion[]> {
  const out: Record<1 | 2 | 3, QuizQuestion[]> = { 1: [], 2: [], 3: [] };
  for (const q of pool) {
    if (q.difficulty >= 1 && q.difficulty <= 3) out[q.difficulty as 1 | 2 | 3].push(q);
  }
  fisherYates(out[1]);
  fisherYates(out[2]);
  fisherYates(out[3]);
  return out;
}

/**
 * Calcule la répartition cible (d1, d2, d3) à partir du niveau adaptatif (1.0–3.0).
 * Plus adaptiveLevel est élevé, plus on tire de questions difficiles (★★★).
 */
export function getDifficultyTargetsForAdaptiveLevel(
  adaptiveLevel: number,
  count: number
): { d1: number; d2: number; d3: number } {
  const level = Math.max(1, Math.min(3, adaptiveLevel));
  let d3 = Math.min(3, Math.max(0, Math.round((level - 1) * 1.5)));
  let d1 = Math.min(3, Math.max(0, Math.round((3 - level) * 1.5)));
  let d2 = count - d1 - d3;
  if (d2 < 0) {
    if (d1 >= d3) d1 = Math.max(0, d1 + d2);
    else d3 = Math.max(0, d3 + d2);
    d2 = count - d1 - d3;
  }
  return { d1: Math.max(0, d1), d2: Math.max(0, d2), d3: Math.max(0, d3) };
}

/**
 * Tire `count` questions avec une répartition (d1, d2, d3) donnée.
 */
function drawQuestionsWithTargets(
  questions: QuizQuestion[],
  count: number,
  targets: { d1: number; d2: number; d3: number }
): QuizQuestion[] {
  const byDiff = { 1: [] as QuizQuestion[], 2: [] as QuizQuestion[], 3: [] as QuizQuestion[] };
  for (const q of questions) {
    if (byDiff[q.difficulty]) byDiff[q.difficulty].push(q);
  }
  fisherYates(byDiff[1]);
  fisherYates(byDiff[2]);
  fisherYates(byDiff[3]);
  const { d1, d2, d3 } = targets;
  const target1 = Math.min(d1, byDiff[1].length);
  const target2 = Math.min(d2, byDiff[2].length);
  const target3 = Math.min(d3, byDiff[3].length);
  const pool: QuizQuestion[] = [
    ...byDiff[1].slice(0, target1),
    ...byDiff[2].slice(0, target2),
    ...byDiff[3].slice(0, target3),
  ];
  let need = count - pool.length;
  if (need > 0) {
    const rest: QuizQuestion[] = [
      ...byDiff[1].slice(target1),
      ...byDiff[2].slice(target2),
      ...byDiff[3].slice(target3),
    ];
    fisherYates(rest);
    for (let i = 0; i < need && i < rest.length; i++) pool.push(rest[i]!);
  }
  fisherYates(pool);
  const selected = pool.slice(0, count);
  selected.sort((a, b) => a.difficulty - b.difficulty);
  return selected.map(shuffleQuestionOptions);
}

/**
 * Tire `count` questions selon le niveau adaptatif (1.0–3.0), puis ajuste l'actualité.
 * Utilisé pour l'algorithme adaptatif : les questions proposées s'ajustent en permanence
 * selon les réponses de l'utilisateur (bonne réponse → niveau monte, mauvaise → descend).
 */
export function drawAdaptiveQuestionsWithActualité(
  questions: QuizQuestion[],
  count: number,
  adaptiveLevel: number,
  isPremium: boolean
): QuizQuestion[] {
  const actualitéPool = questions.filter(q => q.category === ACTUALITÉ_CATEGORY);

  const targets = getDifficultyTargetsForAdaptiveLevel(adaptiveLevel, count);
  let selected = drawQuestionsWithTargets(questions, count, targets);

  const nActualitéWanted = isPremium
    ? Math.min(3, Math.max(2, Math.floor(count * 0.5)))
    : Math.min(1, actualitéPool.length);
  const nActualité = Math.min(nActualitéWanted, actualitéPool.length);
  const currentActualité = selected.filter(q => q.category === ACTUALITÉ_CATEGORY).length;

  if (currentActualité === nActualité) {
    return selected;
  }

  const byDiffActualité = groupByDifficulty(actualitéPool);
  const cultureGPool = questions.filter(q => q.category !== ACTUALITÉ_CATEGORY);
  const byDiffCultureG = groupByDifficulty(cultureGPool);
  const selectedIds = new Set(selected.map(q => q.id));

  const pickReplacement = (diff: 1 | 2 | 3, fromActualité: boolean): QuizQuestion | null => {
    const pool = fromActualité ? byDiffActualité[diff] : byDiffCultureG[diff];
    const available = pool.filter(q => !selectedIds.has(q.id));
    if (available.length === 0) return null;
    return available[0] ?? null;
  };

  if (currentActualité < nActualité) {
    let toReplace = nActualité - currentActualité;
    for (let i = 0; i < selected.length && toReplace > 0; i++) {
      const q = selected[i]!;
      if (q.category === ACTUALITÉ_CATEGORY) continue;
      const replacement = pickReplacement(q.difficulty as 1 | 2 | 3, true);
      if (replacement) {
        selectedIds.delete(q.id);
        selectedIds.add(replacement.id);
        selected = selected.map((prev, j) => (j === i ? replacement : prev));
        toReplace--;
      }
    }
  } else {
    let toReplace = currentActualité - nActualité;
    for (let i = 0; i < selected.length && toReplace > 0; i++) {
      const q = selected[i]!;
      if (q.category !== ACTUALITÉ_CATEGORY) continue;
      const replacement = pickReplacement(q.difficulty as 1 | 2 | 3, false);
      if (replacement) {
        selectedIds.delete(q.id);
        selectedIds.add(replacement.id);
        selected = selected.map((prev, j) => (j === i ? replacement : prev));
        toReplace--;
      }
    }
  }

  selected.sort((a, b) => a.difficulty - b.difficulty);
  return selected.map(shuffleQuestionOptions);
}

/**
 * Tire `count` questions en équilibrant difficulté (selon le niveau) PUIS ajuste le nombre d'actualité.
 * - On tire d'abord 5 questions avec la bonne répartition ★ / ★★ / ★★★ (synchro avec le texte « mix ★★ »).
 * - Puis on remplace certaines par de l'actualité ou de la culture G pour respecter gratuit (0–1 actualité) / Pro (2–3).
 */
export function drawBalancedQuestionsForLevelWithActualité(
  questions: QuizQuestion[],
  count: number,
  level: number,
  isPremium: boolean
): QuizQuestion[] {
  const actualitéPool = questions.filter(q => q.category === ACTUALITÉ_CATEGORY);
  const cultureGPool = questions.filter(q => q.category !== ACTUALITÉ_CATEGORY);

  const mode = getDifficultyModeForLevel(level);
  // 1) Tirage principal : bonne distribution de difficulté sur TOUTES les questions (synchro avec l’UI)
  let selected = drawBalancedQuestionsWithMode(questions, count, mode);

  const nActualitéWanted = isPremium
    ? Math.min(3, Math.max(2, Math.floor(count * 0.5)))
    : Math.min(1, actualitéPool.length);
  const nActualité = Math.min(nActualitéWanted, actualitéPool.length);
  const currentActualité = selected.filter(q => q.category === ACTUALITÉ_CATEGORY).length;

  if (currentActualité === nActualité) {
    return selected;
  }

  const byDiffActualité = groupByDifficulty(actualitéPool);
  const byDiffCultureG = groupByDifficulty(cultureGPool);
  const selectedIds = new Set(selected.map(q => q.id));

  const pickReplacement = (diff: 1 | 2 | 3, fromActualité: boolean): QuizQuestion | null => {
    const pool = fromActualité ? byDiffActualité[diff] : byDiffCultureG[diff];
    const available = pool.filter(q => !selectedIds.has(q.id));
    if (available.length === 0) return null;
    return available[0] ?? null;
  };

  if (currentActualité < nActualité) {
    // Remplacer des culture G par de l’actualité (même difficulté)
    let toReplace = nActualité - currentActualité;
    for (let i = 0; i < selected.length && toReplace > 0; i++) {
      const q = selected[i]!;
      if (q.category === ACTUALITÉ_CATEGORY) continue;
      const replacement = pickReplacement(q.difficulty as 1 | 2 | 3, true);
      if (replacement) {
        selectedIds.delete(q.id);
        selectedIds.add(replacement.id);
        selected = selected.map((prev, j) => (j === i ? replacement : prev));
        toReplace--;
      }
    }
  } else {
    // Remplacer des actualité par de la culture G (même difficulté)
    let toReplace = currentActualité - nActualité;
    for (let i = 0; i < selected.length && toReplace > 0; i++) {
      const q = selected[i]!;
      if (q.category !== ACTUALITÉ_CATEGORY) continue;
      const replacement = pickReplacement(q.difficulty as 1 | 2 | 3, false);
      if (replacement) {
        selectedIds.delete(q.id);
        selectedIds.add(replacement.id);
        selected = selected.map((prev, j) => (j === i ? replacement : prev));
        toReplace--;
      }
    }
  }

  selected.sort((a, b) => a.difficulty - b.difficulty);
  return selected.map(shuffleQuestionOptions);
}
