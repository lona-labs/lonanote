import { invoke, invokeAsync } from '../invoke';

export const api = {
  helloCommand: async (data: string[]): Promise<string[]> => {
    return (await invoke('hello_command', data))!;
  },
  helloCommandAsync: async (data: string[]): Promise<string[]> => {
    return (await invokeAsync('hello_command_async', data))!;
  },
};
