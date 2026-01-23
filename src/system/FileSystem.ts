import * as BrowserFS from 'browserfs';
import type { ErrnoException } from '../types/filesystem';

export const initFileSystem = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    BrowserFS.configure({
      fs: "MountableFileSystem",
      options: {
        "/": { fs: "IndexedDB", options: { storeName: "portfolio-os" } },
      }
    }, (e) => {
      if (e) {
        console.error("Failed to initialize FS:", e);
        reject(e);
      } else {
        console.log("Filesystem initialized");
        resolve();
      }
    });
  });
};

// Export fs and path modules
export const fs = BrowserFS.BFSRequire('fs');
export const path = BrowserFS.BFSRequire('path');

// Helper to check if file exists (async)
export const exists = (path: string): Promise<boolean> => {
  return new Promise((resolve) => {
    fs.exists(path, (exists: boolean) => resolve(exists));
  });
};

// Helper to write file (async)
export const writeFile = (path: string, content: string | Buffer): Promise<void> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fs.writeFile(path, content, (err: any) => {
      if (err) reject(err as ErrnoException);
      else resolve();
    });
  });
};

// Helper to read file (async)
export const readFile = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // @ts-expect-error - fs.readFile types might not align perfectly with browserfs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fs.readFile(path, 'utf8', (err: any, data: string) => {
      if (err) reject(err as ErrnoException);
      else resolve(data);
    });
  });
};

// Helper to create directory (async)
export const mkdir = (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fs.mkdir(path, (err: any) => {
      // Ignore EEXIST
      if (err && err.code !== 'EEXIST') reject(err as ErrnoException);
      else resolve();
    });
  });
};

// Helper to read directory
export const readdir = (path: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    // @ts-expect-error - fs.readdir types might not align perfectly with browserfs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fs.readdir(path, (err: any, files: string[]) => {
      if (err) reject(err as ErrnoException);
      else resolve(files);
    });
  });
};

// Helper to delete file (async)
export const unlink = (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fs.unlink(path, (err: any) => {
      if (err) reject(err as ErrnoException);
      else resolve();
    });
  });
};
