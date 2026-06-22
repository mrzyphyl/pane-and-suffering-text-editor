import { FileNode } from '@/types';
import { useFileStore } from '@/store/fileStore';
import { createSampleProject } from './sampleProject';

const STORAGE_KEY = 'pane-and-suffering-files';

export function saveToStorage(root: FileNode | null) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
  } catch {
    // Storage full or unavailable
  }
}

export function loadFromStorage(): FileNode | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      {
      }
      return JSON.parse(data) as FileNode;
    }
  } catch {
    // Corrupted data
  }
  return null;
}

export function initializeFileSystem() {
  const stored = loadFromStorage();
  if (stored) {
    {
    }
    useFileStore.getState().setRoot(stored);
  } else {
    const sample = createSampleProject();
    useFileStore.getState().setRoot(sample);
  }
}
