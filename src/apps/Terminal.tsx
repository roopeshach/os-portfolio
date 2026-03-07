/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import styled, { useTheme } from 'styled-components';
import { fs, readdir, path as pathModule, mkdir, writeFile, readFile } from '../system/FileSystem';

const TerminalContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #1a1a2e;
  padding: 5px;
  overflow: hidden;
  border: 3px solid #000;
`;

const TerminalApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const currentPathRef = useRef<string>('/Users/Roopesh');
  const commandRef = useRef<string>('');
  const cursorRef = useRef<number>(0);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const theme = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new XTerm({
      theme: {
        background: theme.colors.background,
        foreground: theme.colors.text,
        cursor: theme.colors.accent,
        selectionBackground: `${theme.colors.accent}4D`, // 30% opacity
        black: '#000000',
        red: '#cc0000',
        green: '#4e9a06',
        yellow: '#c4a000',
        blue: '#3465a4',
        magenta: '#75507b',
        cyan: '#06989a',
        white: '#d3d7cf',
        brightBlack: '#555753',
        brightRed: '#ef2929',
        brightGreen: '#8ae234',
        brightYellow: '#fce94f',
        brightBlue: '#729fcf',
        brightMagenta: '#ad7fa8',
        brightCyan: '#34e2e2',
        brightWhite: '#eeeeec'
      },
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      convertEol: true, // Treat \n as \r\n
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    
    setTimeout(() => {
      if (containerRef.current && containerRef.current.offsetParent !== null) {
         try {
           fitAddon.fit();
         } catch (e) {
           console.warn("Terminal fit failed", e);
         }
      }
    }, 100);

    const prompt = () => `\x1b[1;34m${currentPathRef.current}\x1b[0m $ `;

    term.writeln('\x1b[1;36mRoopesh OS Terminal [Version 0.0.1]\x1b[0m');
    term.writeln('(c) 2026 Roopesh Acharya. All rights reserved.');
    term.writeln('Type "help" for available commands.');
    term.writeln('');
    term.write(prompt());

    term.attachCustomKeyEventHandler((ev: KeyboardEvent) => {
      const isMod = ev.metaKey || ev.ctrlKey;
      const key = ev.key.toLowerCase();

      if (isMod && key === 's') {
        ev.preventDefault();
        return false;
      }

      if (isMod && key === 'a') {
        ev.preventDefault();
        term.selectAll();
        return false;
      }

      if (isMod && key === 'c') {
        const selection = term.getSelection();
        if (selection) {
          ev.preventDefault();
          void navigator.clipboard?.writeText(selection);
          return false;
        }
      }

      if (isMod && key === 'v') {
        ev.preventDefault();
        void navigator.clipboard?.readText().then((text) => {
          if (!text) return;
          const left = commandRef.current.slice(0, cursorRef.current);
          const right = commandRef.current.slice(cursorRef.current);
          commandRef.current = left + text + right;
          cursorRef.current += text.length;
          refreshLine();
        });
        return false;
      }

      return true;
    });

    const refreshLine = () => {
       // Move cursor to start of line (after prompt)
       // We can't easily jump to absolute column without knowing prompt length stripping ANSI
       // Simplest: clear line, write prompt + buffer
       term.write('\x1b[2K\r'); // Clear line and return carriage
       term.write(prompt() + commandRef.current);
       
       // Move cursor to correct position
       const diff = commandRef.current.length - cursorRef.current;
       if (diff > 0) {
           term.write(`\x1b[${diff}D`);
       }
    };

    term.onData(async (data) => {
      const code = data.charCodeAt(0);
      
      // Enter
      if (code === 13) { 
        term.writeln('');
        const cmd = commandRef.current;
        if (cmd.trim().length > 0) {
           historyRef.current.push(cmd);
           historyIndexRef.current = historyRef.current.length;
        }
        await processCommand(cmd);
        commandRef.current = '';
        cursorRef.current = 0;
        // Prompt is written by processCommand
      } 
      // Backspace
      else if (code === 127) { 
        if (cursorRef.current > 0) {
          const left = commandRef.current.slice(0, cursorRef.current - 1);
          const right = commandRef.current.slice(cursorRef.current);
          commandRef.current = left + right;
          cursorRef.current--;
          refreshLine();
        }
      } 
      // Arrow Keys (ANSI sequences)
      else if (data === '\x1b[A') { // Up
        if (historyIndexRef.current > 0) {
            historyIndexRef.current--;
            commandRef.current = historyRef.current[historyIndexRef.current];
            cursorRef.current = commandRef.current.length;
            refreshLine();
        }
      }
      else if (data === '\x1b[B') { // Down
        if (historyIndexRef.current < historyRef.current.length - 1) {
            historyIndexRef.current++;
            commandRef.current = historyRef.current[historyIndexRef.current];
            cursorRef.current = commandRef.current.length;
            refreshLine();
        } else {
            historyIndexRef.current = historyRef.current.length;
            commandRef.current = '';
            cursorRef.current = 0;
            refreshLine();
        }
      }
      else if (data === '\x1b[D') { // Left
        if (cursorRef.current > 0) {
            cursorRef.current--;
            term.write('\x1b[D');
        }
      }
      else if (data === '\x1b[C') { // Right
        if (cursorRef.current < commandRef.current.length) {
            cursorRef.current++;
            term.write('\x1b[C');
        }
      }
      // Tab Autocomplete
      else if (code === 9) {
          // Prevent default tab behavior if possible (browser might trap it, but here we get raw char)
          // Simple autocomplete: last word
          const parts = commandRef.current.split(' ');
          const lastWord = parts[parts.length - 1];
          if (lastWord.length > 0) {
             try {
                const files = await readdir(currentPathRef.current);
                const matches = files.filter(f => f.startsWith(lastWord));
                if (matches.length === 1) {
                    const completed = matches[0];
                    const rest = completed.slice(lastWord.length);
                    commandRef.current += rest;
                    cursorRef.current += rest.length;
                    refreshLine();
                } else if (matches.length > 1) {
                    term.writeln('');
                    term.writeln(matches.join('  '));
                    term.write(prompt() + commandRef.current);
                    // restore cursor? refreshLine handles it but we just printed prompt
                    const diff = commandRef.current.length - cursorRef.current;
                    if (diff > 0) term.write(`\x1b[${diff}D`);
                }
             } catch {
                 // ignore
             }
          }
      }
      // Regular printable characters
      else if (code >= 32 && code !== 127 && data.length === 1) {
        const left = commandRef.current.slice(0, cursorRef.current);
        const right = commandRef.current.slice(cursorRef.current);
        commandRef.current = left + data + right;
        cursorRef.current++;
        refreshLine();
      }
    });

    // Parse command arguments, handling quoted strings with spaces
    const parseArgs = (input: string): string[] => {
      const args: string[] = [];
      let current = '';
      let inQuote = false;
      let quoteChar = '';
      
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        
        if ((char === '"' || char === "'") && !inQuote) {
          inQuote = true;
          quoteChar = char;
        } else if (char === quoteChar && inQuote) {
          inQuote = false;
          quoteChar = '';
        } else if (char === ' ' && !inQuote) {
          if (current.length > 0) {
            args.push(current);
            current = '';
          }
        } else {
          current += char;
        }
      }
      
      if (current.length > 0) {
        args.push(current);
      }
      
      return args;
    };

    const processCommand = async (cmd: string) => {
      const parts = parseArgs(cmd.trim());
      const c = parts[0]?.toLowerCase() || '';
      const args = parts.slice(1);

      const statPath = async (p: string) => {
        return await new Promise<any>((resolve) => {
          (fs as any).stat(p, (err: any, s: any) => resolve(err ? null : s));
        });
      };
      
      try {
        switch (c) {
          case 'neofetch':
            term.writeln(`
       \x1b[38;2;255;0;255m/\\     \x1b[38;2;0;255;255m/\\      \x1b[1;37mUser:\x1b[0m \x1b[38;2;255;255;0mroot@roopesh-pc\x1b[0m
      \x1b[38;2;255;0;255m/  \\   \x1b[38;2;0;255;255m/  \\     \x1b[1;37mOS:\x1b[0m   \x1b[38;2;0;255;255mRoopeshOS Pro v0.0.1\x1b[0m
     \x1b[38;2;255;0;255m/ /\\ \\ \x1b[38;2;0;255;255m/ /\\ \\    \x1b[1;37mHost:\x1b[0m Web Assembly / V8
    \x1b[38;2;255;0;255m/ /  \\ \\ \x1b[38;2;0;255;255m/ /  \\ \\   \x1b[1;37mUptime:\x1b[0m ${(performance.now() / 60000).toFixed(2)} mins
   \x1b[38;2;255;0;255m/ /    \\ \\ \x1b[38;2;0;255;255m/ /    \\ \\  \x1b[1;37mResolution:\x1b[0m ${window.screen.width}x${window.screen.height}
  \x1b[38;2;255;0;255m/ /      \\ \\ \x1b[38;2;0;255;255m/ /      \\ \\ \x1b[1;37mShell:\x1b[0m ZSH (Emulated)
 \x1b[38;2;255;0;255m/_/        \\_\\ \x1b[38;2;0;255;255m/_/        \\_\\\x1b[1;37mTheme:\x1b[0m Glassmorphism Fire
                                \x1b[1;37mCPU:\x1b[0m  Client Side Rendering
   \x1b[41m   \x1b[42m   \x1b[43m   \x1b[44m   \x1b[45m   \x1b[46m   \x1b[0m     \x1b[1;37mMemory:\x1b[0m Infinite Virtual RAM
`);
            break;
          case 'help':
            term.writeln('Available commands: help, clear, echo, ls, cd, pwd, mkdir, touch, rm, cat, neofetch, whoami, github, contact, date, history, cp, mv');
            term.writeln('Shortcuts: Cmd/Ctrl+C copy selection, Cmd/Ctrl+V paste, Cmd/Ctrl+A select all');
            break;
          case 'clear':
          case 'cls':
            term.clear();
            break;
          case 'echo':
            term.writeln(args.join(' '));
            break;
          case 'pwd':
            term.writeln(currentPathRef.current);
            break;
          case 'ls':
          case 'dir':
            try {
              const targetPath = args[0] ? pathModule.resolve(currentPathRef.current, args[0]) : currentPathRef.current;
              const targetStats = await statPath(targetPath);

              if (!targetStats) {
                term.writeln(`ls: cannot access '${args[0] || currentPathRef.current}': No such file or directory`);
                break;
              }

              if (!targetStats.isDirectory()) {
                term.writeln(pathModule.basename(targetPath));
                break;
              }

              const files = await readdir(targetPath);
              // Colorize directories (mock check for now as readdir returns strings)
              // Ideally we check stat for each, but for speed we might skip or do async
              // Let's do a quick stat
              const coloredFiles = await Promise.all(files.map(async f => {
                 try {
                   const s = await new Promise<any>(r => fs.stat(pathModule.join(targetPath, f), (...args: any[]) => r(args[1])));
                   return s?.isDirectory() ? `\x1b[1;34m${f}\x1b[0m` : f;
                 } catch { return f; }
              }));
              term.writeln(coloredFiles.join('  '));
            } catch {
              term.writeln(`ls: cannot access '${currentPathRef.current}': No such file or directory`);
            }
            break;
          case 'cd':
            if (!args[0]) {
               currentPathRef.current = '/Users/Roopesh';
            } else if (args[0] === '..') {
               currentPathRef.current = pathModule.dirname(currentPathRef.current);
            } else {
               const target = pathModule.resolve(currentPathRef.current, args[0]);
               const stats = await statPath(target);
               if (!stats) {
                 term.writeln(`cd: no such file or directory: ${args[0]}`);
               } else if (stats.isDirectory()) {
                 currentPathRef.current = target;
               } else {
                 currentPathRef.current = pathModule.dirname(target);
                 term.writeln(`cd: '${args[0]}' is a file, switched to parent directory.`);
               }
            }
            break;
          case 'mkdir':
             if (!args[0]) {
               term.writeln('mkdir: missing operand');
             } else {
               const target = pathModule.resolve(currentPathRef.current, args[0]);
               const s = await statPath(target);
               if (s) {
                 term.writeln(`mkdir: cannot create directory '${args[0]}': File exists`);
                 break;
               }
               await mkdir(target);
             }
             break;
          case 'touch':
             if (!args[0]) {
               term.writeln('touch: missing operand');
             } else {
               const target = pathModule.resolve(currentPathRef.current, args[0]);
               const s = await statPath(target);
               if (s?.isDirectory()) {
                 term.writeln(`touch: cannot touch '${args[0]}': Is a directory`);
                 break;
               }
               await writeFile(target, '');
             }
             break;
          case 'rm':
             if (!args[0]) {
               term.writeln('rm: missing operand');
             } else {
                const target = pathModule.resolve(currentPathRef.current, args[0]);
               (fs as any).unlink(target, (err: any) => {
                   if (err) term.writeln(`rm: cannot remove '${args[0]}': ${err.message}`);
                });
             }
             break;
          case 'cat':
             if (!args[0]) {
               term.writeln('cat: missing operand');
             } else {
               const target = pathModule.resolve(currentPathRef.current, args[0]);
               try {
                 const s = await statPath(target);
                 if (s?.isDirectory()) {
                   term.writeln(`cat: ${args[0]}: Is a directory`);
                   break;
                 }
                 const content = await readFile(target);
                 term.writeln(content);
               } catch {
                 term.writeln(`cat: ${args[0]}: No such file or directory`);
               }
             }
             break;
          case 'whoami':
            term.writeln('root\\roopesh');
            break;
          case 'github':
            window.open('https://github.com/roopeshach', '_blank');
            term.writeln('Opening GitHub...');
            break;
          case 'contact':
            term.writeln('Email: roopesh@example.com');
            term.writeln('LinkedIn: https://linkedin.com/in/rupeshach');
            break;
          case 'date':
            term.writeln(new Date().toString());
            break;
          case 'history':
            historyRef.current.forEach((cmd, i) => {
                term.writeln(` ${i + 1}  ${cmd}`);
            });
            break;
          case '':
            break;
          default:
            term.writeln(`zsh: command not found: ${c}`);
        }
      } catch (e: any) {
        term.writeln(`Error: ${e.message}`);
      }
      
      term.write(prompt());
    };

    termRef.current = term;

    const handleResize = () => {
       if (containerRef.current && containerRef.current.offsetParent !== null) {
          try {
             fitAddon.fit();
          } catch (e) {
             console.warn("Resize fit failed", e);
          }
       }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [theme.colors.accent, theme.colors.background, theme.colors.text]);

  return <TerminalContainer ref={containerRef} />;
};

export default TerminalApp;