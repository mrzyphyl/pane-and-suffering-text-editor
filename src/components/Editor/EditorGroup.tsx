import { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useFileStore } from '@/store/fileStore';
import EditorTabs from './EditorTabs';
import MonacoEditor from './MonacoEditor';
import PreviewPanel from '@/components/Preview/PreviewPanel';
import { undo, redo } from '@/utils/editorRefMap';
import { SplitSquareHorizontal, SplitSquareVertical, Eye, Redo2, Undo2, X } from 'lucide-react';

const PREVIEW_EXTENSIONS = ['md', 'html', 'png', 'jpg', 'jpeg', 'gif', 'svg'];

export default function EditorGroup({ groupId }: { groupId: string }) {
  const [showPreview, setShowPreview] = useState(false);
  const group = useEditorStore((s) => s.groups.find((g) => g.id === groupId));
  const splitGroup = useEditorStore((s) => s.splitGroup);
  const closeGroup = useEditorStore((s) => s.closeGroup);
  const groups = useEditorStore((s) => s.groups);
  const setActiveGroup = useEditorStore((s) => s.setActiveGroup);
  const activeGroupId = useEditorStore((s) => s.activeGroupId);

  if (!group) {
    return null;
  }

  const activeTab = group.tabs.find((t) => t.fileId === group.activeTabId);
  const ext = activeTab ? activeTab.filePath.split('.').pop()?.toLowerCase() : '';
  const canPreview = ext ? PREVIEW_EXTENSIONS.includes(ext) : false;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fileId = e.dataTransfer.getData('text/plain');
    const fileNode = useFileStore.getState().getNode(fileId);
    if (fileNode?.type === 'file') {
      {
      }
      useEditorStore.getState().openFile(fileNode.id, fileNode.path, fileNode.name);
    }
  };

  return (
    <div
      className={`flex flex-col flex-1 min-w-0 ${group.id === activeGroupId ? 'ring-1 ring-inset ring-[#007acc]/20' : ''}`}
      onClick={() => setActiveGroup(group.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between bg-[#252526]">
        <div className="flex-1 min-w-0">
          <EditorTabs groupId={groupId} />
        </div>
        <div className="flex items-center gap-0.5 pr-1 bg-[#252526] border-b border-[#3c3c3c] h-9 overflow-x-auto overflow-y-hidden md:overflow-visible">
          <button
            className="p-1 hover-bg rounded text-[#858585] hover:text-[#d4d4d4] hidden md:inline-flex"
            title="Split Right"
            onClick={(e) => { e.stopPropagation(); splitGroup(groupId, 'horizontal'); }}
          >
            <SplitSquareHorizontal size={14} />
          </button>
          <button
            className="p-1 hover-bg rounded text-[#858585] hover:text-[#d4d4d4] hidden md:inline-flex"
            title="Split Down"
            onClick={(e) => { e.stopPropagation(); splitGroup(groupId, 'vertical'); }}
          >
            <SplitSquareVertical size={14} />
          </button>
          <div className="w-px h-4 bg-[#3c3c3c] mx-0.5 hidden md:block" />
          <button
            className="p-1 hover-bg rounded text-[#858585] hover:text-[#d4d4d4]"
            title="Undo (Ctrl+Z)"
            onClick={(e) => { e.stopPropagation(); undo(groupId); }}
          >
            <Undo2 size={14} />
          </button>
          <button
            className="p-1 hover-bg rounded text-[#858585] hover:text-[#d4d4d4]"
            title="Redo (Ctrl+Shift+Z)"
            onClick={(e) => { e.stopPropagation(); redo(groupId); }}
          >
            <Redo2 size={14} />
          </button>
          <div className="w-px h-4 bg-[#3c3c3c] mx-0.5" />
          {canPreview && (
            <button
              className={`p-1 hover-bg rounded ${showPreview ? 'text-[#007acc]' : 'text-[#858585] hover:text-[#d4d4d4]'}`}
              title={showPreview ? 'Show Editor' : 'Show Preview'}
              onClick={(e) => { e.stopPropagation(); setShowPreview(!showPreview); }}
            >
              <Eye size={14} />
            </button>
          )}
          {groups.length > 1 && (
            <button
              className="p-1 hover-bg rounded text-[#858585] hover:text-[#d4d4d4]"
              title="Close Group"
              onClick={(e) => { e.stopPropagation(); closeGroup(groupId); }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      {showPreview ? <PreviewPanel groupId={groupId} /> : <MonacoEditor groupId={groupId} />}
    </div>
  );
}
