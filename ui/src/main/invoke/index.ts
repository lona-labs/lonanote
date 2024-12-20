import { invoke, invokeAsync } from './invoke';

export * from './invoke';

export const initInvokeIpc = (ipcMain: Electron.IpcMain) => {
  ipcMain.handle('invoke', async (e, cmd, args) => {
    return invoke(cmd, args);
  });
  ipcMain.handle('invokeAsync', async (e, cmd, args) => {
    return await invokeAsync(cmd, args);
  });
};
