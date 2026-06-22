import { useEditorStore } from '@/store/editorStore';
import {
  FileCode,
  SplitSquareHorizontal,
  Terminal,
  Download,
  Save,
  PanelBottom,
  PanelRightClose,
  Sparkles,
} from 'lucide-react';

export default function WelcomeScreen() {
  const groups = useEditorStore((s) => s.groups);
  const hasTabs = groups.some((g) => g.tabs.length > 0);

  if (hasTabs) {
    return null;
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-editor-bg">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-[#569cd6] mb-2">Pane & Suffering</h1>
        <p className="text-[#858585] mb-8">Your browser-based code editor</p>

        <div className="grid grid-cols-2 gap-3 text-sm text-left">
          <div className="bg-[#252526] p-3 rounded border border-[#3c3c3c]">
            <FileCode size={16} className="text-[#569cd6] mb-1" />
            <p className="text-[#d4d4d4] font-medium">Open a file</p>
            <p className="text-[#858585] text-xs mt-0.5">Click any file in the sidebar</p>
          </div>
          <div className="bg-[#252526] p-3 rounded border border-[#3c3c3c]">
            <SplitSquareHorizontal size={16} className="text-[#4ec9b0] mb-1" />
            <p className="text-[#d4d4d4] font-medium">Split views</p>
            <p className="text-[#858585] text-xs mt-0.5">Click split button in tabs</p>
          </div>
          <div className="bg-[#252526] p-3 rounded border border-[#3c3c3c]">
            <Terminal size={16} className="text-[#e2b714] mb-1" />
            <p className="text-[#d4d4d4] font-medium">Terminal</p>
            <p className="text-[#858585] text-xs mt-0.5">Toggle with Ctrl+` </p>
          </div>
          <div className="bg-[#252526] p-3 rounded border border-[#3c3c3c]">
            <Download size={16} className="text-[#ce9178] mb-1" />
            <p className="text-[#d4d4d4] font-medium">Export project</p>
            <p className="text-[#858585] text-xs mt-0.5">Download all files as zip</p>
          </div>
        </div>

        <div className="mt-8 text-xs text-[#858585] space-y-2">
          <p className="flex items-center justify-center gap-1">
            <Sparkles size={12} /> Keyboard Shortcuts
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1 bg-[#3c3c3c] px-1.5 py-0.5 rounded">
              <Save size={10} /> Ctrl+S
            </span>
            <span className="inline-flex items-center gap-1 bg-[#3c3c3c] px-1.5 py-0.5 rounded">
              <PanelBottom size={10} /> Ctrl+`
            </span>
            <span className="inline-flex items-center gap-1 bg-[#3c3c3c] px-1.5 py-0.5 rounded">
              <PanelRightClose size={10} /> Ctrl+B
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
