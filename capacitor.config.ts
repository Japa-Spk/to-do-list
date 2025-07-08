import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'to-do-list',
  webDir: 'www',
  assets: {
    splash: {
      path: 'resources/splash.png',
      backgroundColor: '#FFFFFF'
    },
    icon: {
      path: 'resources/icon.png'
    }
  }
};

export default config;
