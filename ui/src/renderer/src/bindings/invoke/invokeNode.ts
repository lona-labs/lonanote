const isNode = window.api && window.api.invoke != null;

export const invoke = async (
  key: string,
  args?: string | null | undefined,
): Promise<string | null | undefined> => {
  if (!isNode) throw new Error('not in node env');
  return await window.api.invoke(key, args);
};

export const invokeAsync = async (
  key: string,
  args?: string | null | undefined,
): Promise<string | null | undefined> => {
  if (!isNode) throw new Error('not in node env');
  return await window.api.invokeAsync(key, args);
};

export const regJsFunction = async (
  key: string,
  callback: (args: string | null | undefined) => Promise<string | null | undefined>,
) => {
  if (!isNode) throw new Error('not in node env');
  return await window.api.regJsFunction(key, callback);
};

export const unregJsFunction = async (key: string) => {
  if (!isNode) throw new Error('not in node env');
  return await window.api.unregJsFunction(key);
};

export const clearJsFunction = async () => {
  if (!isNode) throw new Error('not in node env');
  return await window.api.clearJsFunction();
};

export { isNode };
