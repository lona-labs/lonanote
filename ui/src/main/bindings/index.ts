import { BrowserWindow } from 'electron';

import * as bindings from './bindings';

export * from './bindings';

export const initInvokeIpc = (ipcMain: Electron.IpcMain, win: BrowserWindow) => {
  let returnSequence = 0;
  const jsFunctionCallChannel = 'jsFunctionCall';
  const jsFunctionCall = (
    webContents: Electron.WebContents,
    key: string,
    args: string | null | undefined,
  ): Promise<string | null | undefined> => {
    return new Promise((resolve, reject) => {
      if (webContents) {
        if (webContents.isLoading()) {
          reject(new Error('webContents is loading'));
          return;
        }
        if (returnSequence >= Number.MAX_SAFE_INTEGER) {
          returnSequence = 0;
        }
        const returnChannel = `${jsFunctionCallChannel}:return:${returnSequence++}`;
        ipcMain.once(returnChannel, (_, code, result) => {
          if (code === 1) {
            resolve(result);
          } else {
            reject(new Error('notfound js function: ' + key));
          }
        });
        webContents.send(jsFunctionCallChannel, key, args, returnChannel);
      } else {
        resolve(undefined);
      }
    });
  };
  ipcMain.removeHandler('invoke');
  ipcMain.removeHandler('getCommandKeys');
  ipcMain.removeHandler('getCommandLen');
  ipcMain.removeHandler('invokeAsync');
  ipcMain.removeHandler('getCommandAsyncKeys');
  ipcMain.removeHandler('getCommandAsyncLen');
  ipcMain.removeHandler('regJsFunction');
  ipcMain.removeHandler('unregJsFunction');
  ipcMain.removeHandler('clearJsFunction');
  ipcMain.removeHandler('getCommandJsKeys');
  ipcMain.removeHandler('getCommandJsLen');

  ipcMain.handle('invoke', async (_, key, args) => {
    return bindings.invoke(key, args);
  });
  ipcMain.handle('getCommandKeys', async () => {
    return bindings.getCommandKeys();
  });
  ipcMain.handle('getCommandLen', async () => {
    return bindings.getCommandLen();
  });
  ipcMain.handle('invokeAsync', async (_, key, args) => {
    return await bindings.invokeAsync(key, args);
  });
  ipcMain.handle('getCommandAsyncKeys', async () => {
    return bindings.getCommandAsyncKeys();
  });
  ipcMain.handle('getCommandAsyncLen', async () => {
    return bindings.getCommandAsyncLen();
  });
  ipcMain.handle('regJsFunction', async (_, key) => {
    return bindings.regJsFunction(key, (args) => jsFunctionCall(win.webContents, key, args));
  });
  ipcMain.handle('unregJsFunction', async (_, key) => {
    return bindings.unregJsFunction(key);
  });
  ipcMain.handle('clearJsFunction', async (_) => {
    return bindings.clearJsFunction();
  });
  ipcMain.handle('getCommandJsKeys', async () => {
    return bindings.getCommandJsKeys();
  });
  ipcMain.handle('getCommandJsLen', async () => {
    return bindings.getCommandJsLen();
  });

  bindings.clearJsFunction();
};