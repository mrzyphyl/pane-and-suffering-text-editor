import { create } from 'zustand';
import { EditorGroup, EditorTab } from '@/types';

interface EditorStore {
  groups: EditorGroup[];
  activeGroupId: string | null;
  setActiveGroup: (id: string) => void;
  openFile: (fileId: string, filePath: string, fileName: string) => void;
  closeTab: (groupId: string, tabId: string) => void;
  setActiveTab: (groupId: string, tabId: string) => void;
  updateTabCursor: (groupId: string, tabId: string, line: number, column: number) => void;
  markTabDirty: (groupId: string, tabId: string, dirty: boolean) => void;
  splitGroup: (groupId: string, direction: 'horizontal' | 'vertical') => void;
  closeGroup: (groupId: string) => void;
  moveTab: (tabId: string, fromGroupId: string, toGroupId: string) => void;
  getActiveTab: () => EditorTab | null;
}

let groupCounter = 0;
function nextGroupId() {
  return `group-${++groupCounter}`;
}
function createInitialGroup(): EditorGroup {
  return {
    id: nextGroupId(),
    tabs: [],
    activeTabId: null,
  };
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  groups: [createInitialGroup()],
  activeGroupId: 'group-1',

  setActiveGroup: (id) => set({ activeGroupId: id }),

  openFile: (fileId, filePath, fileName) => {
    const { groups, activeGroupId } = get();
    const groupIdx = groups.findIndex((g) => g.id === activeGroupId);
    if (groupIdx === -1) {
      return;
    }

    const group = groups[groupIdx];
    const existing = group.tabs.find((t) => t.fileId === fileId);
    if (existing) {
      {
      }
      const newGroups = [...groups];
      newGroups[groupIdx] = { ...group, activeTabId: existing.fileId };
      set({ groups: newGroups });
      return;
    }

    const newTab: EditorTab = {
      fileId,
      filePath,
      fileName,
      dirty: false,
      cursorPosition: { line: 1, column: 1 },
    };

    const newGroups = [...groups];
    newGroups[groupIdx] = {
      ...group,
      tabs: [...group.tabs, newTab],
      activeTabId: fileId,
    };
    set({ groups: newGroups });
  },

  closeTab: (groupId, fileId) => {
    const { groups } = get();
    const groupIdx = groups.findIndex((g) => g.id === groupId);
    if (groupIdx === -1) {
      return;
    }

    const group = groups[groupIdx];
    const tabIdx = group.tabs.findIndex((t) => t.fileId === fileId);
    if (tabIdx === -1) {
      return;
    }

    const newTabs = group.tabs.filter((t) => t.fileId !== fileId);
    let newActiveId = group.activeTabId;
    if (group.activeTabId === fileId) {
      {
      }
      newActiveId =
        newTabs.length > 0 ? newTabs[Math.min(tabIdx, newTabs.length - 1)].fileId : null;
    }

    const newGroups = [...groups];
    newGroups[groupIdx] = { ...group, tabs: newTabs, activeTabId: newActiveId };
    set({ groups: newGroups });
  },

  setActiveTab: (groupId, fileId) => {
    const { groups } = get();
    const groupIdx = groups.findIndex((g) => g.id === groupId);
    if (groupIdx === -1) {
      return;
    }

    const group = groups[groupIdx];
    const newGroups = [...groups];
    newGroups[groupIdx] = { ...group, activeTabId: fileId };
    set({ groups: newGroups, activeGroupId: groupId });
  },

  updateTabCursor: (groupId, fileId, line, column) => {
    const { groups } = get();
    const groupIdx = groups.findIndex((g) => g.id === groupId);
    if (groupIdx === -1) {
      return;
    }

    const group = groups[groupIdx];
    const newTabs = group.tabs.map((t) =>
      t.fileId === fileId ? { ...t, cursorPosition: { line, column } } : t,
    );
    const newGroups = [...groups];
    newGroups[groupIdx] = { ...group, tabs: newTabs };
    set({ groups: newGroups });
  },

  markTabDirty: (groupId, fileId, dirty) => {
    const { groups } = get();
    const groupIdx = groups.findIndex((g) => g.id === groupId);
    if (groupIdx === -1) {
      return;
    }

    const group = groups[groupIdx];
    const newTabs = group.tabs.map((t) => (t.fileId === fileId ? { ...t, dirty } : t));
    const newGroups = [...groups];
    newGroups[groupIdx] = { ...group, tabs: newTabs };
    set({ groups: newGroups });
  },

  splitGroup: (groupId, direction) => {
    const { groups } = get();
    const groupIdx = groups.findIndex((g) => g.id === groupId);
    if (groupIdx === -1) {
      return;
    }

    const group = groups[groupIdx];
    const newGroup: EditorGroup = {
      id: nextGroupId(),
      tabs: [],
      activeTabId: null,
    };

    const newGroups = [...groups];
    newGroups[groupIdx] = { ...group, splitDirection: direction };
    newGroups.push(newGroup);
    set({ groups: newGroups, activeGroupId: newGroup.id });
  },

  closeGroup: (groupId) => {
    const { groups } = get();
    if (groups.length <= 1) {
      return;
    }
    const newGroups = groups.filter((g) => g.id !== groupId);
    const newActiveId = newGroups.length > 0 ? newGroups[0].id : null;
    set({ groups: newGroups, activeGroupId: newActiveId });
  },

  moveTab: (fileId, fromGroupId, toGroupId) => {
    const { groups } = get();
    const fromIdx = groups.findIndex((g) => g.id === fromGroupId);
    const toIdx = groups.findIndex((g) => g.id === toGroupId);
    if (fromIdx === -1 || toIdx === -1) {
      return;
    }

    const fromGroup = groups[fromIdx];
    const tab = fromGroup.tabs.find((t) => t.fileId === fileId);
    if (!tab) {
      return;
    }

    const newFromTabs = fromGroup.tabs.filter((t) => t.fileId !== fileId);
    const newToTabs = [...groups[toIdx].tabs, tab];
    let newFromActive = fromGroup.activeTabId;
    if (fromGroup.activeTabId === fileId) {
      {
      }
      newFromActive = newFromTabs.length > 0 ? newFromTabs[0].fileId : null;
    }

    const newGroups = [...groups];
    newGroups[fromIdx] = { ...fromGroup, tabs: newFromTabs, activeTabId: newFromActive };
    newGroups[toIdx] = { ...groups[toIdx], tabs: newToTabs, activeTabId: fileId };

    const cleaned = newGroups.filter((g) => g.tabs.length > 0 || g.id === toGroupId);
    if (cleaned.length === 0) {
      cleaned.push(createInitialGroup());
    }

    set({ groups: cleaned, activeGroupId: toGroupId });
  },

  getActiveTab: () => {
    const { groups, activeGroupId } = get();
    const group = groups.find((g) => g.id === activeGroupId);
    if (!group || !group.activeTabId) {
      return null;
    }
    return group.tabs.find((t) => t.fileId === group.activeTabId) || null;
  },
}));
