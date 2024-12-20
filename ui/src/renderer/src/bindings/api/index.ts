import { invoke } from '../invoke';

export const api = {
  helloCommand: async (data: string[]): Promise<string[]> => {
    return (await invoke('hello_command', data))!;
  },
};
