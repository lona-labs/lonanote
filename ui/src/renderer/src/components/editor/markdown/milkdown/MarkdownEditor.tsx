import { editorViewCtx } from '@milkdown/core';
import { Ctx } from '@milkdown/kit/ctx';
import path from 'path-browserify-esm';
import {
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { useEditor } from '@/controller/editor';
import { utils } from '@/utils';

import { useCodeMirrorTheme } from '../../codemirror';
import { MarkdownEditorProps, MarkdownEditorRef } from '../types';
import { MilkdownEditor, MilkdownFeature, useMilkdownEditor } from './editor';

export interface UpdateState {
  charCount: number;
  rowIndex?: number;
  colIndex?: number;
}

export default forwardRef((props: MarkdownEditorProps, ref: Ref<MarkdownEditorRef>) => {
  const { className, style, filePath, readOnly, onSave, onUpdateListener, mediaRootPath } = props;
  const theme = useCodeMirrorTheme();
  const editorRef = useRef<HTMLDivElement>(null);
  const content = useEditor((s) => s.currentEditorContent);

  const [updateContentState, setUpdateContentState] = useState<boolean>(false);
  const updateContent = useCallback(
    () => setUpdateContentState(!updateContentState),
    [updateContentState],
  );

  const { getEditor, loading } = useMilkdownEditor(() => {
    if (!editorRef.current) return null;
    const editor = new MilkdownEditor({
      root: editorRef.current,
      defaultReadOnly: readOnly,
      defaultValue: '',
      featureConfigs: {
        [MilkdownFeature.Image]: {
          proxyDomURL(url) {
            if (!url) return url;
            console.log(url);
            if (utils.isImgUrl(url)) {
              return url;
            }
            const f = path.resolve(mediaRootPath, url);
            return utils.getMediaPath(f);
          },
        },
        [MilkdownFeature.CodeMirror]: {
          theme,
        },
        [MilkdownFeature.Yaml]: {
          theme,
        },
      },
    });
    const updateState = (ctx: Ctx) => {
      if (!editor) return;
      const view = ctx.get(editorViewCtx);
      onUpdateListener?.({ charCount: view.state.doc.content.size });
    };
    editor.addListener('onSave', () => {
      if (!editor) return true;
      const mdText = editor.getMarkdown();
      // console.log(mdText);
      onSave?.(mdText);
      return true;
    });
    editor.addListener('onDestroy', () => {
      onUpdateListener?.(null);
    });
    editor.addListener('onCreated', () => {
      updateContent();
    });
    editor.addListener('onUpdate', (ctx) => {
      updateState(ctx);
    });
    editor.addListener('onMounted', (ctx) => {
      updateState(ctx);
    });
    console.log('milkdown create');
    return editor;
  }, [filePath, onSave, onUpdateListener, theme]);

  useEffect(() => {
    const editor = getEditor();
    if (!editor) return;
    editor.setReadonly(readOnly || false);
  }, [readOnly]);

  useEffect(() => {
    const editor = getEditor();
    if (editor) {
      editor.setMarkdown(content?.content || '', false);
    }
  }, [content, updateContent]);

  useImperativeHandle(ref, () => ({
    getValue() {
      return getEditor()?.getMarkdown();
    },
    setValue(content) {
      const editor = getEditor();
      if (editor) {
        editor.setMarkdown(content || '', false);
      }
    },
  }));

  return (
    <div
      style={{
        display: loading ? 'none' : undefined,
        ...style,
      }}
      className={className}
      ref={editorRef}
    />
  );
});
