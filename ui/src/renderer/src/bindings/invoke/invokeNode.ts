export const invoke = async <T>(cmd: string, args?: any): Promise<T | undefined> => {
  return isNode && (await window.api.invoke(cmd, args));
};

export const invokeAsync = async <T>(cmd: string, args?: any): Promise<T | undefined> => {
  return isNode && (await window.api.invokeAsync(cmd, args));
};

export const isNode = window.api && window.api.invoke != null;
