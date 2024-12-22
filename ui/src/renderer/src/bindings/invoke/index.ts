import { invokeAsync as invokeAsyncNode, invoke as invokeNode, isNode } from './invokeNode';
import { invokeAsync as invokeAsyncTauri, invoke as invokeTauri, isTauri } from './invokeTauri';

export const invoke = async <T>(cmd: string, args?: any): Promise<T | undefined> => {
  if (isTauri) {
    return await invokeTauri(cmd, args);
  } else if (isNode) {
    return await invokeNode(cmd, args);
  } else {
    throw new Error('invoke error: unknow env');
  }
};

export const invokeAsync = async <T>(cmd: string, args?: any): Promise<T | undefined> => {
  if (isTauri) {
    return await invokeAsyncTauri(cmd, args);
  } else if (isNode) {
    return await invokeAsyncNode(cmd, args);
  } else {
    throw new Error('invoke error: unknow env');
  }
};
