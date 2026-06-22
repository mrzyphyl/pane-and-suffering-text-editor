import { useEffect } from 'react';
import { useFileStore } from '@/store/fileStore';
import { saveToStorage } from '@/utils/persistence';

export function useAutoSave() {
  const root = useFileStore((s) => s.root);
  useEffect(() => {
    if (root) {
      {
      }
      saveToStorage(root);
    }
  }, [root]);
}
