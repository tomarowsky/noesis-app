import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.noesis.app',
  appName: 'NOESIS',
  webDir: 'dist',
  /** Icône et splash : source unique public/AppIcon-1024.png ; iOS via ios/App/App/Assets.xcassets. Sync : npm run cap:icons */
  server: {
    // En dev : décommenter pour recharger sur le device/simulateur
    // url: 'http://192.168.x.x:5173',
    // cleartext: true
  },
};

export default config;
