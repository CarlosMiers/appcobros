import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'AppCobros',
  webDir: 'www',
  
  server: {
  cleartext: true,
  url: 'https://api.synsa.com.py/serverapp/ypora/v1'
}
  
};
