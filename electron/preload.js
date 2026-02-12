"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
// Expose safe IPC methods to renderer
electron_1.contextBridge.exposeInMainWorld('api', {
    selectWorkspace: function () { return electron_1.ipcRenderer.invoke('select-workspace'); },
    readWorkspace: function (workspacePath) { return electron_1.ipcRenderer.invoke('read-workspace', workspacePath); },
    readFile: function (filepath) { return electron_1.ipcRenderer.invoke('read-file', filepath); },
    saveFile: function (filepath, content) { return electron_1.ipcRenderer.invoke('save-file', filepath, content); },
    createFile: function (folderPath, filename) { return electron_1.ipcRenderer.invoke('create-file', folderPath, filename); }
});
