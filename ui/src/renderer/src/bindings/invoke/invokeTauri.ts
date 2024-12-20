import { invoke as _invoke, isTauri as _isTauri } from '@tauri-apps/api/core';

const invokeFunName = 'invoke';
const invokeAsyncFunName = 'invoke_async';

export const invoke = async <T>(
  cmd: string,
  args?: any,
  async?: boolean,
): Promise<T | undefined> => {
  const data = { key: cmd, args };
  const invokeKey = async ? invokeAsyncFunName : invokeFunName;
  return await _invoke(invokeKey, data);
};

export const invokeAsync = async <T>(cmd: string, args?: any): Promise<T | undefined> => {
  return await invoke<T>(cmd, args, true);
};

export const isTauri = _isTauri();
