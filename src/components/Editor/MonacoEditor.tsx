import { useRef, useCallback, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useEditorStore } from '@/store/editorStore';
import { useFileStore } from '@/store/fileStore';
import { getLanguageFromPath } from '@/utils/fileSystem';
import { registerEditor, unregisterEditor } from '@/utils/editorRefMap';
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
  groupId: string;
}

export default function MonacoEditor({ groupId }: MonacoEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const group = useEditorStore((s) => s.groups.find((g) => g.id === groupId));
  const activeTab = group?.tabs.find((t) => t.fileId === group.activeTabId);
  const updateFileContent = useFileStore((s) => s.updateFileContent);
  const updateTabCursor = useEditorStore((s) => s.updateTabCursor);
  const markTabDirty = useEditorStore((s) => s.markTabDirty);

  const handleEditorDidMount: OnMount = useCallback(
    (editor) => {
      editorRef.current = editor;
      registerEditor(groupId, editor);
      editor.onDidChangeCursorPosition((e) => {
        if (activeTab) {
          {
          }
          updateTabCursor(groupId, activeTab.fileId, e.position.lineNumber, e.position.column);
        }
      });
    },
    [groupId, activeTab, updateTabCursor],
  );

  useEffect(() => {
    return () => {
      unregisterEditor(groupId);
    };
  }, [groupId]);

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (activeTab && value !== undefined) {
        {
        }
        updateFileContent(activeTab.fileId, value);
        if (!activeTab.dirty) {
          {
          }
          markTabDirty(groupId, activeTab.fileId, true);
        }
      }
    },
    [activeTab, updateFileContent, markTabDirty, groupId],
  );

  useEffect(() => {
    if (editorRef.current) {
      {
      }
      editorRef.current.focus();
    }
  }, [activeTab?.fileId]);

  const fileContent = useFileStore((s) =>
    activeTab ? (s.getNode(activeTab.fileId)?.content ?? '') : '',
  );
  const language = activeTab ? getLanguageFromPath(activeTab.filePath) : 'plaintext';

  if (!activeTab) {
    return null;
  }

  return (
    <div className="flex-1 min-h-0">
      <Editor
        key={activeTab.fileId}
        theme="vs-dark"
        language={language}
        value={fileContent}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace",
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          tabSize: 2,
          automaticLayout: true,
          wordWrap: 'off',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          bracketPairColorization: { enabled: true },
          formatOnPaste: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          folding: true,
          foldingHighlight: true,
          links: true,
          codeLens: true,
          colorDecorators: true,
          selectionHighlight: true,
          occurrencesHighlight: 'singleFile',
          renderLineHighlight: 'all',
          hideCursorInOverviewRuler: false,
          overviewRulerBorder: false,
          padding: { top: 8 },
        }}
      />
    </div>
  );
}
