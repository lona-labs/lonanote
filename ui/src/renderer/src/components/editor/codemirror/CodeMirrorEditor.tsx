import { autocompletion, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import {
  bracketMatching,
  defaultHighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { searchKeymap } from '@codemirror/search';
import { EditorState } from '@codemirror/state';
import {
  EditorView,
  KeyBinding,
  crosshairCursor,
  drawSelection,
  highlightActiveLine,
  highlightSpecialChars,
  keymap,
  rectangularSelection,
} from '@codemirror/view';
import {
  CSSProperties,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import './CodeMirrorEditor.scss';
import { detectLanguage } from './extensions';

export interface CodeMirrorEditorRef {
  getView: () => EditorView | null;
  updateView?: () => void;
}

export interface UpdateState {
  charCount: number;
  rowIndex: number;
  colIndex: number;
}

export interface CodeMirrorEditorProps {
  fileName: string;
  style?: CSSProperties;
  className?: string;
  getInitContent?: () => string;
  onSave?: (content: string) => void;
  onUpdateListener?: (state: UpdateState) => void;
}

export default forwardRef(
  (
    { className, style, fileName, getInitContent, onSave, onUpdateListener }: CodeMirrorEditorProps,
    ref: Ref<CodeMirrorEditorRef>,
  ) => {
    const editorRootRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState<EditorView | null>(null);
    const [update, setUpdate] = useState<boolean>(false);
    useEffect(() => {
      let view: EditorView | null = null;
      if (editorRootRef.current) {
        const saveBinding: KeyBinding = {
          key: 'Mod-s', // Mod 代表 Ctrl（Windows）或 Cmd（Mac）
          preventDefault: true,
          run: (view) => {
            if (onSave) {
              onSave(view.state.doc.toString());
            }
            return true;
          },
        };
        const updateListener = EditorView.updateListener.of((update) => {
          if (onUpdateListener) {
            const charCount = update.state.doc.length;
            const cursorPos = update.state.selection.main.head;
            const line = update.state.doc.lineAt(cursorPos);
            const rowIndex = line.number;
            const colIndex = cursorPos - line.from;
            onUpdateListener({ charCount, rowIndex, colIndex });
          }
        });
        const state = EditorState.create({
          doc: getInitContent ? getInitContent() : '',
          extensions: [
            detectLanguage(fileName),
            //自动换行
            EditorView.lineWrapping,
            updateListener,
            // 行号
            // lineNumbers(),
            // 用占位符替换不可打印字符
            highlightSpecialChars(),
            // 撤销历史
            history(),
            // 替换原始光标选区
            drawSelection(),
            // 替换拖拽时的放置光标
            // dropCursor(),
            // Allow multiple cursors/selections
            EditorState.allowMultipleSelections.of(true),
            // 输入特定输入时自动缩进
            indentOnInput(),
            // 高亮显示
            syntaxHighlighting(defaultHighlightStyle),
            // 高亮光标旁边的匹配括号
            bracketMatching(),
            // 自动补全右括号
            closeBrackets(),
            // 自动完成系统
            autocompletion(),
            // alt-drag 选择矩形区域
            rectangularSelection(),
            // 按住 alt 时, 光标更改为十字
            crosshairCursor(),
            // 高亮激活的行
            highlightActiveLine(),
            // Style the gutter for current line specially
            // highlightActiveLineGutter(),
            // 突出显示与所选文本匹配的文本
            // highlightSelectionMatches(),
            keymap.of([
              saveBinding,
              indentWithTab,
              // 关闭括号支持退格
              ...closeBracketsKeymap,
              // 大量基本键绑定
              ...defaultKeymap,
              // 搜索相关的键
              ...searchKeymap,
              // Redo/undo 快捷键
              ...historyKeymap,
            ]),
          ],
        });
        view = new EditorView({
          parent: editorRootRef.current,
          state,
        });
        setView(view);
      }
      return () => {
        if (view) {
          view.destroy();
        }
      };
    }, [editorRootRef, update]);

    useImperativeHandle(ref, () => ({
      getView() {
        return view;
      },
      updateView() {
        setUpdate(!update);
      },
    }));

    return <div ref={editorRootRef} style={style} className={className}></div>;
  },
);
