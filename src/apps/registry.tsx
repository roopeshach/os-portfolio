import React from 'react';

// Lazy load apps
const Notepad = React.lazy(() => import('../apps/Notepad'));
const Calculator = React.lazy(() => import('../apps/Calculator'));
const Terminal = React.lazy(() => import('../apps/Terminal'));
const FileExplorer = React.lazy(() => import('../apps/FileExplorer'));
const MediaPlayer = React.lazy(() => import('../apps/MediaPlayer'));
const Browser = React.lazy(() => import('../apps/Browser'));
const CodeEditor = React.lazy(() => import('../apps/CodeEditor'));
const Performance = React.lazy(() => import('../apps/Performance'));
const JSConsole = React.lazy(() => import('../apps/JSConsole'));
const ProjectViewer = React.lazy(() => import('../apps/ProjectViewer'));
const ProjectNavigator = React.lazy(() => import('../apps/ProjectNavigator'));
const DevTools = React.lazy(() => import('../apps/DevTools'));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppRegistry: Record<string, React.ComponentType<any>> = {
  'Notepad': Notepad,
  'Calculator': Calculator,
  'Terminal': Terminal,
  'File Explorer': FileExplorer,
  'Media Player': MediaPlayer,
  'Browser': Browser,
  'VS Code': CodeEditor,
  'Performance': Performance,
  'JS Console': JSConsole,
  'Project Viewer': ProjectViewer,
  'Project Navigator': ProjectNavigator,
  'DevTools': DevTools,
};

export const AppMetadata = {
  'File Explorer': { title: 'File Explorer', icon: '/assets/icons/folder.svg' },
  'Browser': { title: 'Browser', icon: '/assets/icons/edge.svg' },
  'VS Code': { title: 'Code Editor', icon: '/assets/icons/vscode.svg' },
  'Notepad': { title: 'Notepad', icon: '/assets/icons/notepad.svg' },
  'Calculator': { title: 'Calculator', icon: '/assets/icons/calculator.svg' },
  'Terminal': { title: 'Terminal', icon: '/assets/icons/terminal.svg' },
  'Media Player': { title: 'Media Player', icon: '/assets/icons/media-player.svg' },
  'JS Console': { title: 'JS Console', icon: '/assets/icons/terminal.svg' },
  'Project Navigator': { title: 'Projects', icon: '/assets/icons/folder.svg' },
  'DevTools': { title: 'DevTools', icon: '/assets/icons/terminal.svg' }, // Reusing terminal icon for now
};
