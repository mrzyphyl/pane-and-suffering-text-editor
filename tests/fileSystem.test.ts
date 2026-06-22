import { describe, it, expect } from 'vitest';
import {
  getFileIcon,
  getLanguageFromPath,
  isPreviewable,
  findNode,
  findNodeByPath,
  getAllFiles,
} from '@/utils/fileSystem';
import type { FileNode } from '@/types';

describe('getFileIcon', () => {
  it('should return icon for JavaScript files', () => {
    expect(getFileIcon('app.js')).toBe('FileCode');
  });

  it('should return icon for TypeScript files', () => {
    expect(getFileIcon('index.ts')).toBe('FileCode');
  });

  it('should return icon for React TSX files', () => {
    expect(getFileIcon('Component.tsx')).toBe('FileCode');
  });

  it('should return icon for HTML files', () => {
    expect(getFileIcon('index.html')).toBe('FileCode');
  });

  it('should return icon for CSS files', () => {
    expect(getFileIcon('style.css')).toBe('FileJson');
  });

  it('should return icon for JSON files', () => {
    expect(getFileIcon('package.json')).toBe('FileJson');
  });

  it('should return icon for Markdown files', () => {
    expect(getFileIcon('README.md')).toBe('FileText');
  });

  it('should return icon for Python files', () => {
    expect(getFileIcon('script.py')).toBe('FileCode');
  });

  it('should return default icon for unknown extensions', () => {
    expect(getFileIcon('Makefile')).toBe('File');
  });

  it('should handle files with no extension', () => {
    expect(getFileIcon('LICENSE')).toBe('File');
  });

  it('should handle uppercase extensions', () => {
    expect(getFileIcon('File.JS')).toBe('FileCode');
  });

  it('should return gitignore icon', () => {
    expect(getFileIcon('.gitignore')).toBe('FileCode');
  });

  it('should return env icon', () => {
    expect(getFileIcon('.env')).toBe('FileCog');
  });
});

describe('getLanguageFromPath', () => {
  it('should return javascript for .js files', () => {
    expect(getLanguageFromPath('app.js')).toBe('javascript');
  });

  it('should return javascript for .jsx files', () => {
    expect(getLanguageFromPath('App.jsx')).toBe('javascript');
  });

  it('should return typescript for .ts files', () => {
    expect(getLanguageFromPath('index.ts')).toBe('typescript');
  });

  it('should return typescript for .tsx files', () => {
    expect(getLanguageFromPath('Component.tsx')).toBe('typescript');
  });

  it('should return html for .html files', () => {
    expect(getLanguageFromPath('index.html')).toBe('html');
  });

  it('should return css for .css files', () => {
    expect(getLanguageFromPath('style.css')).toBe('css');
  });

  it('should return json for .json files', () => {
    expect(getLanguageFromPath('package.json')).toBe('json');
  });

  it('should return markdown for .md files', () => {
    expect(getLanguageFromPath('README.md')).toBe('markdown');
  });

  it('should return python for .py files', () => {
    expect(getLanguageFromPath('script.py')).toBe('python');
  });

  it('should return plaintext for unknown extensions', () => {
    expect(getLanguageFromPath('unknown.xyz')).toBe('plaintext');
  });
});

describe('isPreviewable', () => {
  it('should return true for .html files', () => {
    expect(isPreviewable('index.html')).toBe(true);
  });

  it('should return true for .md files', () => {
    expect(isPreviewable('README.md')).toBe(true);
  });

  it('should return true for image files', () => {
    expect(isPreviewable('image.png')).toBe(true);
    expect(isPreviewable('photo.jpg')).toBe(true);
    expect(isPreviewable('icon.svg')).toBe(true);
    expect(isPreviewable('animation.gif')).toBe(true);
  });

  it('should return false for .js files', () => {
    expect(isPreviewable('app.js')).toBe(false);
  });

  it('should return false for .ts files', () => {
    expect(isPreviewable('index.ts')).toBe(false);
  });
});

describe('findNode', () => {
  const tree: FileNode = {
    id: 'root',
    name: 'root',
    path: '/root',
    type: 'folder',
    children: [
      {
        id: 'file1',
        name: 'index.html',
        path: '/root/index.html',
        type: 'file',
        content: '<html></html>',
      },
      {
        id: 'folder1',
        name: 'src',
        path: '/root/src',
        type: 'folder',
        children: [
          {
            id: 'file2',
            name: 'app.js',
            path: '/root/src/app.js',
            type: 'file',
            content: 'console.log("hello")',
          },
        ],
      },
    ],
  };

  it('should find a file at root level', () => {
    const result = findNode(tree, 'file1');
    expect(result).not.toBeNull();
    expect(result?.name).toBe('index.html');
  });

  it('should find a nested file', () => {
    const result = findNode(tree, 'file2');
    expect(result).not.toBeNull();
    expect(result?.name).toBe('app.js');
  });

  it('should find the root node', () => {
    const result = findNode(tree, 'root');
    expect(result).not.toBeNull();
    expect(result?.name).toBe('root');
  });

  it('should return null for non-existent id', () => {
    const result = findNode(tree, 'nonexistent');
    expect(result).toBeNull();
  });

  it('should return null for null root', () => {
    const result = findNode(null, 'anything');
    expect(result).toBeNull();
  });
});

describe('findNodeByPath', () => {
  const tree: FileNode = {
    id: 'root',
    name: 'project',
    path: 'project',
    type: 'folder',
    children: [
      {
        id: 'f1',
        name: 'index.html',
        path: 'project/index.html',
        type: 'file',
        content: '<html></html>',
      },
      {
        id: 'f2',
        name: 'src',
        path: 'project/src',
        type: 'folder',
        children: [
          {
            id: 'f3',
            name: 'app.js',
            path: 'project/src/app.js',
            type: 'file',
            content: 'console.log("hi")',
          },
        ],
      },
    ],
  };

  it('should find by exact path', () => {
    const result = findNodeByPath(tree, 'project/index.html');
    expect(result).not.toBeNull();
    expect(result?.name).toBe('index.html');
  });

  it('should find nested file by path', () => {
    const result = findNodeByPath(tree, 'project/src/app.js');
    expect(result).not.toBeNull();
    expect(result?.name).toBe('app.js');
  });

  it('should return null for non-existent path', () => {
    const result = findNodeByPath(tree, 'project/unknown.js');
    expect(result).toBeNull();
  });
});

describe('getAllFiles', () => {
  it('should return all files from the tree', () => {
    const tree: FileNode = {
      id: 'root',
      name: 'root',
      path: '/root',
      type: 'folder',
      children: [
        { id: 'f1', name: 'a.txt', path: '/root/a.txt', type: 'file' },
        {
          id: 'd1',
          name: 'sub',
          path: '/root/sub',
          type: 'folder',
          children: [
            { id: 'f2', name: 'b.txt', path: '/root/sub/b.txt', type: 'file' },
          ],
        },
      ],
    };
    const files = getAllFiles(tree);
    expect(files).toHaveLength(2);
    expect(files.map((f) => f.name).sort()).toEqual(['a.txt', 'b.txt']);
  });

  it('should return empty array for null root', () => {
    const files = getAllFiles(null);
    expect(files).toEqual([]);
  });

  it('should return only files, not folders', () => {
    const tree: FileNode = {
      id: 'root',
      name: 'root',
      path: '/root',
      type: 'folder',
      children: [
        { id: 'f1', name: 'file.txt', path: '/root/file.txt', type: 'file' },
        { id: 'd1', name: 'empty', path: '/root/empty', type: 'folder', children: [] },
      ],
    };
    const files = getAllFiles(tree);
    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('file.txt');
  });
});
