import { useState } from "react";
import {
  Plus,
  FileText,
  X,
  Trash2,
  MoreHorizontal,
  PanelLeftClose,
  FolderOpen,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function DashboardSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const { 
    currentVault,
    vaults,
    files, 
    currentFile, 
    loadFile,
    createFile,
    deleteFile,
    openVault,
  } = useWorkspace();
  
  const [deleteTarget, setDeleteTarget] = useState<{ path: string; name: string } | null>(null);
  const [showNewNoteInput, setShowNewNoteInput] = useState(false);
  const [newNoteName, setNewNoteName] = useState('');

  const handleCreateNote = async () => {
    if (!newNoteName.trim()) return;
    
    try {
      await createFile(newNoteName);
      setNewNoteName('');
      setShowNewNoteInput(false);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleDeleteNote = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFile(deleteTarget.path);
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const sortedFiles = [...files].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  if (collapsed && !mobileOpen) {
    return (
      <div className="hidden md:flex w-16 border-r border-border bg-sidebar-background flex-col items-center py-4 gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-10 w-10"
        >
          <FolderOpen className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar-background">
      {/* Header with Vault Dropdown */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 hover:bg-sidebar-accent px-2 py-1 h-auto font-semibold text-sidebar-foreground"
            >
              <FolderOpen className="h-4 w-4" />
              <span className="truncate max-w-[140px]">
                {currentVault?.name || 'Vault'}
              </span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <div className="px-2 py-1.5 text-sm font-semibold">
              Current Vault
            </div>
            <DropdownMenuItem disabled className="text-xs text-muted-foreground truncate">
              {currentVault?.path}
            </DropdownMenuItem>
            
            {vaults.length > 1 && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Other Vaults
                </div>
                {vaults
                  .filter(v => v.id !== currentVault?.id)
                  .map((vault) => (
                    <DropdownMenuItem
                      key={vault.id}
                      onClick={() => openVault(vault.id)}
                    >
                      <FolderOpen className="h-4 w-4 mr-2" />
                      <span className="truncate">{vault.name}</span>
                    </DropdownMenuItem>
                  ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden md:flex h-8 w-8 text-sidebar-foreground hover:text-sidebar-primary"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="md:hidden h-8 w-8 text-sidebar-foreground hover:text-sidebar-primary"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="border-b border-sidebar-border px-3 py-3">
        {showNewNoteInput ? (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Note name..."
              value={newNoteName}
              onChange={(e) => setNewNoteName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateNote();
                if (e.key === 'Escape') {
                  setShowNewNoteInput(false);
                  setNewNoteName('');
                }
              }}
              autoFocus
              className="h-8"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateNote}
                size="sm"
                className="flex-1"
              >
                Create
              </Button>
              <Button
                onClick={() => {
                  setShowNewNoteInput(false);
                  setNewNoteName('');
                }}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setShowNewNoteInput(true)}
            className="w-full justify-start gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        )}
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {sortedFiles.length === 0 ? (
          <div className="px-2 py-8 text-center text-sm text-sidebar-foreground/60">
            No notes yet. Create one to get started!
          </div>
        ) : (
          <div className="space-y-1">
            {sortedFiles.map((file) => (
              <div
                key={file.path}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors cursor-pointer",
                  currentFile === file.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
                onClick={() => loadFile(file.path)}
              >
                <FileText className="h-4 w-4 shrink-0 text-sidebar-foreground/60" />
                <div className="flex-1 overflow-hidden">
                  <div className="truncate font-medium">
                    {file.name.replace('.md', '')}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({ path: file.path, name: file.name });
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-2">
        <div className="text-xs text-sidebar-foreground/60 truncate">
          {files.length} {files.length === 1 ? 'note' : 'notes'}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  if (!mobileOpen) {
    return (
      <div className="hidden md:flex w-64 border-r border-border">
        <SidebarContent />
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
        onClick={onMobileClose}
      />
      <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
        <SidebarContent />
      </div>
    </>
  );
}
