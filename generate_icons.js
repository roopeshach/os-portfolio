import fs from 'fs';
import path from 'path';

const icons = {
  'folder.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fcd12a"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>',
  'notepad.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4a90e2"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>',
  'terminal.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#333"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.5 15l-1.41-1.41L8.67 11l-2.58-2.59L7.5 7l4 4-4 4zm11.5 0h-6v-2h6v2z"/></svg>',
  'calculator.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e74c3c"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 16h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2z"/></svg>',
  'edge.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0078d7"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.92 5.77 20 8.65 20 12c0 2.08-.81 3.98-2.11 5.4z"/></svg>',
  'media-player.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9b59b6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>',
  'vscode.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0078d7"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
};

const dir = 'public/assets/icons';

for (const [name, content] of Object.entries(icons)) {
  fs.writeFileSync(path.join(dir, name), content);
  console.log(`Generated ${name}`);
}
