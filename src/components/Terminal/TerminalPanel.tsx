import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useUIStore } from '@/store/uiStore';

const MOCK_COMMANDS: Record<string, string> = {
  help: 'Available commands: ls, cd, pwd, echo, cat, mkdir, touch, rm, clear, help, whoami, date, node, npm, git',
  pwd: '/home/user/project',
  whoami: 'user',
  date: new Date().toString(),
  node: 'v20.11.0',
  npm: '10.2.4',
  clear: '',
};

function writeLine(term: Terminal, text: string) {
  term.writeln(text);
}

function startMockShell(term: Terminal): () => void {
  const cwd = ['~', 'project'];
  let inputBuffer = '';

  function prompt() {
    term.write(`\r\n\x1b[32muser@pane\x1b[0m:\x1b[34m${cwd.join('/')}\x1b[0m$ `);
  }

  term.write(`\r\n\x1b[90mMock terminal \u2014 no file system access.\x1b[0m`);
  term.write(`\r\n\x1b[90mType \x1b[33mhelp\x1b[90m for available commands.\x1b[0m\r\n`);
  prompt();

  const handler = term.onData((data) => {
    if (data === '\r') {
      const trimmed = inputBuffer.trim();
      const args = trimmed.split(/\s+/);
      const cmd = args[0].toLowerCase();

      if (cmd === 'clear' || cmd === 'cls') {
        term.clear();
      } else if (cmd === 'exit') {
        term.write('\r\n');
        handler.dispose();
        return;
      } else if (cmd === 'cd') {
        if (args[1] === '..' && cwd.length > 1) {
          cwd.pop();
        } else if (args[1] && args[1] !== '~') {
          cwd.push(args[1]);
        }
      } else if (cmd === 'ls') {
        writeLine(term, 'index.html  src/  package.json  README.md  node_modules/');
      } else if (cmd === 'echo') {
        writeLine(term, args.slice(1).join(' '));
      } else if (cmd === 'cat') {
        if (args[1] === 'package.json') {
          writeLine(term, '{\n  "name": "my-project",\n  "version": "1.0.0"\n}');
        } else if (args[1]) {
          writeLine(term, `// Contents of ${args[1]}`);
        } else {
          writeLine(term, 'Usage: cat <filename>');
        }
      } else if (cmd === 'mkdir' || cmd === 'touch') {
        writeLine(term, '');
      } else if (cmd === 'rm') {
        writeLine(term, '');
      } else if (MOCK_COMMANDS[cmd] !== undefined) {
        if (MOCK_COMMANDS[cmd]) {
          writeLine(term, MOCK_COMMANDS[cmd]);
        }
      } else if (trimmed) {
        writeLine(term, `\x1b[31mbash: ${cmd}: command not found\x1b[0m`);
      }

      inputBuffer = '';
      prompt();
    } else if (data === '\x7f') {
      if (inputBuffer.length > 0) {
        inputBuffer = inputBuffer.slice(0, -1);
        term.write('\b \b');
      }
    } else if (data >= ' ') {
      inputBuffer += data;
      term.write(data);
    }
  });

  return () => {
    handler.dispose();
  };
}

export default function TerminalPanel() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const terminalOpen = useUIStore((s) => s.terminalOpen);

  useEffect(() => {
    if (!terminalOpen || !terminalRef.current) {
      return;
    }

    const term = new Terminal({
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
        selectionBackground: '#264f78',
        black: '#1e1e1e',
        red: '#f44747',
        green: '#6a9955',
        yellow: '#e2b714',
        blue: '#569cd6',
        magenta: '#c586c0',
        cyan: '#4ec9b0',
        white: '#d4d4d4',
      },
      fontSize: 13,
      fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace",
      cursorBlink: true,
      allowTransparency: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddonRef.current = fitAddon;

    term.open(terminalRef.current);
    term.focus();

    requestAnimationFrame(() => {
      try {
        fitAddon.fit();
      } catch {
        // ignore
      }
    });

    const cleanup = startMockShell(term);

    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddonRef.current?.fit();
      } catch {
        // ignore
      }
    });

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      cleanup();
      term.dispose();
    };
  }, [terminalOpen]);

  return <div ref={terminalRef} className="h-full w-full" />;
}
