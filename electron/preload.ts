import { contextBridge, ipcRenderer } from 'electron';

<<<<<<< HEAD
contextBridge.exposeInMainWorld('api', {
  // Vaults
  getVaults: () => ipcRenderer.invoke('get-vaults'),
  createVault: (name: string) => ipcRenderer.invoke('create-vault', name),
  openVault: (id: string) => ipcRenderer.invoke('open-vault', id),
  deleteVault: (id: string) => ipcRenderer.invoke('delete-vault', id),
  
  // Files
  readVault: (path: string) => ipcRenderer.invoke('read-vault', path),
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  saveFile: (path: string, content: string) => ipcRenderer.invoke('save-file', path, content),
  createFile: (vaultPath: string, filename: string) => ipcRenderer.invoke('create-file', vaultPath, filename),
  deleteFile: (path: string) => ipcRenderer.invoke('delete-file', path),
  
  // Export
  exportVault: (vaultPath: string) => ipcRenderer.invoke('export-vault', vaultPath),
  exportNote: (filepath: string) => ipcRenderer.invoke('export-note', filepath),
=======
// Expose safe IPC methods to renderer
contextBridge.exposeInMainWorld('api', {
  selectWorkspace: () => ipcRenderer.invoke('select-workspace'),
  readWorkspace: (workspacePath: string) => ipcRenderer.invoke('read-workspace', workspacePath),
  readFile: (filepath: string) => ipcRenderer.invoke('read-file', filepath),
  saveFile: (filepath: string, content: string) => ipcRenderer.invoke('save-file', filepath, content),
  createFile: (folderPath: string, filename: string) => ipcRenderer.invoke('create-file', folderPath, filename)
>>>>>>> 8602c60e7d725e8638f2b285398ff308c6a0d674
});
