<<<<<<< HEAD
import { WorkspaceProvider, useWorkspace } from './contexts/WorkspaceContext';
import WorkspaceSelector from './components/workspace/WorkspaceSelector';
import FileSidebar from './components/sidebar/FileSidebar';
import NoteEditor from './components/editor/NoteEditor';
import { Menu, PanelLeft, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from 'react';

function AppContent() {
  const { currentVault } = useWorkspace();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!currentVault) {
=======
import { useState } from "react";
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import WorkspaceSelector from './components/workspace/WorkspaceSelector';
import DashboardSidebar from './components/sidebar/FileSidebar';
import NoteEditor from './components/editor/NoteEditor';
import { useWorkspace } from './contexts/WorkspaceContext';
import { Menu, PanelLeft, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

function AppContent() {
  const { workspacePath, currentFile } = useWorkspace();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!workspacePath) {
>>>>>>> 8602c60e7d725e8638f2b285398ff308c6a0d674
    return <WorkspaceSelector />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
<<<<<<< HEAD
      <FileSidebar
=======
      {/* Sidebar */}
      <DashboardSidebar
>>>>>>> 8602c60e7d725e8638f2b285398ff308c6a0d674
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

<<<<<<< HEAD
      <div className="flex flex-1 flex-col min-w-0 h-screen">
=======
      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 h-screen">
        {/* Top bar */}
>>>>>>> 8602c60e7d725e8638f2b285398ff308c6a0d674
        <header className="flex items-center justify-between border-b border-border px-4 py-2 md:px-6 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 text-muted-foreground"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {sidebarCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex h-8 w-8 text-muted-foreground"
                onClick={() => setSidebarCollapsed(false)}
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-base font-semibold text-foreground truncate">
              Atlas Workspace
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[200px]">
<<<<<<< HEAD
              {currentVault.name}
=======
              {workspacePath?.split('/').pop()}
>>>>>>> 8602c60e7d725e8638f2b285398ff308c6a0d674
            </span>
            <ThemeToggle />
          </div>
        </header>

<<<<<<< HEAD
        <main className="flex-1 overflow-y-auto">
          <NoteEditor />
=======
        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {currentFile ? (
            <NoteEditor />
          ) : (
            <div className="flex flex-1 items-center justify-center h-full px-6">
              <div className="text-center space-y-4 animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  Select a note to view
                </h2>
                <p className="text-sm text-muted-foreground">
                  Pick a note from the sidebar or create a new one.
                </p>
              </div>
            </div>
          )}
>>>>>>> 8602c60e7d725e8638f2b285398ff308c6a0d674
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}

export default App;
