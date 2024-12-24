import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      setTitleBarBtnColor: (color: string) => Promise<any>;
      invoke: (key: string, args: string | null | undefined) => Promise<string | null | undefined>;
      invokeAsync: (
        key: string,
        args: string | null | undefined,
      ) => Promise<string | null | undefined>;
      regJsFunction: (
        key: string,
        callback: (args: string | null | undefined) => Promise<string | null | undefined>,
      ) => Promise<void>;
      unregJsFunction: (key: string) => Promise<void>;
      clearJsFunction: () => Promise<void>;
    };
  }
}
