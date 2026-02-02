# NOESIS — iOS (Capacitor)

Projet Xcode généré par [Capacitor](https://capacitorjs.com). L’app web (React + Vite) est servie dans un WebView natif.

## Ouvrir dans Xcode

```bash
cd "/chemin/vers/noesis app v1"
npx cap open ios
```

Ou depuis la racine du projet : `npm run cap:ios` (build + sync icône + ouverture Xcode).

## Logo et splash

- **Source unique** : `public/AppIcon-1024.png` (1024×1024). C’est l’icône utilisée pour le web (favicon, apple-touch-icon) et comme source pour iOS.
- **Synchroniser l’icône iOS** : `npm run cap:icons` copie `public/AppIcon-1024.png` vers `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`. À lancer après toute mise à jour du logo.
- **Régénérer icône + splash iOS** : `npm run cap:assets` (nécessite `npm i -D @capacitor/assets`). Génère l’icône et le splash (logo sur fond #050505) pour iOS. Le splash est affiché au lancement (LaunchScreen.storyboard, fond #050505).

## Préparer la publication App Store

1. **Ouvrir le projet** : `npx cap open ios` (ouvre `ios/App/App.xcworkspace` ou `App.xcodeproj`).
2. **Signer l’app** : dans Xcode, sélectionner la cible **App** → **Signing & Capabilities** → choisir votre **Team** et activer **Automatically manage signing**.
3. **Bundle ID** : déjà défini à `com.noesis.app` (modifiable dans le projet si besoin).
4. **Nom d’affichage** : **NOESIS** (défini dans `Info.plist` / `CFBundleDisplayName`).
5. **Icône** : `App/Assets.xcassets/AppIcon.appiconset/` (fichier 1024×1024 référencé dans Contents.json). Xcode utilise une seule taille pour toutes les résolutions.
6. **Splash** : `App/Assets.xcassets/Splash.imageset/` — image de lancement (logo sur fond sombre), utilisée par LaunchScreen.storyboard.
7. **Build & run** : sélectionner un simulateur ou un appareil puis ▶ Run.
8. **Archive** : **Product → Archive**, puis **Distribute App** pour envoyer vers App Store Connect.

## Workflow de développement

Après chaque modification du code web :

```bash
npm run build
npm run cap:icons
npx cap sync ios
```

Puis recharger l’app dans le simulateur (ou relancer depuis Xcode). Vous pouvez aussi utiliser le live reload en configurant `server.url` dans `capacitor.config.ts`.
