import {
  clearJsFunction as _clearJsFunction,
  init as _init,
  invoke as _invoke,
  invokeAsync as _invokeAsync,
  regJsFunction as _regJsFunction,
  unregJsFunction as _unregJsFunction,
} from 'lonanote-core-node';

const getResult = (res: string | null) => {
  if (res == null) {
    return undefined;
  }
  return JSON.parse(res);
};

export const invoke = <T>(key: string, args?: any): T | undefined => {
  const res = _invoke(key, JSON.stringify(args));
  return getResult(res);
};

export const invokeAsync = async <T>(key: string, args?: any): Promise<T | undefined> => {
  const res = await _invokeAsync(key, JSON.stringify(args));
  return getResult(res);
};

export const regJsFunction = (
  key: string,
  callback: (args: string | null | undefined) => string | null | undefined,
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
