import { invokePlugin } from '../invoke';

const name = 'utils';

export const utils = {
  async showInFolder(path: string): Promise<string> {
    return (await invokePlugin(name, 'show_in_folder', { path }))!;
  },
};
