const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectWorkspace: () => ipcRenderer.invoke('select-workspace'),
  readWorkspace: (workspacePath) => ipcRenderer.invoke('read-workspace', workspacePath),
  readFile: (filepath) => ipcRenderer.invoke('read-file', filepath),
  saveFile: (filepath, content) => ipcRenderer.invoke('save-file', filepath, content),
  createFile: (folderPath, filename) => ipcRenderer.invoke('create-file', folderPath, filename),
  deleteFile: (filepath) => ipcRenderer.invoke('delete-file', filepath),
});
