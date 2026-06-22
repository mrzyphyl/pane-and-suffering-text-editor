import { FileNode } from '@/types';
import { getFileIcon } from '@/utils/fileSystem';
import { useEditorStore } from '@/store/editorStore';
import { useFileStore } from '@/store/fileStore';
import { exportProject } from '@/utils/exportProject';
import { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  File,
  Folder,
  FolderOpen,
  Pencil,
  Download,
  FileCode,
  FileJson,
  FileText,
  FileImage,
  FileCog,
  SplitSquareVertical,
} from 'lucide-react';

const FILE_ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  File,
  FileCode,
  FileJson,
  FileText,
  FileImage,
  FileCog,
};

function FileIcon({ name }: { name: string }) {
  const iconName = getFileIcon(name);
  const IconComponent = FILE_ICON_MAP[iconName] || File;
  return <IconComponent size={14} />;
}

interface ContextMenuState {
  x: number;
  y: number;
  node: FileNode;
}

interface FileItemProps {
  node: FileNode;
  depth: number;
  parentId?: string;
  onSetActiveDir?: (dirId: string) => void;
}

function FileItem({ node, depth, parentId, onSetActiveDir }: FileItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const renameRef = useRef<HTMLInputElement>(null);
  const contextRef = useRef<HTMLDivElement>(null);

  const addFile = useFileStore((s) => s.addFile);
  const deleteNode = useFileStore((s) => s.deleteNode);
  const renameNode = useFileStore((s) => s.renameNode);
  const activeTabId = useEditorStore((s) => {
    const group = s.groups.find((g) => g.id === s.activeGroupId);
    return group?.activeTabId || null;
  });

  const isActive = activeTabId === node.id;

  useEffect(() => {
    if (renaming && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renaming]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    }
    if (contextMenu) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [contextMenu]);

  function clampMenuPosition(x: number, y: number) {
    const menuHeight = node.type === 'file' ? 180 : 220;
    return {
      x: Math.min(x, window.innerWidth - 176),
      y: Math.min(y, window.innerHeight - menuHeight - 16),
    };
  }

  function handleClick() {
    if (node.type === 'folder') {
      setExpanded(!expanded);
      onSetActiveDir?.(node.id);
    } else {
      useEditorStore.getState().openFile(node.id, node.path, node.name);
      if (parentId) {
        onSetActiveDir?.(parentId);
      }
    }
  }

  function handleContextAction(action: string) {
    setContextMenu(null);
    if (action === 'open') {
      useEditorStore.getState().openFile(node.id, node.path, node.name);
    } else if (action === 'open-to-side') {
      const gid = useEditorStore.getState().activeGroupId;
      if (gid) {
        useEditorStore.getState().splitGroup(gid, 'horizontal');
        useEditorStore.getState().openFile(node.id, node.path, node.name);
      }
    } else if (action === 'new-file') {
      const targetId = node.type === 'folder' ? node.id : (parentId ?? node.id);
      const id = addFile(targetId, 'untitled.txt', 'file');
      if (id) {
        const file = useFileStore.getState().getNode(id);
        if (file) {
          useEditorStore.getState().openFile(id, file.path, file.name);
        }
      }
    } else if (action === 'new-folder') {
      const targetId = node.type === 'folder' ? node.id : (parentId ?? node.id);
      addFile(targetId, 'new-folder', 'folder');
    } else if (action === 'rename') {
      setNewName(node.name);
      setRenaming(true);
    } else if (action === 'delete') {
      if (node.type === 'folder' && node.children && node.children.length > 0) {
        if (!confirm(`Delete folder "${node.name}" and all its contents?`)) {
          return;
        }
      }
      deleteNode(node.id);
    } else if (action === 'new-file-here') {
    }
  }

  function handleRename() {
    if (newName.trim() && newName !== node.name) {
      renameNode(node.id, newName.trim());
    }
    setRenaming(false);
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (node.type === 'folder') {
      onSetActiveDir?.(node.id);
    } else if (parentId) {
      onSetActiveDir?.(parentId);
    }
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  }

  const pos = contextMenu ? clampMenuPosition(contextMenu.x, contextMenu.y) : null;

  return (
    <div>
      <div
        className={`flex items-center h-7 pr-2 text-sm cursor-pointer select-none group ${
          isActive ? 'active-bg' : 'hover-bg'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {node.type === 'folder' && (
          <span className="w-4 h-4 flex items-center justify-center shrink-0 mr-1">
            {expanded ? (
              <ChevronDown size={14} className="text-[#858585]" />
            ) : (
              <ChevronRight size={14} className="text-[#858585]" />
            )}
          </span>
        )}
        {node.type === 'file' && <span className="w-4 mr-1" />}
        <span className="mr-1.5 text-[#858585]">
          {node.type === 'folder' ? (
            expanded ? (
              <FolderOpen size={14} />
            ) : (
              <Folder size={14} />
            )
          ) : (
            <FileIcon name={node.name} />
          )}
        </span>
        {renaming ? (
          <input
            ref={renameRef}
            className="bg-[#3c3c3c] text-sm px-1 outline-none border border-[#007acc] flex-1"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRename();
              }
              if (e.key === 'Escape') {
                setRenaming(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate flex-1">{node.name}</span>
        )}
      </div>

      {node.type === 'folder' && expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileItem
              key={child.id}
              node={child}
              depth={depth + 1}
              parentId={node.id}
              onSetActiveDir={onSetActiveDir}
            />
          ))}
        </div>
      )}

      {contextMenu && pos && (
        <div
          ref={contextRef}
          className="fixed z-50 bg-[#252526] border border-[#3c3c3c] shadow-xl py-1 text-sm rounded min-w-[160px]"
          style={{ left: pos.x, top: pos.y }}
        >
          {node.type === 'file' ? (
            <>
              <button
                className="flex items-center gap-2 w-full px-4 py-1.5 hover-bg"
                onClick={() => handleContextAction('open')}
              >
                <FileCode size={14} /> Open
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-1.5 hover-bg"
                onClick={() => handleContextAction('open-to-side')}
              >
                <SplitSquareVertical size={14} /> Open to the Side
              </button>
            </>
          ) : (
            <>
              <button
                className="flex items-center gap-2 w-full px-4 py-1.5 hover-bg"
                onClick={() => handleContextAction('new-file')}
              >
                <File size={14} /> New File
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-1.5 hover-bg"
                onClick={() => handleContextAction('new-folder')}
              >
                <Folder size={14} /> New Folder
              </button>
            </>
          )}
          <div className="border-t border-[#3c3c3c] my-1" />
          <button
            className="flex items-center gap-2 w-full px-4 py-1.5 hover-bg"
            onClick={() => handleContextAction('rename')}
          >
            <Pencil size={14} /> Rename
          </button>
          <button
            className="flex items-center gap-2 w-full px-4 py-1.5 hover-bg text-[#f44747]"
            onClick={() => handleContextAction('delete')}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function FileExplorer() {
  const root = useFileStore((s) => s.root);
  const addFile = useFileStore((s) => s.addFile);
  const openFile = useEditorStore((s) => s.openFile);
  const [activeDirId, setActiveDirId] = useState<string | null>(null);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const newMenuRef = useRef<HTMLDivElement>(null);
  const newBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        newMenuRef.current &&
        !newMenuRef.current.contains(e.target as Node) &&
        newBtnRef.current &&
        !newBtnRef.current.contains(e.target as Node)
      ) {
        setShowNewMenu(false);
      }
    }
    if (showNewMenu) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNewMenu]);

  function handleNewFile() {
    setShowNewMenu(false);
    const targetId = activeDirId || root?.id;
    if (!targetId || !root) {
      return;
    }
    const id = addFile(targetId, 'untitled.txt', 'file');
    if (id) {
      const file = useFileStore.getState().getNode(id);
      if (file) {
        openFile(id, file.path, file.name);
      }
    }
  }

  function handleNewFolder() {
    setShowNewMenu(false);
    const targetId = activeDirId || root?.id;
    if (!targetId || !root) {
      return;
    }
    addFile(targetId, 'new-folder', 'folder');
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between h-9 px-4 text-xs uppercase tracking-wider text-[#858585] border-b border-[#3c3c3c]">
        <span>Explorer</span>
        <div className="flex items-center gap-1 relative">
          <button onClick={() => exportProject()} className="p-1 hover-bg rounded" title="Export Project">
            <Download size={14} />
          </button>
          <button
            ref={newBtnRef}
            onClick={() => setShowNewMenu(!showNewMenu)}
            className="p-1 hover-bg rounded"
            title="New File or Folder"
          >
            <Plus size={14} />
          </button>
          {showNewMenu && (
            <div
              ref={newMenuRef}
              className="absolute z-50 bg-[#252526] border border-[#3c3c3c] shadow-xl py-1 text-sm rounded min-w-[130px]"
              style={{
                right: '0',
                top: '100%',
              }}
            >
              <button
                className="flex items-center gap-2 w-full px-3 py-1.5 hover-bg"
                onClick={handleNewFile}
              >
                <File size={14} /> New File
              </button>
              <button
                className="flex items-center gap-2 w-full px-3 py-1.5 hover-bg"
                onClick={handleNewFolder}
              >
                <Folder size={14} /> New Folder
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {root && (
          <FileItem
            node={root}
            depth={0}
            onSetActiveDir={(dirId) => setActiveDirId(dirId)}
          />
        )}
      </div>
    </div>
  );
}
