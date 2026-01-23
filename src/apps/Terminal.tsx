import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import styled from 'styled-components';
import { fs, readdir, path as pathModule, mkdir, writeFile, readFile, exists } from '../system/FileSystem';

const TerminalContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.background};
  padding: 5px;
  overflow: hidden;
`;

const TerminalApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const currentPathRef = useRef<string>('/Users/Roopesh');

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new XTerm({
      theme: {
        background: '#050510',
        foreground: '#00d8ff',
        cursor: '#00d8ff',
        selectionBackground: 'rgba(0, 216, 255, 0.3)',
      },
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
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

    let command = '';

    term.onData((data) => {
      const code = data.charCodeAt(0);
      
      if (code === 13) { // Enter
        term.writeln('');
        processCommand(command);
        command = '';
      } else if (code === 127) { // Backspace
        if (command.length > 0) {
          command = command.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        command += data;
        term.write(data);
      }
    });

    const processCommand = async (cmd: string) => {
      const parts = cmd.trim().split(' ');
      const c = parts[0].toLowerCase();
      const args = parts.slice(1);
      
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
            term.writeln('Available commands: help, clear, echo, ls, cd, pwd, mkdir, touch, rm, cat, neofetch, whoami, github, contact');
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
              const files = await readdir(currentPathRef.current);
              files.forEach(f => term.writeln(f));
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
               const doesExist = await exists(target);
               if (doesExist) {
                 // Check if directory
                 // fs.stat is async but we need to check if it's dir. Simplified for now.
                 currentPathRef.current = target;
               } else {
                 term.writeln(`cd: no such file or directory: ${args[0]}`);
               }
            }
            break;
          case 'mkdir':
             if (!args[0]) {
               term.writeln('mkdir: missing operand');
             } else {
               const target = pathModule.resolve(currentPathRef.current, args[0]);
               await mkdir(target);
             }
             break;
          case 'touch':
             if (!args[0]) {
               term.writeln('touch: missing operand');
             } else {
               const target = pathModule.resolve(currentPathRef.current, args[0]);
               await writeFile(target, '');
             }
             break;
          case 'rm':
             if (!args[0]) {
               term.writeln('rm: missing operand');
             } else {
                const target = pathModule.resolve(currentPathRef.current, args[0]);
                // Simplified unlink (fs.unlink)
                // @ts-expect-error fs types mismatch
                fs.unlink(target, (err: any) => {
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
                 const content = await readFile(target);
                 term.writeln(content);
               } catch (e) {
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
  }, []);

  return <TerminalContainer ref={containerRef} />;
};

export default TerminalApp;
