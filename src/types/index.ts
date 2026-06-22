export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

export interface EditorTab {
  fileId: string;
  filePath: string;
  fileName: string;
  dirty: boolean;
  cursorPosition: { line: number; column: number };
}

export interface EditorGroup {
  id: string;
  tabs: EditorTab[];
  activeTabId: string | null;
  splitDirection?: 'horizontal' | 'vertical';
}

export interface FileSystemState {
  root: FileNode | null;
  expandedPaths: Set<string>;
}

export type PanelVisibility = 'closed' | 'terminal' | 'preview' | 'both';
