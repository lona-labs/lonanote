import { Arch, OsType, Platform, arch, platform, type, version } from '@tauri-apps/plugin-os';

interface OSConfig {
  arch: Arch;
  osType: OsType;
  platform: Platform;
  version: string;
  desktop?: boolean;
  mobile?: boolean;
  isInited?: boolean;
}

const osType = type();

export const os: OSConfig = {
  osType,
  arch: arch(),
  platform: platform(),
  version: version(),
  desktop: osType === 'windows' || osType === 'macos' || osType === 'linux',
  mobile: osType === 'android' || osType === 'ios',
};
