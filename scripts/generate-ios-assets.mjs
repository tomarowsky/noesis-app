#!/usr/bin/env node
/**
 * Génère tous les assets iOS depuis l'icône actuelle (public/AppIcon-1024.png) :
 * - Toutes les dimensions d'icône (iPhone, iPad, App Store)
 * - Splash screen unique (fond #050505 + icône centrée), remplace tous les anciens
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const iconSrc = path.join(root, 'public', 'AppIcon-1024.png');
const appIconDir = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
const splashDir = path.join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'Splash.imageset');

const SPLASH_BG = '#050505';
const SPLASH_ICON_SCALE = 0.28; // icône à 28% de la largeur du splash
const SPLASH_SIZE = 2732; // base splash 2732x2732

// Tous les slots iOS (size en points, scale, idiom) → dimension en pixels
const IOS_ICON_SLOTS = [
  { size: '20x20', scale: '2x', idiom: 'iphone', pixels: 40 },
  { size: '20x20', scale: '3x', idiom: 'iphone', pixels: 60 },
  { size: '29x29', scale: '2x', idiom: 'iphone', pixels: 58 },
  { size: '29x29', scale: '3x', idiom: 'iphone', pixels: 87 },
  { size: '40x40', scale: '2x', idiom: 'iphone', pixels: 80 },
  { size: '40x40', scale: '3x', idiom: 'iphone', pixels: 120 },
  { size: '60x60', scale: '2x', idiom: 'iphone', pixels: 120 },
  { size: '60x60', scale: '3x', idiom: 'iphone', pixels: 180 },
  { size: '20x20', scale: '1x', idiom: 'ipad', pixels: 20 },
  { size: '20x20', scale: '2x', idiom: 'ipad', pixels: 40 },
  { size: '29x29', scale: '1x', idiom: 'ipad', pixels: 29 },
  { size: '29x29', scale: '2x', idiom: 'ipad', pixels: 58 },
  { size: '40x40', scale: '1x', idiom: 'ipad', pixels: 40 },
  { size: '40x40', scale: '2x', idiom: 'ipad', pixels: 80 },
  { size: '76x76', scale: '1x', idiom: 'ipad', pixels: 76 },
  { size: '76x76', scale: '2x', idiom: 'ipad', pixels: 152 },
  { size: '83.5x83.5', scale: '2x', idiom: 'ipad', pixels: 167 },
  { size: '1024x1024', scale: '1x', idiom: 'ios-marketing', pixels: 1024 },
];

const SPLASH_FILES = [
  { filename: 'Default@1x~universal~anyany.png', scale: '1x' },
  { filename: 'Default@2x~universal~anyany.png', scale: '2x' },
  { filename: 'Default@3x~universal~anyany.png', scale: '3x' },
  { filename: 'Default@1x~universal~anyany-dark.png', scale: '1x', dark: true },
  { filename: 'Default@2x~universal~anyany-dark.png', scale: '2x', dark: true },
  { filename: 'Default@3x~universal~anyany-dark.png', scale: '3x', dark: true },
];

async function main() {
  if (!fs.existsSync(iconSrc)) {
    console.error('Icône source introuvable:', iconSrc);
    process.exit(1);
  }
  if (!fs.existsSync(appIconDir) || !fs.existsSync(splashDir)) {
    console.error('Dossiers iOS Assets.xcassets introuvables. Lancez "npx cap add ios" si besoin.');
    process.exit(1);
  }

  const iconBuffer = await sharp(iconSrc).ensureAlpha().png().toBuffer();
  const iconMeta = await sharp(iconBuffer).metadata();
  const iconSize = iconMeta.width || 1024;

  console.log('Génération des icônes iOS (toutes les dimensions)...');
  const appIconImages = [];
  const seenPixels = new Set();

  for (const slot of IOS_ICON_SLOTS) {
    const px = slot.pixels;
    const filename = `AppIcon-${px}.png`;
    if (!seenPixels.has(px)) {
      await sharp(iconBuffer)
        .resize(px, px)
        .png()
        .toFile(path.join(appIconDir, filename));
      seenPixels.add(px);
    }
    appIconImages.push({
      size: slot.size,
      idiom: slot.idiom,
      filename,
      scale: slot.scale,
    });
  }

  const appIconContents = {
    images: appIconImages,
    info: { version: 1, author: 'xcode' },
  };
  fs.writeFileSync(
    path.join(appIconDir, 'Contents.json'),
    JSON.stringify(appIconContents, null, 2)
  );
  console.log('  AppIcon.appiconset: ' + appIconImages.length + ' entrées, ' + seenPixels.size + ' fichiers.');

  // Supprimer les anciens fichiers d’icône qui ne sont plus référencés
  const keptIconFiles = new Set(appIconImages.map((i) => i.filename));
  for (const name of fs.readdirSync(appIconDir)) {
    if (name.endsWith('.png') && !keptIconFiles.has(name)) {
      fs.unlinkSync(path.join(appIconDir, name));
      console.log('  Supprimé:', name);
    }
  }

  console.log('Génération du splash depuis l’icône (fond #050505, icône centrée)...');
  const iconW = Math.round(SPLASH_SIZE * SPLASH_ICON_SCALE);
  const iconResized = await sharp(iconBuffer).resize(iconW, iconW).png().toBuffer();
  const left = Math.round((SPLASH_SIZE - iconW) / 2);
  const top = Math.round((SPLASH_SIZE - iconW) / 2);

  const splashBase = await sharp({
    create: {
      width: SPLASH_SIZE,
      height: SPLASH_SIZE,
      channels: 4,
      background: { r: 5, g: 5, b: 5, alpha: 1 },
    },
  })
    .composite([{ input: iconResized, left, top }])
    .png()
    .toBuffer();

  // Supprimer tous les anciens fichiers du splash (y compris splash-2732x2732*.png)
  for (const name of fs.readdirSync(splashDir)) {
    if (name !== 'Contents.json' && (name.endsWith('.png') || name.endsWith('.jpg'))) {
      fs.unlinkSync(path.join(splashDir, name));
      console.log('  Splash supprimé:', name);
    }
  }

  for (const entry of SPLASH_FILES) {
    await sharp(splashBase).png().toFile(path.join(splashDir, entry.filename));
  }
  console.log('  Splash.imageset: 6 images générées (1x, 2x, 3x × light/dark).');

  const splashContents = {
    images: [
      { idiom: 'universal', filename: 'Default@1x~universal~anyany.png', scale: '1x' },
      { idiom: 'universal', filename: 'Default@2x~universal~anyany.png', scale: '2x' },
      { idiom: 'universal', filename: 'Default@3x~universal~anyany.png', scale: '3x' },
      {
        appearances: [{ appearance: 'luminosity', value: 'dark' }],
        idiom: 'universal',
        scale: '1x',
        filename: 'Default@1x~universal~anyany-dark.png',
      },
      {
        appearances: [{ appearance: 'luminosity', value: 'dark' }],
        idiom: 'universal',
        scale: '2x',
        filename: 'Default@2x~universal~anyany-dark.png',
      },
      {
        appearances: [{ appearance: 'luminosity', value: 'dark' }],
        idiom: 'universal',
        scale: '3x',
        filename: 'Default@3x~universal~anyany-dark.png',
      },
    ],
    info: { version: 1, author: 'xcode' },
  };
  fs.writeFileSync(
    path.join(splashDir, 'Contents.json'),
    JSON.stringify(splashContents, null, 2)
  );

  console.log('Terminé. Icône et splash générés depuis public/AppIcon-1024.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
