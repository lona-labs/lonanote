import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      setTitleBarBtnColor: (color: string) => Promise<any>;
      invoke: (keykey: string, args: any) => Promise<any>;
      invokeAsync: (key: string, args: any) => Promise<any>;
      // regJsFunction: (
      //   key: string,
      //   callback: (args: string | null | undefined) => string | null | undefined,
      // ) => Promise<void>;
      // unregJsFunction: (key: string) => Promise<void>;
      // clearJsFunction: () => Promise<void>;
    };
  }
}
