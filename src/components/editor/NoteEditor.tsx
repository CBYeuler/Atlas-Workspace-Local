import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Minus,
  Check,
  Loader2,
  Download,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import MermaidRenderer from "./MermaidRenderer";
import { exportAsMarkdown, exportAsPdf } from "@/lib/export-utils";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const lowlight = createLowlight(common);

const MERMAID_TEMPLATE = `graph TD
    A[Start] --> B[Process]
    B --> C[End]`;

export default function NoteEditor() {
  const { currentFile, currentContent, saveFile, loadFile } = useWorkspace();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filePathRef = useRef(currentFile);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  // Extract title from filename
  useEffect(() => {
    if (currentFile) {
      const filename = currentFile.split('/').pop() || '';
      const titleFromFile = filename.replace('.md', '').replace(/-/g, ' ');
      setTitle(titleFromFile);
      filePathRef.current = currentFile;
    }
  }, [currentFile]);

  const save = useCallback(
    (fields: { title?: string; content?: string }) => {
      if (!filePathRef.current) return;
      
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSaveStatus("saving");
      
      debounceRef.current = setTimeout(async () => {
        try {
          // If title changed, we need to rename the file
          if (fields.title && fields.title !== title) {
            // For now, just save content - file renaming can be added later
            await saveFile(filePathRef.current!, fields.content || currentContent);
          } else if (fields.content) {
            await saveFile(filePathRef.current!, fields.content);
          }
          
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus((s) => (s === "saved" ? "idle" : s)), 1500);
        } catch (error) {
          console.error('Error saving:', error);
          setSaveStatus("idle");
          toast({
            title: "Error saving note",
            description: "There was a problem saving your changes.",
            variant: "destructive",
          });
        }
      }, 2000);
    },
    [saveFile, currentContent, title, toast]
  );

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ codeBlock: false }),
        Underline,
        Highlight,
        Placeholder.configure({ placeholder: "Start writing..." }),
        CodeBlockLowlight.configure({ lowlight }),
      ],
      content: currentContent || "",
      onUpdate: ({ editor: e }) => {
        save({ content: e.getHTML() });
      },
      editorProps: {
        attributes: {
          class: "prose prose-sm sm:prose dark:prose-invert max-w-none focus:outline-none min-h-[60vh] px-1 py-2",
        },
      },
    },
    [currentFile]
  );

  // Update editor content when file changes
  useEffect(() => {
    if (editor && currentContent !== editor.getHTML()) {
      editor.commands.setContent(currentContent || "");
    }
  }, [currentContent, editor, currentFile]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    save({ title: newTitle });
  };

  const insertMermaidDiagram = () => {
    if (!editor) return;
    editor.chain().focus().insertContent(`<pre><code class="language-mermaid">${MERMAID_TEMPLATE}</code></pre>`).run();
  };

  const handleExportMarkdown = () => {
    if (!editor || !currentFile) return;
    exportAsMarkdown(title, editor.getHTML());
    toast({
      title: "Exported as Markdown",
      description: `${title}.md has been downloaded`,
    });
  };

  const handleExportPdf = async () => {
    if (!editor || !currentFile) return;
    try {
      await exportAsPdf(title, editor.getHTML(), editorContainerRef.current);
      toast({
        title: "Exported as PDF",
        description: `${title}.pdf has been downloaded`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting to PDF",
        variant: "destructive",
      });
    }
  };

  if (!editor || !currentFile) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "rounded p-2 transition-colors hover:bg-muted disabled:opacity-30",
        active && "bg-muted text-primary"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex h-full flex-col">
      {/* Title */}
      <div className="border-b border-border px-6 py-4">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="border-0 text-2xl font-bold focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          placeholder="Untitled Note"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border px-4 py-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-2 h-6 w-px bg-border" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-2 h-6 w-px bg-border" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-2 h-6 w-px bg-border" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <div className="mx-2 h-6 w-px bg-border" />

        <ToolbarButton onClick={insertMermaidDiagram} title="Insert Mermaid Diagram">
          <FileText className="h-4 w-4" />
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-2">
          {/* Save status */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {saveStatus === "saving" && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check className="h-3 w-3 text-green-500" />
                <span>Saved</span>
              </>
            )}
          </div>

          {/* Export dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportMarkdown}>
                <FileText className="mr-2 h-4 w-4" />
                Export as Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPdf}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Editor */}
      <div ref={editorContainerRef} className="flex-1 overflow-y-auto px-6 py-4">
        <MermaidRenderer>
          <EditorContent editor={editor} />
        </MermaidRenderer>
      </div>
    </div>
  );
}
