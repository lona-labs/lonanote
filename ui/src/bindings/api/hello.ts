import { invoke } from '../invoke';

export const hello = {
  async helloCommandJson(args: string[]): Promise<string[]> {
    return (await invoke('hello_command_json', { args }))!;
  },
  async helloCommandRaw(data: Uint8Array): Promise<Uint8Array> {
    return (await invoke('hello_command_raw', data))!;
  },
  async helloCommandVoid() {
    (await invoke('hello_command_void'))!;
  },
  async helloCommandJsonAsync(args: string[]): Promise<string[]> {
    return (await invoke('hello_command_json_async', { args }))!;
  },
  async helloCommandRawAsync(data: Uint8Array): Promise<Uint8Array> {
    return (await invoke('hello_command_raw_async', data))!;
  },
  async helloCommandVoidAsync() {
    (await invoke('hello_command_void_async'))!;
  },
};
