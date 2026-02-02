# Assets — icône et splash

- **Icône définitive App Store** : `public/AppIcon-1024.png` (1024×1024 PNG). Source unique pour :
  - Web : favicon et apple-touch-icon (`index.html`)
  - iOS : **toutes les dimensions** d’icône (iPhone, iPad, App Store) + **splash** générés depuis cette icône
- **Génération iOS** : `npm run cap:assets` exécute `scripts/generate-ios-assets.mjs` qui :
  - Génère **toutes les tailles d’icône** (20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024 px) dans `AppIcon.appiconset/`
  - Génère le **splash** (fond #050505, icône centrée à 28 %) dans `Splash.imageset/` (6 images 1x/2x/3x × light/dark)
  - Supprime les anciens fichiers (splash-2732x2732*, ancienne icône unique)
- **Après mise à jour de l’icône** : remplacer `public/AppIcon-1024.png` puis lancer `npm run cap:assets`
