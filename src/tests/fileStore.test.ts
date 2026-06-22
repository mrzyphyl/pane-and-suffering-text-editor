import { describe, it, expect, beforeEach } from 'vitest';
import { useFileStore } from '@/store/fileStore';
import { createSampleProject } from '@/utils/sampleProject';
import type { FileNode } from '@/types';

describe('fileStore', () => {
  const rootId = 'test-root';

  beforeEach(() => {
    const root: FileNode = {
      id: rootId,
      name: 'test-project',
      path: 'test-project',
      type: 'folder',
      children: [
        {
          id: 'file-1',
          name: 'index.html',
          path: 'test-project/index.html',
          type: 'file',
          content: '<html></html>',
        },
        {
          id: 'folder-1',
          name: 'src',
          path: 'test-project/src',
          type: 'folder',
          children: [
            {
              id: 'file-2',
              name: 'app.js',
              path: 'test-project/src/app.js',
              type: 'file',
              content: 'console.log("hello")',
            },
          ],
        },
      ],
    };
    useFileStore.getState().setRoot(root);
  });

  it('should set and retrieve the root node', () => {
    const root = useFileStore.getState().root;
    expect(root).not.toBeNull();
    expect(root?.name).toBe('test-project');
    expect(root?.type).toBe('folder');
  });

  it('should find a node by id', () => {
    const node = useFileStore.getState().getNode('file-1');
    expect(node).not.toBeNull();
    expect(node?.name).toBe('index.html');
    expect(node?.type).toBe('file');
  });

  it('should find a nested node by id', () => {
    const node = useFileStore.getState().getNode('file-2');
    expect(node).not.toBeNull();
    expect(node?.name).toBe('app.js');
    expect(node?.content).toBe('console.log("hello")');
  });

  it('should return null for non-existent id', () => {
    const node = useFileStore.getState().getNode('non-existent');
    expect(node).toBeNull();
  });

  it('should find a node by path', () => {
    const node = useFileStore.getState().getNodeByPath('test-project/index.html');
    expect(node).not.toBeNull();
    expect(node?.name).toBe('index.html');
  });

  it('should find a nested node by path', () => {
    const node = useFileStore.getState().getNodeByPath('test-project/src/app.js');
    expect(node).not.toBeNull();
    expect(node?.name).toBe('app.js');
  });

  it('should return null for non-existent path', () => {
    const node = useFileStore.getState().getNodeByPath('test-project/nope.js');
    expect(node).toBeNull();
  });

  it('should update file content', () => {
    useFileStore.getState().updateFileContent('file-1', '<html><body>Updated</body></html>');
    const node = useFileStore.getState().getNode('file-1');
    expect(node?.content).toBe('<html><body>Updated</body></html>');
  });

  it('should add a file to a folder', () => {
    const id = useFileStore.getState().addFile('folder-1', 'newfile.js', 'file');
    expect(id).not.toBeNull();
    const node = useFileStore.getState().getNode(id!);
    expect(node).not.toBeNull();
    expect(node?.name).toBe('newfile.js');
    expect(node?.type).toBe('file');
    expect(node?.content).toBe('');
    expect(node?.path).toBe('test-project/src/newfile.js');
  });

  it('should add a folder to a folder', () => {
    const id = useFileStore.getState().addFile('folder-1', 'subdir', 'folder');
    expect(id).not.toBeNull();
    const node = useFileStore.getState().getNode(id!);
    expect(node).not.toBeNull();
    expect(node?.name).toBe('subdir');
    expect(node?.type).toBe('folder');
    expect(node?.children).toEqual([]);
  });

  it('should return null when adding to a non-existent parent', () => {
    const id = useFileStore.getState().addFile('non-existent', 'file.js', 'file');
    expect(id).toBeNull();
  });

  it('should delete a file', () => {
    useFileStore.getState().deleteNode('file-1');
    const node = useFileStore.getState().getNode('file-1');
    expect(node).toBeNull();
  });

  it('should delete a folder and its children', () => {
    useFileStore.getState().deleteNode('folder-1');
    const folder = useFileStore.getState().getNode('folder-1');
    expect(folder).toBeNull();
    const child = useFileStore.getState().getNode('file-2');
    expect(child).toBeNull();
  });

  it('should not crash deleting non-existent node', () => {
    expect(() => {
      useFileStore.getState().deleteNode('non-existent');
    }).not.toThrow();
  });

  it('should rename a node', () => {
    useFileStore.getState().renameNode('file-1', 'renamed.html');
    const node = useFileStore.getState().getNode('file-1');
    expect(node?.name).toBe('renamed.html');
  });

  it('should update path when renaming', () => {
    useFileStore.getState().renameNode('file-1', 'renamed.html');
    const node = useFileStore.getState().getNode('file-1');
    expect(node?.path).toBe('test-project/renamed.html');
  });

  it('should not crash renaming non-existent node', () => {
    expect(() => {
      useFileStore.getState().renameNode('non-existent', 'new-name');
    }).not.toThrow();
  });

  it('should get all files', () => {
    const files = useFileStore.getState().getAllFiles();
    expect(files).toHaveLength(2);
    expect(files.map((f) => f.name).sort()).toEqual(['app.js', 'index.html']);
  });
});

describe('fileStore - sample project', () => {
  it('should create a valid sample project', () => {
    const sample = createSampleProject();
    expect(sample).not.toBeNull();
    expect(sample.type).toBe('folder');
    expect(sample.name).toBe('my-project');
    expect(sample.children).toBeDefined();
    expect(sample.children!.length).toBeGreaterThan(0);
  });

  it('should load sample project into store', () => {
    const sample = createSampleProject();
    useFileStore.getState().setRoot(sample);
    const root = useFileStore.getState().root;
    expect(root?.name).toBe('my-project');

    const files = useFileStore.getState().getAllFiles();
    expect(files.length).toBeGreaterThanOrEqual(3);
    const names = files.map((f) => f.name);
    expect(names).toContain('index.html');
    expect(names).toContain('app.js');
    expect(names).toContain('style.css');
    expect(names).toContain('README.md');
  });
});
