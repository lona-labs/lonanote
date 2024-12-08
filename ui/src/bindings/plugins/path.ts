import { invokePlugin } from '../invoke';
import {
  appCacheDir,
  appConfigDir,
  appDataDir,
  appLocalDataDir,
  appLogDir,
  audioDir,
  cacheDir,
  configDir,
  dataDir,
  desktopDir,
  documentDir,
  downloadDir,
  executableDir,
  fontDir,
  homeDir,
  localDataDir,
  pictureDir,
  publicDir,
  resourceDir,
  runtimeDir,
  tempDir,
  templateDir,
} from '@tauri-apps/api/path';

const name = 'path';

const getPath = async (key: string): Promise<string> => {
  return (await invokePlugin(name, key))!;
};

export const path = {
  appCacheDir: async () => await appCacheDir(),
  appConfigDir: async () => await appConfigDir(),
  appDataDir: async () => await appDataDir(),
  appLocalDataDir: async () => await appLocalDataDir(),
  appLogDir: async () => await appLogDir(),
  audioDir: async () => await audioDir(),
  cacheDir: async () => await cacheDir(),
  configDir: async () => await configDir(),
  dataDir: async () => await dataDir(),
  desktopDir: async () => await desktopDir(),
  documentDir: async () => await documentDir(),
  downloadDir: async () => await downloadDir(),
  executableDir: async () => await executableDir(),
  fontDir: async () => await fontDir(),
  homeDir: async () => await homeDir(),
  localDataDir: async () => await localDataDir(),
  pictureDir: async () => await pictureDir(),
  publicDir: async () => await publicDir(),
  resourceDir: async () => await resourceDir(),
  runtimeDir: async () => await runtimeDir(),
  tempDir: async () => await tempDir(),
  templateDir: async () => await templateDir(),
  dataPath: async () => await getPath('data_path'),
  localDataPath: async () => await getPath('local_data_path'),
};
