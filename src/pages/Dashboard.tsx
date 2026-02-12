import { useState } from "react";
import { LogOut, Menu, FileText, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import NoteEditor from "@/components/dashboard/NoteEditor";
import { useNotes } from "@/hooks/use-notes";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { data: notes = [], isLoading } = useNotes();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 h-screen">
        {/* Top bar */}
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
            <span className="hidden sm:inline text-sm text-muted-foreground">{user?.email}</span>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {selectedNote ? (
            <NoteEditor key={selectedNote.id} note={selectedNote} />
          ) : (
            <div className="flex flex-1 items-center justify-center h-full px-6">
              <div className="text-center space-y-4 animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {notes.length === 0
                    ? "Create your first note to get started"
                    : "Select a note to view"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {notes.length === 0
                    ? 'Click "New Note" in the sidebar to begin.'
                    : "Pick a note from the sidebar or create a new one."}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
