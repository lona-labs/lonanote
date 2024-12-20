import { init as _init, invoke as _invoke, invokeAsync as _invokeAsync } from 'lonanote-core-node';

const getResult = (res: string | null) => {
  if (res == null) {
    return undefined;
  }
  const resObj = JSON.parse(res);
  if (resObj.error) {
    throw new Error(resObj.error);
  }
  return resObj.data;
};

export const invoke = <T>(cmd: string, args?: any): T | undefined => {
  const res = _invoke(cmd, JSON.stringify(args));
  return getResult(res);
};

export const invokeAsync = async <T>(cmd: string, args?: any): Promise<T | undefined> => {
  const res = await _invokeAsync(cmd, JSON.stringify(args));
  return getResult(res);
};

export const init = () => {
  const error = _init();
  if (error != null) {
    throw new Error(error);
  }
};
