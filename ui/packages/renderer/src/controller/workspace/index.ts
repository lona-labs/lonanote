import path from 'path-browserify-esm';

import { path as bindingPath } from '@/bindings/api';
import {
  getCurrentOpenWorkspace,
  setCurrentOpenWorkspace,
  workspace,
  workspaceManager,
} from '@/bindings/api/workspace';
import { dialog } from '@/components';
import { useSettingsStore } from '@/models/settings';

import { updateWorkspaces } from './workspace';
import * as workspaceController from './workspace';
import * as workspaceManagerController from './workspaceManager';

export { workspaceController, workspaceManagerController };

export const getInitWorkspace = async () => {
  const ws = getCurrentOpenWorkspace();
  if (ws) {
    const isOpen = await workspace.isOpenWorkspace(ws);
    if (!isOpen) {
      await workspaceManagerController.openWorkspace(ws);
      setCurrentOpenWorkspace(ws);
    }
  } else {
    const settings = useSettingsStore.getState().settings;
    if (settings?.autoOpenLastWorkspace) {
      const lastWorkspace = await workspaceManager.getLastWorkspace();
      if (lastWorkspace) {
        // 没有打开此workspace时, 才能打开该workspace
        if (!(await workspace.isOpenWorkspace(lastWorkspace))) {
          if (await workspaceManagerController.openWorkspace(lastWorkspace)) {
            setCurrentOpenWorkspace(lastWorkspace);
          }
        } else {
          console.warn(`already opened workspace: ${lastWorkspace}`);
        }
      }
    }
  }
};

export const initWorkspace = async () => {
  try {
    const documentDir = await bindingPath.getDocumentDir();
    if (documentDir) {
      const firstWsPath = path.join(documentDir, 'lonanote/Default');
      await workspaceManager.initSetup(firstWsPath);
    }
    await getInitWorkspace();
  } catch (e) {
    console.error(e);
    dialog.showDialog({
      title: '错误',
      content: `初始化workspace失败: ${e}`,
    });
  }
  updateWorkspaces();
};

const onBeforeunload = () => {
  const ws = getCurrentOpenWorkspace();
  if (ws) workspaceManager.unloadWorkspaceByPath(ws);
};

window.removeEventListener('beforeunload', onBeforeunload);
window.addEventListener('beforeunload', onBeforeunload);
