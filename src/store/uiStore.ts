import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  sidebarWidth: number;
  terminalOpen: boolean;
  terminalHeight: number;
  bottomPanel: 'terminal' | 'preview' | 'none';
  toggleSidebar: () => void;
  setSidebarWidth: (w: number) => void;
  toggleTerminal: () => void;
  setTerminalHeight: (h: number) => void;
  setBottomPanel: (panel: 'terminal' | 'preview' | 'none') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  sidebarWidth: 260,
  terminalOpen: false,
  terminalHeight: 200,
  bottomPanel: 'none',

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarWidth: (w) => set({ sidebarWidth: w }),
  toggleTerminal: () => set((s) => ({ terminalOpen: !s.terminalOpen })),
  setTerminalHeight: (h) => set({ terminalHeight: h }),
  setBottomPanel: (panel) => set({ bottomPanel: panel }),
}));
