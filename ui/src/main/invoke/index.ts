import { testRustCall } from 'lonanote-core-node';

import { clearJsFunction, invoke, invokeAsync, regJsFunction, unregJsFunction } from './invoke';

export * from './invoke';

export const initInvokeIpc = (ipcMain: Electron.IpcMain) => {
  ipcMain.handle('invoke', async (_, key, args) => {
    return invoke(key, args);
  });
  ipcMain.handle('invokeAsync', async (_, key, args) => {
    return await invokeAsync(key, args);
  });
  // ipcMain.handle('regJsFunction', async (_, key, callback) => {
  //   return regJsFunction(key, callback);
  // });
  // ipcMain.handle('unregJsFunction', async (_, key) => {
  //   return unregJsFunction(key);
  // });
  // ipcMain.handle('clearJsFunction', async (_) => {
  //   return clearJsFunction();
  // });
};
