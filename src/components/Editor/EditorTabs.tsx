import { useEditorStore } from '@/store/editorStore';
import { X } from 'lucide-react';

export default function EditorTabs({ groupId }: { groupId: string }) {
  const group = useEditorStore((s) => s.groups.find((g) => g.id === groupId));
  const setActiveTab = useEditorStore((s) => s.setActiveTab);
  const closeTab = useEditorStore((s) => s.closeTab);

  if (!group || group.tabs.length === 0) {
    return null;
  }

  return (
    <div className="flex bg-[#252526] border-b border-[#3c3c3c] overflow-x-auto shrink-0">
      {group.tabs.map((tab) => (
        <div
          key={tab.fileId}
          className={`group flex items-center gap-1.5 px-3 h-9 text-sm border-r border-[#3c3c3c] cursor-pointer shrink-0
            ${
              tab.fileId === group.activeTabId
                ? 'bg-editor-bg text-editor-fg border-t-2 border-t-[#007acc] mt-0'
                : 'bg-tab-bg text-[#969696] hover-bg'
            }`}
          onClick={() => setActiveTab(groupId, tab.fileId)}
        >
          <span className={`truncate max-w-32 ${tab.dirty ? 'italic' : ''}`}>
            {tab.fileName}
            {tab.dirty && <span className="ml-1 text-[#e2b714]">●</span>}
          </span>
          <button
            className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-[#4f4f4f]"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(groupId, tab.fileId);
            }}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
