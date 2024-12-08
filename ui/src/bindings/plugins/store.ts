import { invokePlugin } from '../invoke';

export const storeTypes = [
  'STORE_COMMON',
  'STORE_SETTINGS',
  'STORE_LOCAL_COMMON',
  'STORE_LOCAL_SETTINGS',
] as const;

export type StoreType = (typeof storeTypes)[number];

const name = 'store';

export class Store {
  store: StoreType;
  constructor(store: StoreType) {
    this.store = store;
  }
  async callPlugin(command: string, args?: any): Promise<any> {
    return (await invokePlugin(name, command, {
      storeKey: this.store,
      ...args,
    }))!;
  }
  public async filePath(): Promise<string> {
    return await this.callPlugin('file_path');
  }
  public async fileName(): Promise<string> {
    return await this.callPlugin('file_name');
  }
  public async reload(): Promise<void> {
    return await this.callPlugin('reload');
  }
  public async save(): Promise<void> {
    return await this.callPlugin('save');
  }
  public async clear(): Promise<void> {
    return await this.callPlugin('clear');
  }
  public async delete(key: string): Promise<boolean> {
    return await this.callPlugin('delete', { key });
  }
  public async has(key: string): Promise<boolean> {
    return await this.callPlugin('has', { key });
  }
  public async get<T = any>(key: string): Promise<T | undefined> {
    return await this.callPlugin('get', { key });
  }
  public async set(key: string, val: any): Promise<void> {
    return await this.callPlugin('set', { key, val });
  }
  public async keys(): Promise<string[]> {
    return await this.callPlugin('keys');
  }
  public async values<T = any>(): Promise<T[]> {
    return await this.callPlugin('values');
  }
  public async len(): Promise<number> {
    return await this.callPlugin('len');
  }
  public async isEmpty(): Promise<boolean> {
    return await this.callPlugin('is_empty');
  }
  public async all<T = Record<string, any>>(): Promise<T> {
    return await this.callPlugin('all');
  }
}

export const store = {
  common: new Store('STORE_COMMON'),
  settings: new Store('STORE_SETTINGS'),
  localCommon: new Store('STORE_LOCAL_COMMON'),
  localSettings: new Store('STORE_LOCAL_SETTINGS'),
};
