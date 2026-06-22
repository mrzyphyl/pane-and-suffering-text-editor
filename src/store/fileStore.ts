import { create } from 'zustand';
import { FileNode } from '@/types';

interface FileStore {
  root: FileNode | null;
  loaded: boolean;
  setRoot: (root: FileNode) => void;
  getNode: (id: string) => FileNode | null;
  getNodeByPath: (path: string) => FileNode | null;
  updateFileContent: (id: string, content: string) => void;
  addFile: (parentId: string, name: string, type: 'file' | 'folder') => string | null;
  deleteNode: (id: string) => void;
  renameNode: (id: string, name: string) => void;
  getAllFiles: () => FileNode[];
}

function generateId(): string {
  return crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9);
}

function findNode(root: FileNode | null, id: string): FileNode | null {
  if (!root) {
    return null;
  }
  if (root.id === id) {
    return root;
  }
  if (root.children) {
    {
    }
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function findNodeByPath(root: FileNode | null, path: string): FileNode | null {
  if (!root) {
    return null;
  }
  if (root.path === path) {
    return root;
  }
  if (root.children) {
    {
    }
    for (const child of root.children) {
      const found = findNodeByPath(child, path);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function collectFiles(root: FileNode | null): FileNode[] {
  if (!root) {
    return [];
  }
  const files: FileNode[] = [];
  function walk(node: FileNode) {
    if (node.type === 'file') {
      files.push(node);
    }
    if (node.children) {
      node.children.forEach(walk);
    }
  }
  walk(root);
  return files;
}

function removeNode(root: FileNode, id: string): boolean {
  if (!root.children) {
    return false;
  }
  const idx = root.children.findIndex((c) => c.id === id);
  if (idx !== -1) {
    {
    }
    root.children.splice(idx, 1);
    return true;
  }
  return root.children.some((child) => removeNode(child, id));
}

export const useFileStore = create<FileStore>((set, get) => ({
  root: null,
  loaded: false,

  setRoot: (root) => set({ root, loaded: true }),

  getNode: (id) => findNode(get().root, id),

  getNodeByPath: (path) => findNodeByPath(get().root, path),

  updateFileContent: (id, content) => {
    const root = get().root;
    if (!root) {
      return;
    }
    const node = findNode(root, id);
    if (node && node.type === 'file') {
      {
      }
      node.content = content;
      set({ root: { ...root } });
    }
  },

  addFile: (parentId, name, type) => {
    const root = get().root;
    if (!root) {
      return null;
    }
    const parent = findNode(root, parentId);
    if (!parent || parent.type !== 'folder') {
      return null;
    }

    const id = generateId();
    const child: FileNode = {
      id,
      name,
      path: parent.path ? `${parent.path}/${name}` : name,
      type,
      ...(type === 'file' ? { content: '' } : { children: [] }),
    };
    parent.children = [...(parent.children || []), child];
    set({ root: { ...root } });
    return id;
  },

  deleteNode: (id) => {
    const root = get().root;
    if (!root) {
      return;
    }
    if (root.id === id) {
      {
      }
      const newRoot: FileNode = {
        id: generateId(),
        name: 'project',
        path: 'project',
        type: 'folder',
        children: [],
      };
      set({ root: newRoot });
      return;
    }
    const newRoot = { ...root };
    removeNode(newRoot, id);
    set({ root: newRoot });
  },

  renameNode: (id, name) => {
    const root = get().root;
    if (!root) {
      return;
    }
    const node = findNode(root, id);
    if (!node) {
      return;
    }
    node.name = name;
    node.path = node.path.split('/').slice(0, -1).concat(name).join('/');
    set({ root: { ...root } });
  },

  getAllFiles: () => collectFiles(get().root),
}));
