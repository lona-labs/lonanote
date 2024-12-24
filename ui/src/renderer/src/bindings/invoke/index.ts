import * as node from './invokeNode';
import * as tauri from './invokeTauri';

const { isNode } = node;
const { isTauri } = tauri;

const getJson = (args?: any) => {
  const t = typeof args;
  if (t === 'function' || t === 'undefined') {
    return undefined;
  }
  if (t === null) {
    return t;
  }
  return JSON.stringify(args);
};

const getObject = <T>(res: string | null | undefined): T | undefined => {
  if (typeof res !== 'string') {
    return undefined;
  }
  return JSON.parse(res);
};

export const invoke = async <T>(key: string, args?: any): Promise<T | undefined> => {
  let res: string | null | undefined;
  if (isNode) {
    res = await node.invoke(key, getJson(args));
  } else if (isTauri) {
    res = await tauri.invoke(key, getJson(args));
  } else {
    throw new Error('invoke error: unknow env');
  }
  return getObject(res);
};

export const invokeAsync = async <T>(key: string, args?: any): Promise<T | undefined> => {
  let res: string | null | undefined;
  if (isNode) {
    res = await node.invokeAsync(key, getJson(args));
  } else if (isTauri) {
    res = await tauri.invokeAsync(key, getJson(args));
  } else {
    throw new Error('invoke error: unknow env');
  }
  return getObject(res);
};

export const regJsFunction = async <T, TRet>(
  key: string,
  callback: (args: T | undefined) => Promise<TRet | undefined>,
) => {
  if (isNode) {
    return await node.regJsFunction(key, async (args) => {
      const data = getObject(args);
      const r = await callback(data as T);
      return getJson(r);
    });
  } else {
    throw new Error('regJsFunction error: unknow env');
  }
};

export const unregJsFunction = async (key: string) => {
  if (isNode) {
    return await node.unregJsFunction(key);
  } else {
    throw new Error('unregJsFunctionNode error: unknow env');
  }
};

export const clearJsFunction = async () => {
  if (isNode) {
    return await node.clearJsFunction();
  } else {
    throw new Error('clearJsFunctionNode error: unknow env');
  }
};

regJsFunction<string, string>('test_func', async (args) => {
  console.log('这是args: ' + args);
  return '这是返回值';
});

export { isNode, isTauri };
