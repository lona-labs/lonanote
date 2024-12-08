import {
  CopyFileOptions,
  DebouncedWatchOptions,
  ExistsOptions,
  MkdirOptions,
  ReadDirOptions,
  ReadFileOptions,
  RemoveOptions,
  RenameOptions,
  StatOptions,
  WatchEvent,
  WriteFileOptions,
  copyFile,
  exists,
  lstat,
  mkdir,
  readDir,
  readFile,
  readTextFile,
  remove,
  rename,
  stat,
  watch,
  watchImmediate,
  writeFile,
  writeTextFile,
} from '@tauri-apps/plugin-fs';
import { platform } from '@tauri-apps/plugin-os';

const processPath = (path: string | URL) => {
  if (typeof path === 'string') {
    const isWin = platform() === 'windows';
    return isWin ? path.replace(/\//g, '\\') : path.replace(/\\/g, '/');
  }
  return path;
};

const processPaths = (paths: string | string[] | URL | URL[]) => {
  if (Array.isArray(paths)) {
    const newPaths: string[] | URL[] = [...paths] as any;
    for (let i = 0; i < newPaths.length; i++) {
      const path = newPaths[i];
      if (typeof path === 'string') {
        newPaths[i] = processPath(path);
      }
    }
    return newPaths;
  }
  if (typeof paths === 'string') {
    return processPath(paths);
  }
  return paths;
};

export const fs = {
  readBytesFile: async (path: string | URL, options?: ReadFileOptions) => {
    return await readFile(processPath(path), options);
  },
  readFile: async (path: string | URL, options?: ReadFileOptions) => {
    return await readTextFile(processPath(path), options);
  },
  readDir: async (path: string | URL, options?: ReadDirOptions) => {
    return await readDir(processPath(path), options);
  },
  writeBytesFile: async (path: string | URL, data: Uint8Array, options?: WriteFileOptions) => {
    await writeFile(processPath(path), data, options);
  },
  writeFile: async (path: string | URL, data: string, options?: WriteFileOptions) => {
    await writeTextFile(processPath(path), data, options);
  },
  rename: async (oldPath: string | URL, newPath: string | URL, options?: RenameOptions) => {
    await rename(processPath(oldPath), processPath(newPath), options);
  },

  exists: async (path: string | URL, options?: ExistsOptions) => {
    return await exists(processPath(path), options);
  },
  rm: async (path: string | URL, options?: RemoveOptions) => {
    await remove(processPath(path), options);
  },
  mkdir: async (path: string | URL, options?: MkdirOptions) => {
    return await mkdir(processPath(path), options);
  },
  copyFile: async (fromPath: string | URL, toPath: string | URL, options?: CopyFileOptions) => {
    await copyFile(processPath(fromPath), processPath(toPath), options);
  },
  stat: async (path: string | URL, options?: StatOptions) => {
    return await stat(processPath(path), options);
  },
  lstat: async (path: string | URL, options?: StatOptions) => {
    return await lstat(processPath(path), options);
  },
  watch: async (
    paths: string | string[] | URL | URL[],
    cb: (event: WatchEvent) => void,
    options?: DebouncedWatchOptions,
  ) => {
    return await watch(processPaths(paths), cb, options);
  },
  watchImmediate: async (
    paths: string | string[] | URL | URL[],
    cb: (event: WatchEvent) => void,
    options?: DebouncedWatchOptions,
  ) => {
    return await watchImmediate(processPaths(paths), cb, options);
  },
};
