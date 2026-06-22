import { useState, useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useEditorStore } from '@/store/editorStore';
import FileExplorer from '@/components/Sidebar/FileExplorer';
import EditorGroup from '@/components/Editor/EditorGroup';
import TerminalPanel from '@/components/Terminal/TerminalPanel';
import WelcomeScreen from '@/components/Welcome/WelcomeScreen';
import { PanelBottom, PanelRight, X } from 'lucide-react';

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return mobile;
}

function makeResizeHandler(
  start: number,
  startSize: number,
  axis: 'x' | 'y',
  setSize: (v: number) => void,
  min: number,
  max: number,
) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const move = (ev: MouseEvent | TouchEvent) => {
    const client = axis === 'x'
      ? ('touches' in ev ? ev.touches[0].clientX : ev.clientX)
      : ('touches' in ev ? ev.touches[0].clientY : ev.clientY);
    setSize(clamp(startSize + (client - start)));
  };
  const up = () => {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
    document.removeEventListener('touchmove', move);
    document.removeEventListener('touchend', up);
  };
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
  document.addEventListener('touchmove', move, { passive: true });
  document.addEventListener('touchend', up);
}

export default function MainLayout() {
  const isMobile = useIsMobile();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const sidebarWidth = useUIStore((s) => s.sidebarWidth);
  const setSidebarWidth = useUIStore((s) => s.setSidebarWidth);
  const terminalOpen = useUIStore((s) => s.terminalOpen);
  const terminalHeight = useUIStore((s) => s.terminalHeight);
  const setTerminalHeight = useUIStore((s) => s.setTerminalHeight);
  const groups = useEditorStore((s) => s.groups);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 flex min-h-0 relative">
        {sidebarOpen && isMobile && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-30"
              onClick={toggleSidebar}
            />
            <div className="fixed left-0 top-0 bottom-0 z-40 panel-bg border-r panel-border overflow-hidden shadow-2xl"
              style={{ width: sidebarWidth, maxWidth: '80vw' }}
            >
              <FileExplorer />
            </div>
          </>
        )}

        {sidebarOpen && !isMobile && (
          <>
            <div
              className="panel-bg border-r panel-border overflow-hidden shrink-0"
              style={{ width: sidebarWidth }}
            >
              <FileExplorer />
            </div>
            <div
              className="w-1 cursor-col-resize hover:bg-[#007acc] shrink-0"
              onMouseDown={(e) => makeResizeHandler(e.clientX, sidebarWidth, 'x', setSidebarWidth, 150, 600)}
              onTouchStart={(e) => makeResizeHandler(e.touches[0].clientX, sidebarWidth, 'x', setSidebarWidth, 150, 600)}
            />
          </>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          {!sidebarOpen && isMobile && (
            <div className="absolute top-2 left-2 z-10">
              <button
                className="p-1.5 hover-bg rounded text-[#858585] hover:text-[#d4d4d4] bg-[#252526]"
                onClick={toggleSidebar}
                title="Open Sidebar"
              >
                <PanelRight size={16} />
              </button>
            </div>
          )}
          {groups.length <= 1 ? (
            groups[0]?.tabs.length === 0 ? (
              <WelcomeScreen />
            ) : (
              groups[0] && <EditorGroup groupId={groups[0].id} />
            )
          ) : (
            <div className={`flex-1 flex ${groups[0]?.splitDirection === 'vertical' ? 'flex-col' : 'flex-row'} min-w-0 overflow-hidden`}>
              {groups.flatMap((group, idx) => [
                idx > 0 ? (
                  <div key={`sep-${group.id}`} className="w-[3px] bg-[#3c3c3c] shrink-0 cursor-col-resize hover:bg-[#007acc]" />
                ) : null,
                <div key={group.id} className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  {group.tabs.length === 0 ? (
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex items-center justify-end h-9 pr-1 bg-[#252526] border-b border-[#3c3c3c]">
                        <button
                          className="p-1 hover-bg rounded text-[#858585] hover:text-[#d4d4d4]"
                          title="Close Group"
                          onClick={(e) => { e.stopPropagation(); useEditorStore.getState().closeGroup(group.id); }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex-1 flex items-center justify-center text-[#858585] text-sm">
                        No file open
                      </div>
                    </div>
                  ) : (
                    <EditorGroup groupId={group.id} />
                  )}
                </div>,
              ]).filter(Boolean)}
            </div>
          )}
        </div>
      </div>

      {terminalOpen && (
        <div className="shrink-0" style={{ height: terminalHeight }}>
          <div
            className="h-1 cursor-row-resize hover:bg-[#007acc]"
            onMouseDown={(e) => makeResizeHandler(e.clientY, terminalHeight, 'y', setTerminalHeight, 100, 500)}
            onTouchStart={(e) => makeResizeHandler(e.touches[0].clientY, terminalHeight, 'y', setTerminalHeight, 100, 500)}
          />
          <div className="h-full bg-[#1e1e1e] border-t border-[#3c3c3c]">
            <div className="flex items-center justify-between h-8 px-3 text-xs text-[#858585] bg-[#252526] border-b border-[#3c3c3c]">
              <span className="flex items-center gap-1.5">
                <PanelBottom size={12} /> TERMINAL
              </span>
              <button
                className="p-0.5 rounded hover:bg-[#3c3c3c] hover:text-[#e8e8e8]"
                onClick={() => useUIStore.getState().toggleTerminal()}
                title="Close Terminal"
              >
                <X size={13} />
              </button>
            </div>
            <div className="h-[calc(100%-32px)]">
              <TerminalPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
