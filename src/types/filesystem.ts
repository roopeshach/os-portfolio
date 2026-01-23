export interface Stats {
  isFile(): boolean;
  isDirectory(): boolean;
  size: number;
  mtime: Date;
  atime: Date;
  ctime: Date;
}

export interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
}

export type FileSystemCallback<T = void> = (err: ErrnoException | null, result?: T) => void;
