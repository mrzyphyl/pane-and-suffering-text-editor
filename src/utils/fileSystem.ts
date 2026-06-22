import { FileNode } from '@/types';

export function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase();
  const icons: Record<string, string> = {
    js: 'FileCode',
    jsx: 'FileCode',
    ts: 'FileCode',
    tsx: 'FileCode',
    html: 'FileCode',
    css: 'FileJson',
    json: 'FileJson',
    md: 'FileText',
    py: 'FileCode',
    svg: 'FileImage',
    png: 'FileImage',
    jpg: 'FileImage',
    jpeg: 'FileImage',
    gitignore: 'FileCode',
    env: 'FileCog',
  };
  return icons[ext || ''] || 'File';
}

export function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    py: 'python',
    svg: 'xml',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    sh: 'shell',
    bash: 'shell',
    txt: 'plaintext',
    env: 'dotenv',
    gitignore: 'ignore',
  };
  return map[ext || ''] || 'plaintext';
}

export function isPreviewable(path: string): boolean {
  const ext = path.split('.').pop()?.toLowerCase();
  return ['html', 'md', 'png', 'jpg', 'jpeg', 'svg', 'gif'].includes(ext || '');
}

export function findNode(root: FileNode | null, id: string): FileNode | null {
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

export function findNodeByPath(root: FileNode | null, path: string): FileNode | null {
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

export function getAllFiles(root: FileNode | null): FileNode[] {
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
