import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

// Custom APIs for renderer
const api = {
  setTitleBarColor: async (color: string, backgroudColor: string) => {
    await ipcRenderer.invoke('setTitleBarColor', color, backgroudColor);
  },
  invoke: async (cmd: string, args: any) => {
    return await ipcRenderer.invoke('invoke', cmd, args);
  },
  invokeAsync: async (cmd: string, args: any) => {
    return await ipcRenderer.invoke('invokeAsync', cmd, args);
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
