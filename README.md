# Pane & Suffering

> A browser-based code editor — because one pane is never enough.

Built with React, TypeScript, Monaco Editor, and xterm.js.

## Features

- **Monaco Editor** — Syntax highlighting, IntelliSense, multi-cursor, auto-complete, and built-in JS/TS linting (the same engine as VS Code).
- **File Explorer** — Collapsible tree, right-click context menu to create/rename/delete files and folders.
- **Tab Management** — Multiple open files, dirty indicators, close buttons.
- **Split Views** — Split editor groups horizontally or vertically, each with independent tabs.
- **Terminal** — xterm.js mock terminal with basic file system commands. No real shell access. Toggle with `Ctrl+``.
- **File Previews** — HTML rendered in an `<iframe>`, Markdown rendered with `react-markdown`, and image previews.
- **Export Project** — Download your entire project as a `.zip` file.
- **Auto-Save** — Your files persist in browser `localStorage` across sessions.
- **Sample Project** — Pre-populated with demo files so you can start editing immediately.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + `` ` | Toggle terminal |
| `Ctrl + B` | Toggle sidebar |
| `Ctrl + S` | Save current file |

## Project Structure

```
src/
├── App.tsx                      # Root component
├── main.tsx                     # Entry point
├── index.css                    # Tailwind + custom styles
├── components/
│   ├── Layout/MainLayout.tsx    # Resizable panels layout
│   ├── Sidebar/FileExplorer.tsx # File tree with context menu
│   ├── Editor/
│   │   ├── EditorGroup.tsx      # Tab bar + split buttons + Monaco
│   │   ├── EditorTabs.tsx       # Tab strip with close buttons
│   │   └── MonacoEditor.tsx     # Monaco editor wrapper
│   ├── Terminal/TerminalPanel.tsx  # xterm.js mock terminal
│   ├── Preview/PreviewPanel.tsx    # HTML/MD/image previews
│   ├── StatusBar/StatusBar.tsx     # Cursor, language, git info
│   └── Welcome/WelcomeScreen.tsx   # Shortcuts reference
├── store/
│   ├── editorStore.ts           # Tabs, editor groups, cursor
│   ├── fileStore.ts             # Virtual file system CRUD
│   └── uiStore.ts               # Sidebar/terminal visibility
├── utils/
│   ├── fileSystem.ts            # Helpers (icons, lang detection)
│   ├── sampleProject.ts         # Demo project data
│   ├── persistence.ts           # localStorage auto-save
│   └── exportProject.ts         # JSZip export
├── hooks/
│   └── useAutoSave.ts           # Subscribe to file changes
└── types/
    └── index.ts                 # TypeScript interfaces
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Vite](https://vitejs.dev) | Build tool |
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Language |
| [Monaco Editor](https://microsoft.github.io/monaco-editor) | Code editor engine |
| [Zustand](https://github.com/pmndrs/zustand) | State management |
| [xterm.js](https://xtermjs.org) | Terminal emulator |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) | Split view panels |
| [JSZip](https://stuk.github.io/jszip) | Project export |
| [lucide-react](https://lucide.dev) | Icons |
| [Vitest](https://vitest.dev) | Testing |
