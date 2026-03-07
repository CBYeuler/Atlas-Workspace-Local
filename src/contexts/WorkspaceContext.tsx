import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface Vault {
  id: string;
  name: string;
  path: string;
  lastOpened: string;
  created: string;
}

interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

interface WorkspaceContextType {
  vaults: Vault[];
  currentVault: Vault | null;
  files: FileItem[];
  currentFile: string | null;
  currentContent: string;
  loadVaults: () => Promise<void>;
  createVault: (name: string) => Promise<void>;
  openVault: (id: string) => Promise<void>;
  deleteVault: (id: string) => Promise<void>;
  loadFile: (path: string) => Promise<void>;
  saveFile: (path: string, content: string) => Promise<void>;
  createFile: (filename: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [currentVault, setCurrentVault] = useState<Vault | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState<string>('');

  // Load vaults on mount
  const loadVaults = useCallback(async () => {
    try {
      const allVaults = await window.api.getVaults();
      setVaults(allVaults);
    } catch (error) {
      console.error('Error loading vaults:', error);
    }
  }, []);

  useEffect(() => {
    loadVaults();
  }, [loadVaults]);

  const createVault = useCallback(async (name: string) => {
    try {
      const newVault = await window.api.createVault(name);
      await loadVaults();
      await openVault(newVault.id);
    } catch (error) {
      console.error('Error creating vault:', error);
      throw error;
    }
  }, [loadVaults]);

  const openVault = useCallback(async (id: string) => {
    try {
      const result = await window.api.openVault(id);
      setCurrentVault(result.vault);
      setFiles(result.files);
      setCurrentFile(null);
      setCurrentContent('');
      await loadVaults(); // Refresh vault list
    } catch (error) {
      console.error('Error opening vault:', error);
      throw error;
    }
  }, [loadVaults]);

  const deleteVault = useCallback(async (id: string) => {
    try {
      await window.api.deleteVault(id);
      if (currentVault?.id === id) {
        setCurrentVault(null);
        setFiles([]);
        setCurrentFile(null);
        setCurrentContent('');
      }
      await loadVaults();
    } catch (error) {
      console.error('Error deleting vault:', error);
      throw error;
    }
  }, [currentVault, loadVaults]);

  const loadFile = useCallback(async (path: string) => {
    if (!path) {
      setCurrentFile(null);
      setCurrentContent('');
      return;
    }
    
    try {
      const content = await window.api.readFile(path);
      setCurrentFile(path);
      setCurrentContent(content);
    } catch (error) {
      console.error('Error loading file:', error);
      throw error;
    }
  }, []);

  const saveFile = useCallback(async (path: string, content: string) => {
    try {
      await window.api.saveFile(path, content);
      setCurrentContent(content);
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }, []);

  const createFile = useCallback(async (filename: string) => {
    if (!currentVault) return;
    
    try {
      const filepath = await window.api.createFile(currentVault.path, filename);
      // Refresh files
      const result = await window.api.openVault(currentVault.id);
      setFiles(result.files);
      // Load the new file
      await loadFile(filepath);
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }, [currentVault, loadFile]);

  const deleteFile = useCallback(async (path: string) => {
    if (!currentVault) return;
    
    try {
      await window.api.deleteFile(path);
      if (currentFile === path) {
        setCurrentFile(null);
        setCurrentContent('');
      }
      // Refresh files
      const result = await window.api.openVault(currentVault.id);
      setFiles(result.files);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }, [currentVault, currentFile]);

  return (
    <WorkspaceContext.Provider
      value={{
        vaults,
        currentVault,
        files,
        currentFile,
        currentContent,
        loadVaults,
        createVault,
        openVault,
        deleteVault,
        loadFile,
        saveFile,
        createFile,
        deleteFile,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
}
