/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#1e1e1e',
          fg: '#cccccc',
          hover: '#2a2d2e',
          active: '#37373d',
          border: '#252526',
        },
        editor: {
          bg: '#1e1e1e',
          fg: '#d4d4d4',
          line: '#2d2d2d',
          active: '#264f78',
        },
        tab: {
          bg: '#2d2d2d',
          active: '#1e1e1e',
          hover: '#3d3d3d',
          border: '#252526',
        },
        status: {
          bg: '#007acc',
          fg: '#ffffff',
        },
        terminal: {
          bg: '#1e1e1e',
          fg: '#d4d4d4',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
