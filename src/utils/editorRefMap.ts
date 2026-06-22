import * as monaco from 'monaco-editor';

const instances = new Map<string, monaco.editor.IStandaloneCodeEditor>();

export function registerEditor(groupId: string, editor: monaco.editor.IStandaloneCodeEditor) {
  instances.set(groupId, editor);
}

export function unregisterEditor(groupId: string) {
  instances.delete(groupId);
}

export function undo(groupId: string) {
  instances.get(groupId)?.trigger('keyboard', 'undo', null);
}

export function redo(groupId: string) {
  instances.get(groupId)?.trigger('keyboard', 'redo', null);
}
