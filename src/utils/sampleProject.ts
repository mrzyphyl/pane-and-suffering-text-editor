import { FileNode } from '@/types';

let idCounter = 0;
function id() {
  return `node-${++idCounter}`;
}

export function createSampleProject(): FileNode {
  return {
    id: id(),
    name: 'my-project',
    path: 'my-project',
    type: 'folder',
    children: [
      {
        id: id(),
        name: 'index.html',
        path: 'my-project/index.html',
        type: 'file',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="src/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
</head>
<body>
  <div id="app">
    <h1><i class="fa-solid fa-code"></i> My App</h1>
    <p><i class="fa-regular fa-pen-to-square"></i> Start editing files to see changes in real time.</p>
  </div>
  <script src="src/app.js"></script>
</body>
</html>`,
      },
      {
        id: id(),
        name: 'README.md',
        path: 'my-project/README.md',
        type: 'file',
        content: `# My Project

Welcome to **Pane & Suffering** — your browser-based code editor.

## Getting Started

Open files from the sidebar, edit them, and see live previews.
`,
      },
      {
        id: id(),
        name: 'src',
        path: 'my-project/src',
        type: 'folder',
        children: [
          {
            id: id(),
            name: 'app.js',
            path: 'my-project/src/app.js',
            type: 'file',
            content: `function greet(name) {
  return \`Hello, \${name}! Welcome to Pane & Suffering.\`;
}

const app = document.getElementById('app');
if (app) {
  {;
}
  app.innerHTML = \`
    <h1>\${greet('Developer')}</h1>
    <p>Start editing files to see changes in real time.</p>
  \`;
}
`,
          },
          {
            id: id(),
            name: 'style.css',
            path: 'my-project/src/style.css',
            type: 'file',
            content: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  background: #1e1e1e;
  color: #d4d4d4;
}

h1 {
  color: #569cd6;
}

p {
  color: #ce9178;
}
`,
          },
        ],
      },
    ],
  };
}
