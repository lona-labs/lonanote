import { BrowserWindow } from 'electron';
import { testRustCall } from 'lonanote-core-node';

import { clearJsFunction, invoke, invokeAsync, regJsFunction, unregJsFunction } from './invoke';

export * from './invoke';

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
        if (returnSequence === Number.MAX_SAFE_INTEGER) {
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
  ipcMain.removeHandler('invokeAsync');
  ipcMain.removeHandler('regJsFunction');
  ipcMain.removeHandler('unregJsFunction');
  ipcMain.removeHandler('clearJsFunction');

  ipcMain.handle('invoke', async (_, key, args) => {
    return invoke(key, args);
  });
  ipcMain.handle('invokeAsync', async (_, key, args) => {
    return await invokeAsync(key, args);
  });
  ipcMain.handle('regJsFunction', async (_, key) => {
    return regJsFunction(key, (args) => jsFunctionCall(win.webContents, key, args));
  });
  ipcMain.handle('unregJsFunction', async (_, key) => {
    return unregJsFunction(key);
  });
  ipcMain.handle('clearJsFunction', async (_) => {
    return clearJsFunction();
  });

  clearJsFunction();

  setTimeout(() => testRustCall(), 2000);
};
