import { BrowserWindow } from 'electron';
import { testRustCall } from 'lonanote-core-node';

import { clearJsFunction, invoke, invokeAsync, regJsFunction, unregJsFunction } from './invoke';

export * from './invoke';

export const initInvokeIpc = (ipcMain: Electron.IpcMain, win: BrowserWindow) => {
  let returnSequence = 0;
  const jsFunctionCallChannel = 'jsFunctionCall';
  const jsFunctionCall = (
    webContent: Electron.WebContents,
    key: string,
    args: string | null | undefined,
  ): Promise<string | null | undefined> => {
    return new Promise((resolve) => {
      if (webContent) {
        if (returnSequence === Number.MAX_SAFE_INTEGER) {
          returnSequence = 0;
        }
        const returnChannel = `${jsFunctionCallChannel}:return:${returnSequence++}`;
        webContent.send(jsFunctionCallChannel, args, returnChannel);
        ipcMain.once(returnChannel, (_, result) => {
          resolve(result);
        });
      }
      if (ipcMain.emit('jsFunctionCall', key, args)) {
        return undefined;
      }
      return undefined;
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
};
