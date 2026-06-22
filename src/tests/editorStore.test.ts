import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '@/store/editorStore';

describe('editorStore', () => {
  beforeEach(() => {
    useEditorStore.setState({
      groups: [{
        id: 'group-1',
        tabs: [],
        activeTabId: null,
      }],
      activeGroupId: 'group-1',
    });
  });

  it('should start with one empty group', () => {
    const groups = useEditorStore.getState().groups;
    expect(groups).toHaveLength(1);
    expect(groups[0].tabs).toHaveLength(0);
    expect(groups[0].activeTabId).toBeNull();
  });

  it('should open a file as a tab', () => {
    useEditorStore.getState().openFile('file-1', 'project/index.html', 'index.html');
    const group = useEditorStore.getState().groups[0];
    expect(group.tabs).toHaveLength(1);
    expect(group.tabs[0].fileId).toBe('file-1');
    expect(group.tabs[0].fileName).toBe('index.html');
    expect(group.activeTabId).toBe('file-1');
  });

  it('should open multiple files as tabs', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    useEditorStore.getState().openFile('file-2', 'b.js', 'b.js');
    useEditorStore.getState().openFile('file-3', 'c.js', 'c.js');
    const group = useEditorStore.getState().groups[0];
    expect(group.tabs).toHaveLength(3);
    expect(group.activeTabId).toBe('file-3');
  });

  it('should not duplicate tabs for the same file', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    const group = useEditorStore.getState().groups[0];
    expect(group.tabs).toHaveLength(1);
  });

  it('should switch to existing tab when reopening a file', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    useEditorStore.getState().openFile('file-2', 'b.js', 'b.js');
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    const group = useEditorStore.getState().groups[0];
    expect(group.tabs).toHaveLength(2);
    expect(group.activeTabId).toBe('file-1');
  });

  it('should set the active tab', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    useEditorStore.getState().openFile('file-2', 'b.js', 'b.js');
    useEditorStore.getState().setActiveTab('group-1', 'file-1');
    const group = useEditorStore.getState().groups[0];
    expect(group.activeTabId).toBe('file-1');
  });

  it('should close a tab', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    useEditorStore.getState().openFile('file-2', 'b.js', 'b.js');
    useEditorStore.getState().closeTab('group-1', 'file-1');
    const group = useEditorStore.getState().groups[0];
    expect(group.tabs).toHaveLength(1);
    expect(group.tabs[0].fileId).toBe('file-2');
  });

  it('should switch to the next tab when closing the active tab', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    useEditorStore.getState().openFile('file-2', 'b.js', 'b.js');
    useEditorStore.getState().closeTab('group-1', 'file-2');
    const group = useEditorStore.getState().groups[0];
    expect(group.activeTabId).toBe('file-1');
  });

  it('should set active tab to null when closing the last tab', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    useEditorStore.getState().closeTab('group-1', 'file-1');
    const group = useEditorStore.getState().groups[0];
    expect(group.tabs).toHaveLength(0);
    expect(group.activeTabId).toBeNull();
  });

  it('should mark a tab as dirty', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    useEditorStore.getState().markTabDirty('group-1', 'file-1', true);
    const group = useEditorStore.getState().groups[0];
    expect(group.tabs[0].dirty).toBe(true);
  });

  it('should mark a tab as clean', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    useEditorStore.getState().markTabDirty('group-1', 'file-1', true);
    useEditorStore.getState().markTabDirty('group-1', 'file-1', false);
    const group = useEditorStore.getState().groups[0];
    expect(group.tabs[0].dirty).toBe(false);
  });

  it('should update cursor position', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    useEditorStore.getState().updateTabCursor('group-1', 'file-1', 10, 5);
    const group = useEditorStore.getState().groups[0];
    expect(group.tabs[0].cursorPosition).toEqual({ line: 10, column: 5 });
  });

  it('should get the active tab', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    const activeTab = useEditorStore.getState().getActiveTab();
    expect(activeTab).not.toBeNull();
    expect(activeTab?.fileId).toBe('file-1');
  });

  it('should return null for getActiveTab when no tabs', () => {
    const activeTab = useEditorStore.getState().getActiveTab();
    expect(activeTab).toBeNull();
  });

  it('should split a group', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    useEditorStore.getState().splitGroup('group-1', 'horizontal');
    const groups = useEditorStore.getState().groups;
    expect(groups).toHaveLength(2);
    expect(groups[0].splitDirection).toBe('horizontal');
  });

  it('should close a group when more than one exists', () => {
    useEditorStore.getState().splitGroup('group-1', 'horizontal');
    useEditorStore.getState().closeGroup('group-1');
    const groups = useEditorStore.getState().groups;
    expect(groups).toHaveLength(1);
  });

  it('should not close the last remaining group', () => {
    useEditorStore.getState().closeGroup('group-1');
    const groups = useEditorStore.getState().groups;
    expect(groups).toHaveLength(1);
  });

  it('should move a tab from one group to another', () => {
    useEditorStore.getState().openFile('file-1', 'a.js', 'a.js');
    useEditorStore.getState().splitGroup('group-1', 'horizontal');
    const groups = useEditorStore.getState().groups;
    const secondGroupId = groups[1].id;

    useEditorStore.getState().moveTab('file-1', 'group-1', secondGroupId);
    const updatedGroups = useEditorStore.getState().groups;

    // Source group is removed when it becomes empty
    const sourceGroup = updatedGroups.find((g) => g.id === 'group-1');
    expect(sourceGroup).toBeUndefined();

    const destGroup = updatedGroups.find((g) => g.id === secondGroupId);
    expect(destGroup?.tabs).toHaveLength(1);
    expect(destGroup?.activeTabId).toBe('file-1');
  });
});
