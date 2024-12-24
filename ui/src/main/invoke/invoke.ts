import {
  clearJsFunction as _clearJsFunction,
  init as _init,
  invoke as _invoke,
  invokeAsync as _invokeAsync,
  regJsFunction as _regJsFunction,
  unregJsFunction as _unregJsFunction,
} from 'lonanote-core-node';

export const invoke = (
  key: string,
  args?: string | null | undefined,
): string | null | undefined => {
  const res = _invoke(key, args);
  return res;
};

export const invokeAsync = async (
  key: string,
  args?: string | null | undefined,
): Promise<string | null | undefined> => {
  const res = await _invokeAsync(key, args);
  return res;
};

export const regJsFunction = (
  key: string,
  callback: (args: string | null | undefined) => Promise<string | null | undefined>,
): void => {
  _regJsFunction(key, callback);
};

export const unregJsFunction = (key: string): void => {
  _unregJsFunction(key);
};

export const clearJsFunction = (): void => {
  _clearJsFunction();
};

export const init = () => {
  const error = _init();
  if (error != null) {
    throw new Error(error);
  }
};
