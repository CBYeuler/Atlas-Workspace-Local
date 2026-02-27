import { contextBridge, ipcRenderer } from 'electron';

// Expose safe IPC methods to renderer
contextBridge.exposeInMainWorld('api', {
  selectWorkspace: () => ipcRenderer.invoke('select-workspace'),
  readWorkspace: (workspacePath: string) => ipcRenderer.invoke('read-workspace', workspacePath),
  readFile: (filepath: string) => ipcRenderer.invoke('read-file', filepath),
  saveFile: (filepath: string, content: string) => ipcRenderer.invoke('save-file', filepath, content),
  createFile: (folderPath: string, filename: string) => ipcRenderer.invoke('create-file', folderPath, filename)
});
