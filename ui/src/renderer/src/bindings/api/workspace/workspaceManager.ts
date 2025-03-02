import { invokeAsync } from '@/bindings/core';

import { WorkspaceMetadata, WorkspaceSaveData } from './types';
import { workspace } from './workspace';

const replaceSearch = (search: URLSearchParams) => {
  const url = new URL(window.location.href);
  url.search = search.toString();
  history.replaceState('', '', url.href);
  // console.log(window.location.href);
};

const getSearch = () => {
  return new URLSearchParams(window.location.search);
};

let currentWorkspace: string | null = null;
export const getCurrentOpenWorkspace = (): string | null => {
  if (currentWorkspace == null) {
    const search = getSearch();
    const ws = search.get('ws');
    if (ws) {
      currentWorkspace = ws;
    }
  }
  return currentWorkspace;
};

export const setCurrentOpenWorkspace = async (path: string | null) => {
  const search = getSearch();
  if (path) {
    search.set('ws', path || '');
  } else {
    search.delete('ws');
  }
  replaceSearch(search);
  currentWorkspace = path;
};

export const formatPath = (path: string) => {
  return path.replace(/\\/g, '/');
};

export const workspaceManager = {
  setWorkspaceRootPath: async (path: string, newPath: string, isMove: boolean) => {
    return (await invokeAsync('set_workspace_root_path', { path, newPath, isMove }))!;
  },
  setWorkspaceName: async (path: string, newName: string, isMove: boolean) => {
    return (await invokeAsync('set_workspace_name', { path, newName, isMove }))!;
  },
  removeWorkspace: async (path: string) => {
    return (await invokeAsync('remove_workspace', { path }))!;
  },
  getWorkspacesMetadata: async (): Promise<WorkspaceMetadata[]> => {
    return (await invokeAsync('get_workspaces_metadata'))!;
  },
  openWorkspaceByPath: async (path: string): Promise<void> => {
    path = formatPath(path);
    const isOpen = await workspace.isOpenWorkspace(path);
    if (isOpen) {
      throw new Error(`workspace has been opened: ${path}`);
    }
    await invokeAsync('open_workspace_by_path', { path });
    await setCurrentOpenWorkspace(path);
    console.info('open workspace:', path);
  },
  unloadWorkspaceByPath: async (path: string): Promise<void> => {
    await invokeAsync('unload_workspace_by_path', { path });
    await setCurrentOpenWorkspace(null);
    console.info('unload workspace:', path);
  },
  getLastWorkspace: async (): Promise<string | null> => {
    return (await invokeAsync('get_last_workspace'))!;
  },
  checkWorkspacePathExist: async (workspacePath: string): Promise<boolean | null> => {
    return (await invokeAsync('check_workspace_path_exist', { workspacePath }))!;
  },
  checkWorkspacePathLegal: async (workspacePath: string): Promise<boolean | null> => {
    return (await invokeAsync('check_workspace_path_legal', { workspacePath }))!;
  },
  getWorkspaceSavedata: async (workspacePath: string): Promise<WorkspaceSaveData> => {
    return (await invokeAsync('get_workspace_savedata', { workspacePath }))!;
  },
  setWorkspaceSavedata: async (workspacePath: string, data: WorkspaceSaveData): Promise<void> => {
    return (await invokeAsync('set_workspace_savedata', { workspacePath, data }))!;
  },
};
