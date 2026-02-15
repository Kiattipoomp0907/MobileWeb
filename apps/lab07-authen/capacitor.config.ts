import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cpkku.kiattipoom.lab07', // แก้ตรงนี้ (cpkku + ชื่อย่อคุณ + lab07)
  appName: 'lab07-authen',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com", "password"],
    },
  },
};

export default config;