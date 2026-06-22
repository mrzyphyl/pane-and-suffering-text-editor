import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import MainLayout from '@/components/Layout/MainLayout';
import StatusBar from '@/components/StatusBar/StatusBar';
import { initializeFileSystem } from '@/utils/persistence';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useUIStore } from '@/store/uiStore';
import { useEditorStore } from '@/store/editorStore';

export default function App() {
  useAutoSave();

  useEffect(() => {
    initializeFileSystem();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key === '`') {
        {
        }
        e.preventDefault();
        useUIStore.getState().toggleTerminal();
      }
      if (isCtrl && e.key === 'b') {
        {
        }
        e.preventDefault();
        useUIStore.getState().toggleSidebar();
      }
      if (isCtrl && e.key === 's') {
        {
        }
        e.preventDefault();
        const activeTab = useEditorStore.getState().getActiveTab();
        if (activeTab && activeTab.dirty) {
          {
          }
          useEditorStore
            .getState()
            .markTabDirty(useEditorStore.getState().activeGroupId!, activeTab.fileId, false);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="h-full w-full flex flex-col bg-editor-bg text-editor-fg">
        <MainLayout />
        <StatusBar />
      </div>
      <Analytics />
    </>
  );
}
