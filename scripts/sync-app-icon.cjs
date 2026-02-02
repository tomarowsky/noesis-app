#!/usr/bin/env node
/**
 * Synchronise l'icône de l'app depuis public/ vers iOS (copie du 1024 uniquement).
 * Source : public/AppIcon-1024.png
 * Pour régénérer TOUTES les dimensions d'icône + splash depuis l'icône actuelle : npm run cap:assets
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'public', 'AppIcon-1024.png');
const dest = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset', 'AppIcon-1024.png');

if (!fs.existsSync(src)) {
  console.error('sync-app-icon: public/AppIcon-1024.png introuvable.');
  process.exit(1);
}

const destDir = path.dirname(dest);
if (!fs.existsSync(destDir)) {
  console.error('sync-app-icon: dossier iOS AppIcon.appiconset introuvable. Lancez "npx cap add ios" si besoin.');
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log('Icône 1024 synchronisée : public/AppIcon-1024.png → ios/.../AppIcon.appiconset/AppIcon-1024.png');
