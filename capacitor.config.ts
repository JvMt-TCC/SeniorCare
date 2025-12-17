import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.seniorcare',
  appName: 'bem-estar-social',
  webDir: 'dist',
  server: {
    url: 'https://3a1003fd-c05f-4cb7-8870-1dc3dc42a0d5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;