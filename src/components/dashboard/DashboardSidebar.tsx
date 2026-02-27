import { useState } from "react";
import {
  Plus,
  FolderPlus,
  FileText,
  ChevronRight,
  ChevronDown,
  Folder as FolderIcon,
  X,
  Trash2,
  Pencil,
  MoreHorizontal,
  FolderInput,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useNotes,
  useFolders,
  useCreateNote,
  useCreateFolder,
  useDeleteNote,
  useDeleteFolder,
  useRenameFolder,
  useUpdateNote,
  Note,
  Folder,
} from "@/hooks/use-notes";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedNoteId: string | null;
  onSelectNote: (id: string | null) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function DashboardSidebar({
  collapsed,
  onToggleCollapse,
  selectedNoteId,
  onSelectNote,
  mobileOpen,
  onMobileClose,
}: DashboardSidebarProps) {
  const { data: notes = [], isLoading: notesLoading } = useNotes();
  const { data: folders = [], isLoading: foldersLoading } = useFolders();
  const createNote = useCreateNote();
  const createFolder = useCreateFolder();
  const deleteNote = useDeleteNote();
  const deleteFolder = useDeleteFolder();
  const renameFolder = useRenameFolder();
  const updateNote = useUpdateNote();

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ type: "note" | "folder"; id: string; name: string } | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");

  const isLoading = notesLoading || foldersLoading;

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    await createFolder.mutateAsync(name);
    setNewFolderName("");
    setShowNewFolder(false);
  };

  const handleCreateNote = async (folderId?: string | null) => {
    const note = await createNote.mutateAsync(folderId);
    onSelectNote(note.id);
    onMobileClose();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "note") {
      await deleteNote.mutateAsync(deleteTarget.id);
      if (selectedNoteId === deleteTarget.id) onSelectNote(null);
    } else {
      // Check if folder has notes
      const folderNotes = notes.filter((n) => n.folder_id === deleteTarget.id);
      if (folderNotes.length > 0) {
        // Move notes to root first
        for (const n of folderNotes) {
          await updateNote.mutateAsync({ id: n.id, folder_id: null });
        }
      }
      await deleteFolder.mutateAsync(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  const handleStartRenameFolder = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
  };

  const handleFinishRenameFolder = async () => {
    if (editingFolderId && editingFolderName.trim()) {
      await renameFolder.mutateAsync({ id: editingFolderId, name: editingFolderName.trim() });
    }
    setEditingFolderId(null);
    setEditingFolderName("");
  };

  const handleMoveNote = async (noteId: string, folderId: string | null) => {
    await updateNote.mutateAsync({ id: noteId, folder_id: folderId });
  };

  const notesInFolder = (folderId: string) => notes.filter((n) => n.folder_id === folderId);
  const unfolderedNotes = notes.filter((n) => !n.folder_id);

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border shrink-0">
        <span className="text-sm font-semibold tracking-wide uppercase text-sidebar-foreground/70">
          Workspace
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-7 w-7 text-sidebar-foreground/50 hover:text-sidebar-foreground"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-7 w-7 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            onClick={onMobileClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-1.5 px-3 py-3 shrink-0">
        <Button
          size="sm"
          className="justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => handleCreateNote()}
        >
          <Plus className="h-4 w-4" /> New Note
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="justify-start gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setShowNewFolder(true)}
        >
          <FolderPlus className="h-4 w-4" /> New Folder
        </Button>
      </div>

      {/* New folder input */}
      {showNewFolder && (
        <div className="px-3 pb-2 flex gap-1.5 animate-fade-in shrink-0">
          <Input
            autoFocus
            placeholder="Folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateFolder();
              if (e.key === "Escape") {
                setShowNewFolder(false);
                setNewFolderName("");
              }
            }}
            className="h-8 text-sm bg-sidebar-accent border-sidebar-border"
          />
          <Button size="sm" className="h-8 px-2" onClick={handleCreateFolder}>
            Add
          </Button>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-1 pb-4">
        {isLoading ? (
          <div className="space-y-2 px-3 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <>
            {/* Folders */}
            {folders.map((folder) => (
              <FolderSection
                key={folder.id}
                folder={folder}
                notes={notesInFolder(folder.id)}
                allFolders={folders}
                expanded={expandedFolders.has(folder.id)}
                onToggle={() => toggleFolder(folder.id)}
                selectedNoteId={selectedNoteId}
                onSelectNote={(id) => {
                  onSelectNote(id);
                  onMobileClose();
                }}
                onNewNote={() => handleCreateNote(folder.id)}
                onDeleteNote={(id, name) => setDeleteTarget({ type: "note", id, name })}
                onDeleteFolder={() => setDeleteTarget({ type: "folder", id: folder.id, name: folder.name })}
                onRenameFolder={() => handleStartRenameFolder(folder)}
                isEditing={editingFolderId === folder.id}
                editingName={editingFolderName}
                onEditingNameChange={setEditingFolderName}
                onFinishEditing={handleFinishRenameFolder}
                onMoveNote={handleMoveNote}
              />
            ))}

            {/* All Notes (unfoldered) */}
            <div className="mt-2">
              <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                All Notes
              </div>
              {unfolderedNotes.length === 0 && folders.length === 0 && notes.length === 0 && (
                <p className="px-3 py-4 text-xs text-sidebar-foreground/40 text-center">
                  No notes yet
                </p>
              )}
              {unfolderedNotes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  selected={selectedNoteId === note.id}
                  onSelect={() => {
                    onSelectNote(note.id);
                    onMobileClose();
                  }}
                  onDelete={() => setDeleteTarget({ type: "note", id: note.id, name: note.title })}
                  folders={folders}
                  onMoveNote={handleMoveNote}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteTarget?.type === "note" ? "note" : "folder"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === "folder"
                ? `This will delete "${deleteTarget.name}". Notes inside will be moved to All Notes.`
                : `This will permanently delete "${deleteTarget?.name}".`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground h-screen sticky top-0 transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
          collapsed ? "w-0 border-r-0" : "w-[280px]"
        )}
      >
        {!collapsed && sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-[280px] flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

/* ---------- Sub-components ---------- */

function FolderSection({
  folder,
  notes,
  allFolders,
  expanded,
  onToggle,
  selectedNoteId,
  onSelectNote,
  onNewNote,
  onDeleteNote,
  onDeleteFolder,
  onRenameFolder,
  isEditing,
  editingName,
  onEditingNameChange,
  onFinishEditing,
  onMoveNote,
}: {
  folder: Folder;
  notes: Note[];
  allFolders: Folder[];
  expanded: boolean;
  onToggle: () => void;
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  onDeleteNote: (id: string, name: string) => void;
  onDeleteFolder: () => void;
  onRenameFolder: () => void;
  isEditing: boolean;
  editingName: string;
  onEditingNameChange: (name: string) => void;
  onFinishEditing: () => void;
  onMoveNote: (noteId: string, folderId: string | null) => void;
}) {
  return (
    <div className="mt-1">
      <div className="group flex w-full items-center gap-1 rounded-md px-2 hover:bg-sidebar-accent transition-colors">
        <button
          onClick={onToggle}
          className="flex flex-1 items-center gap-1.5 py-1.5 text-sm font-medium text-sidebar-foreground min-w-0"
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/50" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-sidebar-foreground/50" />
          )}
          <FolderIcon className="h-4 w-4 shrink-0 text-primary/70" />
          {isEditing ? (
            <Input
              autoFocus
              value={editingName}
              onChange={(e) => onEditingNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onFinishEditing();
                if (e.key === "Escape") onFinishEditing();
              }}
              onBlur={onFinishEditing}
              onClick={(e) => e.stopPropagation()}
              className="h-6 text-sm px-1 py-0 border-none bg-sidebar-accent focus-visible:ring-1"
            />
          ) : (
            <span className="truncate">{folder.name}</span>
          )}
        </button>
        <span className="text-[10px] text-sidebar-foreground/40 mr-1">{notes.length}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-sidebar-foreground/50 hover:text-sidebar-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-popover z-50">
            <DropdownMenuItem onClick={onRenameFolder}>
              <Pencil className="h-3.5 w-3.5 mr-2" /> Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDeleteFolder} className="text-destructive focus:text-destructive">
              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {expanded && (
        <div className="ml-4 border-l border-sidebar-border/60 pl-1 animate-fade-in">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              selected={selectedNoteId === note.id}
              onSelect={() => onSelectNote(note.id)}
              onDelete={() => onDeleteNote(note.id, note.title)}
              folders={allFolders}
              onMoveNote={onMoveNote}
            />
          ))}
          <button
            onClick={onNewNote}
            className="flex w-full items-center gap-1.5 rounded-md px-3 py-1 text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <Plus className="h-3 w-3" /> Add note
          </button>
        </div>
      )}
    </div>
  );
}

function NoteItem({
  note,
  selected,
  onSelect,
  onDelete,
  folders,
  onMoveNote,
}: {
  note: Note;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  folders: Folder[];
  onMoveNote: (noteId: string, folderId: string | null) => void;
}) {
  const timeAgo = formatDistanceToNow(new Date(note.updated_at), { addSuffix: true });

  return (
    <div
      className={cn(
        "group flex items-start gap-1 rounded-md px-2 py-1.5 text-left transition-colors cursor-pointer",
        selected
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60"
      )}
      onClick={onSelect}
    >
      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-foreground/40" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{note.title}</p>
        <p className="text-[11px] text-sidebar-foreground/40">{timeAgo}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-sidebar-foreground/50 hover:text-sidebar-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 bg-popover z-50">
          {folders.length > 0 && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FolderInput className="h-3.5 w-3.5 mr-2" /> Move to...
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-popover z-50">
                <DropdownMenuItem onClick={() => onMoveNote(note.id, null)}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> All Notes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {folders.map((f) => (
                  <DropdownMenuItem key={f.id} onClick={() => onMoveNote(note.id, f.id)}>
                    <FolderIcon className="h-3.5 w-3.5 mr-2" /> {f.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
