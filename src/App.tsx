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
    return <WorkspaceSelector />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <FileSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0 h-screen">
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
              {currentVault.name}
            </span>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <NoteEditor />
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
