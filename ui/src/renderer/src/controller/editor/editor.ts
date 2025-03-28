import { FileNode } from '@/bindings/api';
import { EditorMode, EditorState, defaultEditorMode, useEditorStore } from '@/models/editor';

export const useEditor = useEditorStore;

export const setCurrentEditFileNode = async (
  currentEditFileNode: FileNode | null,
  clearHistory?: boolean,
) => {
  if (window.navigate) {
    const to = `/${currentEditFileNode ? encodeURIComponent(currentEditFileNode.path) : ''}`;
    window.navigate(to);
    if (clearHistory) {
      history.replaceState({}, document.title, window.location.pathname);
    }
  }
};

export const setCurrentEditorState = async (currentEditorStatus: EditorState | null) => {
  useEditorStore.setState((state) => ({ ...state, currentEditorStatus }));
};

export const setEditorMode = async (editorMode: EditorMode) => {
  useEditorStore.setState((state) => ({ ...state, editorMode }));
};

export { defaultEditorMode };
