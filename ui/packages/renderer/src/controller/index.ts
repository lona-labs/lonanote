import { initEditor } from './editor';
import { initSettings } from './settings';
import { initWorkspace } from './workspace';

export const initController = async () => {
  initEditor();
  await initSettings();
  await initWorkspace();
};
