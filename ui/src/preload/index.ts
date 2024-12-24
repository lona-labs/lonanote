import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

let jsFunctions:
  | Record<
      string,
      ((args: string | null | undefined) => Promise<string | null | undefined>) | undefined
    >
  | undefined = undefined;

ipcRenderer.on('jsFunctionCall', async (_, key, args, returnChannel) => {
  if (!jsFunctions || !jsFunctions[key]) {
    ipcRenderer.send(returnChannel, 0);
    return;
  }
  let res: string | null | undefined;
  try {
    res = await jsFunctions[key](args);
  } catch (e) {
    console.error('jsFunctionCall error:', e);
    res = undefined;
  }
  ipcRenderer.send(returnChannel, 1, res);
});

// Custom APIs for renderer
const api = {
  setTitleBarColor: async (color: string, backgroudColor: string) => {
    await ipcRenderer.invoke('setTitleBarColor', color, backgroudColor);
  },
  invoke: async (key: string, args: string | null | undefined) => {
    return await ipcRenderer.invoke('invoke', key, args);
  },
  invokeAsync: async (key: string, args: string | null | undefined) => {
    return await ipcRenderer.invoke('invokeAsync', key, args);
  },
  regJsFunction: async (
    key: string,
    callback: (args: string | null | undefined) => Promise<string | null | undefined>,
  ) => {
    jsFunctions = jsFunctions || {};
    jsFunctions[key] = callback;
    return await ipcRenderer.invoke('regJsFunction', key);
  },
  unregJsFunction: async (key: string) => {
    jsFunctions = jsFunctions || {};
    jsFunctions[key] = undefined;
    return await ipcRenderer.invoke('unregJsFunction', key);
  },
  clearJsFunction: async () => {
    jsFunctions = {};
    return await ipcRenderer.invoke('clearJsFunction');
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
