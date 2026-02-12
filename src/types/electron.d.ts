export interface ElectronAPI {
  selectWorkspace: () => Promise<string | null>;
  readWorkspace: (workspacePath: string) => Promise<FileItem[]>;
  readFile: (filepath: string) => Promise<string>;
  saveFile: (filepath: string, content: string) => Promise<{ success: boolean }>;
  createFile: (folderPath: string, filename: string) => Promise<string>;
}

export interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}
