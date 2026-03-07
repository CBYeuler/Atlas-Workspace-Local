import { app, BrowserWindow, ipcMain, dialog } from 'electron';
<<<<<<< HEAD
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

let mainWindow: BrowserWindow | null;

// Vault storage location
const VAULTS_DIR = path.join(app.getPath('home'), '.atlas-vaults');
const REGISTRY_FILE = path.join(VAULTS_DIR, 'registry.json');

interface Vault {
  id: string;
  name: string;
  path: string;
  lastOpened: string;
  created: string;
}

interface VaultRegistry {
  vaults: Vault[];
}

// Ensure vaults directory exists
function ensureVaultsDir() {
  if (!fs.existsSync(VAULTS_DIR)) {
    fs.mkdirSync(VAULTS_DIR, { recursive: true });
  }
}

// Load vault registry
function loadRegistry(): VaultRegistry {
  ensureVaultsDir();
  if (fs.existsSync(REGISTRY_FILE)) {
    const data = fs.readFileSync(REGISTRY_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return { vaults: [] };
}

// Save vault registry
function saveRegistry(registry: VaultRegistry) {
  ensureVaultsDir();
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2), 'utf-8');
}

// Scan directory for .md files
function scanDirectory(dirPath: string): any[] {
  const files: any[] = [];
  
  function scan(currentPath: string) {
    try {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scan(itemPath);
        } else if (item.endsWith('.md')) {
          files.push({
            name: item,
            path: itemPath,
            isDirectory: false,
          });
        }
      }
    } catch (error) {
      console.error('Error scanning directory:', error);
    }
  }
  
  scan(dirPath);
  return files;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL('http://localhost:5173');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

=======
import * as path from 'path';
import * as fs from 'fs/promises';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    backgroundColor: '#1a1a1a'
  });

  // Load Vite dev server in development, built files in production
  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows closed (except macOS)
>>>>>>> 8602c60e7d725e8638f2b285398ff308c6a0d674
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

<<<<<<< HEAD
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers

// Get all vaults
ipcMain.handle('get-vaults', async () => {
  const registry = loadRegistry();
  return registry.vaults;
});

// Create new vault
ipcMain.handle('create-vault', async (_, vaultName: string) => {
  const registry = loadRegistry();
  
  const vaultPath = path.join(VAULTS_DIR, vaultName.toLowerCase().replace(/\s+/g, '-'));
  
  // Create vault directory
  if (!fs.existsSync(vaultPath)) {
    fs.mkdirSync(vaultPath, { recursive: true });
  }
  
  const newVault: Vault = {
    id: randomUUID(),
    name: vaultName,
    path: vaultPath,
    lastOpened: new Date().toISOString(),
    created: new Date().toISOString(),
  };
  
  registry.vaults.push(newVault);
  saveRegistry(registry);
  
  return newVault;
});

// Open vault
ipcMain.handle('open-vault', async (_, vaultId: string) => {
  const registry = loadRegistry();
  const vault = registry.vaults.find((v) => v.id === vaultId);
  
  if (!vault) {
    throw new Error('Vault not found');
  }
  
  // Update last opened
  vault.lastOpened = new Date().toISOString();
  saveRegistry(registry);
  
  // Read files
  const files = scanDirectory(vault.path);
  
  return { vault, files };
});

// Delete vault
ipcMain.handle('delete-vault', async (_, vaultId: string) => {
  const registry = loadRegistry();
  const vaultIndex = registry.vaults.findIndex((v) => v.id === vaultId);
  
  if (vaultIndex === -1) {
    throw new Error('Vault not found');
  }
  
  const vault = registry.vaults[vaultIndex];
  
  // Delete vault directory
  if (fs.existsSync(vault.path)) {
    fs.rmSync(vault.path, { recursive: true, force: true });
  }
  
  registry.vaults.splice(vaultIndex, 1);
  saveRegistry(registry);
  
  return { success: true };
});

// Read vault files
ipcMain.handle('read-vault', async (_, vaultPath: string) => {
  return scanDirectory(vaultPath);
});

// Read file
ipcMain.handle('read-file', async (_, filepath: string) => {
  return fs.readFileSync(filepath, 'utf-8');
=======
// IPC Handlers

// Select workspace folder
ipcMain.handle('select-workspace', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select Workspace Folder'
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

// Read all .md files from workspace
ipcMain.handle('read-workspace', async (_, workspacePath: string) => {
  try {
    const files = await scanDirectory(workspacePath);
    return files;
  } catch (error) {
    console.error('Error reading workspace:', error);
    return [];
  }
});

// Read single file
ipcMain.handle('read-file', async (_, filepath: string) => {
  try {
    const content = await fs.readFile(filepath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
>>>>>>> 8602c60e7d725e8638f2b285398ff308c6a0d674
});

// Save file
ipcMain.handle('save-file', async (_, filepath: string, content: string) => {
<<<<<<< HEAD
  fs.writeFileSync(filepath, content, 'utf-8');
  return { success: true };
});

// Create file
ipcMain.handle('create-file', async (_, vaultPath: string, filename: string) => {
  const filepath = path.join(vaultPath, `${filename}.md`);
  fs.writeFileSync(filepath, '', 'utf-8');
  return filepath;
});

// Delete file
ipcMain.handle('delete-file', async (_, filepath: string) => {
  fs.unlinkSync(filepath);
  return { success: true };
});

// Export vault to external location
ipcMain.handle('export-vault', async (_, vaultPath: string) => {
  if (!mainWindow) return { success: false };
  
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
    title: 'Select Export Location',
  });
  
  if (result.canceled || !result.filePaths[0]) {
    return { success: false };
  }
  
  const exportPath = result.filePaths[0];
  const vaultName = path.basename(vaultPath);
  const targetPath = path.join(exportPath, vaultName);
  
  // Copy vault directory
  fs.cpSync(vaultPath, targetPath, { recursive: true });
  
  return { success: true, path: targetPath };
});

// Export single note
ipcMain.handle('export-note', async (_, filepath: string) => {
  if (!mainWindow) return { success: false };
  
  const filename = path.basename(filepath);
  
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Note',
    defaultPath: filename,
    filters: [{ name: 'Markdown', extensions: ['md'] }],
  });
  
  if (result.canceled || !result.filePath) {
    return { success: false };
  }
  
  const content = fs.readFileSync(filepath, 'utf-8');
  fs.writeFileSync(result.filePath, content, 'utf-8');
  
  return { success: true, path: result.filePath };
});
=======
  try {
    await fs.writeFile(filepath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
});

// Create new file
ipcMain.handle('create-file', async (_, folderPath: string, filename: string) => {
  try {
    const filepath = path.join(folderPath, `${filename}.md`);
    await fs.writeFile(filepath, '# New Note\n\n', 'utf-8');
    return filepath;
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
});

// Helper: Recursively scan directory for .md files
async function scanDirectory(dirPath: string): Promise<any[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files: any[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      const subFiles = await scanDirectory(fullPath);
      files.push(...subFiles);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push({
        name: entry.name,
        path: fullPath,
        isDirectory: false
      });
    }
  }

  return files;
}
>>>>>>> 8602c60e7d725e8638f2b285398ff308c6a0d674
