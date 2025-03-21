import { Text } from '@radix-ui/themes';
import path from 'path-browserify-esm';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { Workspace, fs } from '@/bindings/api';
import { setCurrentEditorState } from '@/controller/editor';
import { useEffect } from '@/hooks';

import './Editor.scss';
import { CodeMirrorEditor, CodeMirrorEditorRef, isSupportLanguage } from './codemirror';
import { ImageView, isSupportImageView } from './image';
import { VideoView, isSupportVideoView } from './video';

export interface EditorProps {
  file: string;
  currentWorkspace: Workspace;
}

const NotSupportEditorContent = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <Text as="div" size="4">
        不支持的文件类型
      </Text>
    </div>
  );
};

export default function Editor({ file, currentWorkspace }: EditorProps) {
  const editorRef = useRef<CodeMirrorEditorRef>(null);
  const [loadContentFinish, setLoadContentFinish] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const updateContent = async () => {
    const updateView = editorRef.current?.updateView;
    setContent(null);
    setLoadContentFinish(false);
    if (isSupportEditor) {
      const filePath = path.join(currentWorkspace.metadata.path, file);
      try {
        const content = await fs.readToString(filePath);
        setContent(content);
        setLoadContentFinish(true);
        updateView?.();
        // console.log('load content: ', content);
      } catch (e: any) {
        console.error('读取文件失败', filePath, e);
        toast.error(`读取文件失败: ${filePath}, ${e.message}`);
      }
    }
  };
  useEffect(() => updateContent(), [file, currentWorkspace]);
  const fileName = useMemo(() => path.basename(file), [file]);
  const fullPath = useMemo(
    () => path.join(currentWorkspace.metadata.path, file),
    [file, currentWorkspace],
  );
  const isSupportEditor = useMemo(() => {
    const supportEditor = isSupportLanguage(path.basename(file));
    if (!supportEditor) {
      setCurrentEditorState(null);
    }
    return supportEditor;
  }, [file]);
  const isSupportImage = useMemo(() => isSupportImageView(path.basename(file)), [file]);
  const isSupportVideo = useMemo(() => isSupportVideoView(path.basename(file)), [file]);

  const saveFile = async (content: string) => {
    if (!loadContentFinish) return;
    try {
      fs.write(fullPath, content);
      toast.success('保存文件成功');
    } catch (e: any) {
      console.error('保存文件失败', e);
      toast.error(`保存文件失败: ${e.message}`);
    }
  };

  return (
    <div className="editorRoot">
      {isSupportEditor ? (
        content != null && (
          <CodeMirrorEditor
            ref={editorRef}
            fileName={fileName}
            className="editor"
            getInitContent={() => content}
            onSave={saveFile}
            onUpdateListener={(s) => setCurrentEditorState(s)}
          />
        )
      ) : isSupportImage ? (
        <ImageView imgPath={fullPath} />
      ) : isSupportVideo ? (
        <VideoView videoPath={fullPath} />
      ) : (
        <NotSupportEditorContent />
      )}
    </div>
  );
}
