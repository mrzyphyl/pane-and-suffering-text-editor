import { useMemo } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useFileStore } from '@/store/fileStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function resolveExternalRefs(html: string, baseDir: string): string {
  const store = useFileStore.getState();

  const resolvePath = (src: string): string | null => {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return null;
    }
    const parts = src.split('/');
    const baseParts = baseDir ? baseDir.split('/') : [];
    const resolved: string[] = [...baseParts];
    for (const p of parts) {
      if (p === '.' || p === '') {
        continue;
      }
      if (p === '..') {
        if (resolved.length > 0) {
          resolved.pop();
        }
      } else {
        resolved.push(p);
      }
    }
    return resolved.join('/');
  };

  let result = html;

  result = result.replace(/<script\s+src="([^"]+)"\s*><\/script>/gi, (_, src) => {
    const resolved = resolvePath(src);
    if (!resolved) {
      return `<script src="${src}"><\/script>`;
    }
    const node = store.getNodeByPath(resolved);
    if (node?.type === 'file' && node.content) {
      return `<script>\n${node.content}\n<\/script>`;
    }
    return `<script src="${src}"><\/script>`;
  });

  result = result.replace(/<link\s+[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*\/?>/gi, (match, href) => {
    const resolved = resolvePath(href);
    if (!resolved) {
      return match;
    }
    const node = store.getNodeByPath(resolved);
    if (node?.type === 'file' && node.content) {
      return `<style>\n${node.content}\n</style>`;
    }
    return match;
  });

  return result;
}

export default function PreviewPanel({ groupId }: { groupId?: string }) {
  const activeTab = useEditorStore((s) => {
    const gid = groupId || s.activeGroupId;
    const group = s.groups.find((g) => g.id === gid);
    if (!group || !group.activeTabId) {
      return null;
    }
    return group.tabs.find((t) => t.fileId === group.activeTabId) || null;
  });

  const fileContent = activeTab
    ? useFileStore.getState().getNode(activeTab.fileId)?.content || ''
    : '';

  const baseDir = activeTab
    ? activeTab.filePath.split('/').slice(0, -1).join('/')
    : '';

  const resolvedHtml = useMemo(
    () => resolveExternalRefs(fileContent, baseDir),
    [fileContent, baseDir],
  );

  if (!activeTab) {
    return null;
  }

  const ext = activeTab.filePath.split('.').pop()?.toLowerCase();

  if (ext === 'md') {
    {
    }
    return (
      <div className="h-full overflow-y-auto p-6 bg-[#1e1e1e]">
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{fileContent}</ReactMarkdown>
        </div>
      </div>
    );
  }

  if (ext === 'html') {
    {
    }
    return (
      <iframe
        className="h-full w-full bg-white"
        srcDoc={resolvedHtml}
        title="HTML Preview"
        sandbox="allow-scripts"
      />
    );
  }

  if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext || '')) {
    {
    }
    return (
      <div className="h-full flex items-center justify-center bg-[#1e1e1e] p-4">
        {ext === 'svg' ? (
          <div dangerouslySetInnerHTML={{ __html: fileContent }} />
        ) : (
          <img
            src={`data:image/${ext === 'svg' ? 'svg+xml' : ext};base64,${btoa(fileContent)}`}
            alt={activeTab.fileName}
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center text-[#858585] bg-[#1e1e1e]">
      No preview available for this file type.
    </div>
  );
}
