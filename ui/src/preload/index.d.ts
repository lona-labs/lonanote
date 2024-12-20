import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      setTitleBarBtnColor: (color: string) => Promise<any>;
      invoke: (cmd: string, args: any) => Promise<any>;
      invokeAsync: (cmd: string, args: any) => Promise<any>;
    };
  }
}
