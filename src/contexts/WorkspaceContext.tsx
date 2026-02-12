import React, { createContext, useContext, useState, useCallback } from 'react';

interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

interface WorkspaceContextType {
  workspacePath: string | null;
  files: FileItem[];
  currentFile: string | null;
  currentContent: string;
  setWorkspacePath: (path: string | null) => void;
  setFiles: (files: FileItem[]) => void;
  setCurrentFile: (path: string | null) => void;
  setCurrentContent: (content: string) => void;
  loadWorkspace: (path: string) => Promise<void>;
  loadFile: (path: string) => Promise<void>;
  saveFile: (path: string, content: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspacePath, setWorkspacePath] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState<string>('');

  const loadWorkspace = useCallback(async (path: string) => {
    setWorkspacePath(path);
    const workspaceFiles = await window.api.readWorkspace(path);
    setFiles(workspaceFiles);
  }, []);

  const loadFile = useCallback(async (path: string) => {
    if (!path) {
      setCurrentFile(null);
      setCurrentContent('');
      return;
    }
    
    const content = await window.api.readFile(path);
    setCurrentFile(path);
    setCurrentContent(content);
  }, []);

  const saveFile = useCallback(async (path: string, content: string) => {
    await window.api.saveFile(path, content);
    setCurrentContent(content);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        workspacePath,
        files,
        currentFile,
        currentContent,
        setWorkspacePath,
        setFiles,
        setCurrentFile,
        setCurrentContent,
        loadWorkspace,
        loadFile,
        saveFile,
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
