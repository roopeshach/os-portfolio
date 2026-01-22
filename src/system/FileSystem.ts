import * as BrowserFS from 'browserfs';

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
    fs.writeFile(path, content, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Helper to read file (async)
export const readFile = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    fs.readFile(path, 'utf8', (err: any, data: any) => {
      if (err) reject(err);
      else resolve(data as string);
    });
  });
};

// Helper to create directory (async)
export const mkdir = (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err: any) => {
      // Ignore EEXIST
      if (err && err.code !== 'EEXIST') reject(err);
      else resolve();
    });
  });
};

// Helper to read directory
export const readdir = (path: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    fs.readdir(path, (err: any, files: any) => {
      if (err) reject(err);
      else resolve(files as string[]);
    });
  });
};
