import JSZip from 'jszip';
import { useFileStore } from '@/store/fileStore';
import { getAllFiles } from './fileSystem';

export async function exportProject() {
  const root = useFileStore.getState().root;
  if (!root) {
    return;
  }

  const zip = new JSZip();
  const files = getAllFiles(root);

  for (const file of files) {
    const relativePath = file.path.replace(root.path + '/', '');
    zip.file(relativePath, file.content || '');
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${root.name}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
