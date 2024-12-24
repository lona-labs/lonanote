import { invoke as _invoke, isTauri as _isTauri } from '@tauri-apps/api/core';

const invokeFunName = 'invoke';
const invokeAsyncFunName = 'invoke_async';

export const isTauri = _isTauri();

export const invoke = async (
  key: string,
  args?: string | null | undefined,
): Promise<string | null | undefined> => {
  if (!isTauri) throw new Error('not in tauri env');
  return await _invoke(invokeFunName, { key, args });
};

export const invokeAsync = async (
  key: string,
  args?: string | null | undefined,
): Promise<string | null | undefined> => {
  if (!isTauri) throw new Error('not in tauri env');
  return await _invoke(invokeAsyncFunName, { key, args });
};
