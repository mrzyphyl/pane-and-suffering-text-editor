import { useEditorStore } from '@/store/editorStore';
import { useUIStore } from '@/store/uiStore';
import { getLanguageFromPath } from '@/utils/fileSystem';
import { PanelBottom, PanelRight, PanelRightClose, GitBranch, Signal } from 'lucide-react';

export default function StatusBar() {
  const activeTab = useEditorStore((s) => {
    const group = s.groups.find((g) => g.id === s.activeGroupId);
    if (!group || !group.activeTabId) {
      return null;
    }
    return group.tabs.find((t) => t.fileId === group.activeTabId) || null;
  });
  const toggleTerminal = useUIStore((s) => s.toggleTerminal);
  const terminalOpen = useUIStore((s) => s.terminalOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  const language = activeTab ? getLanguageFromPath(activeTab.filePath) : 'Plain Text';
  const cursor = activeTab?.cursorPosition || { line: 1, column: 1 };

  return (
    <div className="h-6 bg-[#007acc] text-white text-xs flex items-center px-3 gap-3 shrink-0">
      <button
        onClick={toggleSidebar}
        className="flex items-center gap-1 hover:bg-[#1a8ad4] px-1.5 py-0.5 rounded"
      >
        {sidebarOpen ? <PanelRightClose size={12} /> : <PanelRight size={12} />}
      </button>

      <div className="flex-1" />

      <span className="hover:bg-[#1a8ad4] px-1.5 py-0.5 rounded cursor-default">
        <GitBranch size={12} className="inline mr-1" />
        main
      </span>

      <span className="hover:bg-[#1a8ad4] px-1.5 py-0.5 rounded cursor-default">
        <Signal size={12} className="inline mr-1" />
        {cursor.line}:{cursor.column}
      </span>

      <span className="hover:bg-[#1a8ad4] px-1.5 py-0.5 rounded cursor-default">Spaces: 2</span>

      <span className="hover:bg-[#1a8ad4] px-1.5 py-0.5 rounded cursor-default">UTF-8</span>

      <span className="hover:bg-[#1a8ad4] px-1.5 py-0.5 rounded cursor-default">LF</span>

      <span className="hover:bg-[#1a8ad4] px-1.5 py-0.5 rounded cursor-default">{language}</span>

      <button
        onClick={toggleTerminal}
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${terminalOpen ? 'bg-[#1a8ad4]' : 'hover:bg-[#1a8ad4]'}`}
      >
        <PanelBottom size={12} />
      </button>
    </div>
  );
}
