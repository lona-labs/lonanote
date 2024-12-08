import pkg from '@/../package.json';

export const appConfig = {
  isDev: import.meta.env.DEV,
  version: pkg.version,
  appName: 'LonaNote',
};
