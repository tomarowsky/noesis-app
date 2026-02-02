# NOESIS — Doc d’appui : l’app, les secrets, le mode développeur

Document de référence pour retrouver rapidement le fonctionnement de l’app, les secrets et le code du mode développeur.

---

## 1. Mot de passe du mode développeur

**Mot de passe :** `noesis-dev`

- Défini une seule fois dans le code : `src/App.tsx`, constante **`DEV_PASSWORD`** (ligne ~103).
- À saisir dans la modale qui s’ouvre après **10 taps** sur le **badge niveau** (en haut à droite du header).

---

## 2. Comment activer le mode développeur

1. **10 taps rapides** sur le badge niveau (icône éclair + niveau, en haut à droite), dans une fenêtre d’environ **2 secondes** (un timeout remet le compteur à zéro après 2 s sans tap).
2. Si le mode n’a jamais été déverrouillé dans cette session : une **modale** demande le mot de passe.
3. Saisir **`noesis-dev`** puis valider (bouton « Déverrouiller » ou Entrée).
4. Le **panneau développeur** s’ouvre en bas de l’écran.

Une fois déverrouillé dans la session (`devUnlocked === true`), les prochains **10 taps** sur le badge ouvrent directement le panneau (sans redemander le mot de passe). Le déverrouillage n’est **pas persisté** au rechargement de la page.

### Référence code — mode dev

| Élément | Fichier | Lignes / repère |
|--------|---------|------------------|
| Constante mot de passe | `src/App.tsx` | `const DEV_PASSWORD = 'noesis-dev';` (~102-103) |
| États (prompt, panel, override) | `src/App.tsx` | `showDevUnlockPrompt`, `showDevPanel`, `devUnlocked`, `devLevelOverride`, `devLifetimeOverride` (~2957-2961) |
| Refs compteur 10 taps | `src/App.tsx` | `levelBadgeTapCountRef`, `levelBadgeTapTimeoutRef` (~2973-2974) |
| Handler clic badge (10 taps → prompt ou panel) | `src/App.tsx` | `onClick` du bouton badge niveau (~3209-3225) |
| Modale mot de passe | `src/App.tsx` | Bloc `{showDevUnlockPrompt && (...)}` (~4012-4055) |
| Panneau dev (niveau / Lifetime) | `src/App.tsx` | Bloc `{showDevPanel && (...)}` (~4057-4110) |
| Niveau effectif utilisé partout | `src/App.tsx` | `effectiveLevel`, `effectiveLifetime` (~2978-2980) |

Le mode dev permet de **prévisualiser** l’UI à un niveau donné ou en « Lifetime » (tout débloqué) **sans modifier** la progression réelle (XP, niveau, achievements) stockée dans le store.

---

## 3. Vue d’ensemble de l’app

- **Type :** app de données / KPIs avec parcours de progression (XP, niveaux, défis, quiz).
- **Stack :** React, TypeScript, Vite. État global : Zustand (`src/store/progressStore.ts`).
- **Écrans principaux :** Dashboard (cartes de données), Explorer (par catégorie), Profil (identité, tableau de bord, personnalisation, sécurités).
- **Monétisation :** paywall (abonnement / Lifetime) ; déblocage progressif des widgets par **niveau** (XP) ou **Lifetime** (tout débloqué).
- **Personnalisation :** thème, couleur d’accent, police, layout, effets particules, animations — stockés dans `customizations` (progressStore).

---

## 4. Secrets et découvertes

Les **secrets** sont des débloquables cachés (thèmes, contenus spéciaux). Ils ne s’affichent pas dans la liste normale des fonctionnalités ; on y accède par **codes** (clavier ou texte) dans le **menu secret**.

### Comment ouvrir le menu secret

- **Long press** (~1,5 s) sur le **logo** en haut à gauche du header → ouvre le **Secret Menu** (modal).
- Dans ce menu : champ de saisie pour **codes texte** (mobile / desktop) et, sur desktop, détection de **séquences clavier**.

### Découverte d’un secret

1. L’utilisateur atteint le **niveau requis** du secret (défini dans `progressStore`, `unlockedFeatures` avec `hidden: true`).
2. Il tape le **bon code** (texte ou clavier) dans le menu secret.
3. `discoverSecret(secretId)` est appelé → le secret est ajouté à `discoveredSecrets`, un message « wow » + bénéfice s’affichent (`src/config/discoveries.ts`), et des XP peuvent être accordés.

### Liste des secrets (IDs et niveaux)

Définis dans **`src/store/progressStore.ts`** (unlockedFeatures, entrées `category: 'secret'`) :

| ID | Niveau requis | Description courte |
|----|----------------|--------------------|
| `secret_matrix` | 1 | Mode Matrix (thème vert) |
| `secret_retro` | 1 | Thème Rétro |
| `secret_pi` | 3 | Pi |
| `secret_gold_rush` | 5 | Ruée vers l’Or (données or) |
| `secret_moon` | 5 | Lune |
| `secret_triforce` | 7 | Triforce |
| `secret_quantum` | 10 | Données Quantiques |
| `secret_iddqd` | 13 | Mode Dieu (IDDQD) |
| `secret_illuminati` | 15 | Illuminati |
| `secret_time_travel` | 20 | Voyage Temporel |
| `secret_omega` | 25 | Oméga |
| `secret_42` | 42 | La Réponse |

### Codes texte (saisie dans le champ du menu secret)

Définis dans **`src/components/SecretMenu.tsx`** : `TEXT_CODES` (texte → `secretId`). Exemples :

- `matrix`, `konami` → `secret_matrix`
- `retro` → `secret_retro`
- `gold` → `secret_gold_rush`
- `quantum` → `secret_quantum`
- `42` → `secret_42`
- `illuminati`, `oeil` → `secret_illuminati`
- `delorean`, `bttf`, `gigawatts`, `121`, `voyage` → `secret_time_travel`
- `triforce`, `zelda` → `secret_triforce`
- `pi`, `314` → `secret_pi`
- `omega` → `secret_omega`
- `iddqd` → `secret_iddqd`
- `lune`, `moon` → `secret_moon`

(Saisie insensible à la casse, normalisée en minuscules.)

### Codes clavier (desktop uniquement)

Touches écoutées quand le menu secret est **ouvert** ; définis dans **`src/components/SecretMenu.tsx`** : `SECRET_CODES` (séquence de touches → `secretId`). Ex. : Konami (↑↑↓↓←→←→ B A) pour `secret_matrix`, `retro`, `gold`, `quantum`, `42`.

### Messages « wow » et bénéfices

Dans **`src/config/discoveries.ts`** : `SECRET_DISCOVERY[secretId]` avec `wowMessage` et `benefit` pour l’affichage après découverte.

---

## 5. Fichiers clés

| Rôle | Fichier |
|-----|---------|
| Entrée app, layout, badge niveau, modale dev, panneau dev | `src/App.tsx` |
| État global (XP, niveau, achievements, customizations, discoveredSecrets, etc.) | `src/store/progressStore.ts` |
| Définition des secrets (niveau, hint) | `src/store/progressStore.ts` (unlockedFeatures) |
| Codes texte + clavier, menu secret | `src/components/SecretMenu.tsx` |
| Messages découverte (wow + benefit) | `src/config/discoveries.ts` |
| Thèmes / couleurs liés aux secrets | `src/components/CustomizationPanel.tsx` (ex. matrix, retro, gold) |

---

## 6. Résumé rapide

- **Mode dev :** 10 taps sur le badge niveau → mot de passe **`noesis-dev`** → panneau pour prévisualiser niveau ou Lifetime.
- **Secrets :** menu secret (long press sur le logo) → codes texte ou clavier selon niveau requis ; découverte enregistrée dans `discoveredSecrets`.
- **Code du mot de passe dev :** `src/App.tsx`, constante **`DEV_PASSWORD`**.

Tu peux t’appuyer sur ce doc demain pour retrouver le mot de passe, le flux du mode dev et l’emplacement du code correspondant.
