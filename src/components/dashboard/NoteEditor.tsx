import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from "@tiptap/react";
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
  GitBranch,
  Download,
  FileText,
  FileDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Note, useUpdateNote } from "@/hooks/use-notes";
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

interface NoteEditorProps {
  note: Note;
}

export default function NoteEditor({ note }: NoteEditorProps) {
  const updateNote = useUpdateNote();
  const { toast } = useToast();
  const [title, setTitle] = useState(note.title);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteIdRef = useRef(note.id);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    noteIdRef.current = note.id;
    setTitle(note.title);
    setSaveStatus("idle");
  }, [note.id, note.title]);

  const save = useCallback(
    (fields: { title?: string; content?: string }) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSaveStatus("saving");
      debounceRef.current = setTimeout(async () => {
        await updateNote.mutateAsync({ id: noteIdRef.current, ...fields });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus((s) => (s === "saved" ? "idle" : s)), 1500);
      }, 2000);
    },
    [updateNote]
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
      content: note.content || "",
      onUpdate: ({ editor: e }) => {
        save({ content: e.getHTML() });
      },
      editorProps: {
        attributes: {
          class: "prose prose-sm sm:prose dark:prose-invert max-w-none focus:outline-none min-h-[60vh] px-1 py-2",
        },
      },
    },
    [note.id]
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);
    save({ title: value });
  };

  const insertMermaidDiagram = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertContent({
        type: "codeBlock",
        attrs: { language: "mermaid" },
        content: [{ type: "text", text: MERMAID_TEMPLATE }],
      })
      .run();
  };

  const handleExportMarkdown = () => {
    if (!editor) return;
    exportAsMarkdown(title, editor.getHTML());
    toast({ title: "Exported as Markdown", description: `${title}.md downloaded.` });
  };

  const handleExportPdf = async () => {
    if (!editor) return;
    try {
      await exportAsPdf(title, editor.getHTML(), editorContainerRef.current);
      toast({ title: "Exported as PDF", description: `${title}.pdf downloaded.` });
    } catch (err) {
      toast({
        title: "Export failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  if (!editor) return null;

  // Extract mermaid blocks for rendering
  const htmlContent = editor.getHTML();

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Fixed toolbar */}
      <div className="sticky top-0 z-10 flex items-center gap-1 flex-wrap border-b border-border bg-background px-4 py-2">
        <ToolbarGroup>
          <ToolbarBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
            <Bold className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
            <Italic className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
            <Strikethrough className="h-4 w-4" />
          </ToolbarBtn>
        </ToolbarGroup>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarGroup>
          <ToolbarBtn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
            <Heading1 className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
            <Heading2 className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
            <Heading3 className="h-4 w-4" />
          </ToolbarBtn>
        </ToolbarGroup>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarGroup>
          <ToolbarBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
            <List className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code Block">
            <Code className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
            <Quote className="h-4 w-4" />
          </ToolbarBtn>
          <ToolbarBtn active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
            <Minus className="h-4 w-4" />
          </ToolbarBtn>
        </ToolbarGroup>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Mermaid + Export */}
        <ToolbarGroup>
          <ToolbarBtn active={false} onClick={insertMermaidDiagram} title="Insert Diagram">
            <GitBranch className="h-4 w-4" />
          </ToolbarBtn>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="Export" className="h-7 w-7 rounded-md">
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
              <DropdownMenuItem onClick={handleExportMarkdown}>
                <FileText className="h-4 w-4 mr-2" /> Export as Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPdf}>
                <FileDown className="h-4 w-4 mr-2" /> Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ToolbarGroup>

        {/* Save status */}
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving...
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="h-3.5 w-3.5 text-primary" />
              Saved
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="px-4 md:px-10 pt-8 pb-2 max-w-3xl mx-auto w-full">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
          className="border-none shadow-none text-3xl font-bold px-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/40"
        />
      </div>

      {/* Editor + Mermaid preview */}
      <div ref={editorContainerRef} className="flex-1 px-4 md:px-10 pb-20 max-w-3xl mx-auto w-full">
        <EditorContent editor={editor} />
        <MermaidBlocks htmlContent={htmlContent} editor={editor} />
      </div>
    </div>
  );
}

/** Extracts mermaid code blocks and renders them below the editor */
function MermaidBlocks({
  htmlContent,
  editor,
}: {
  htmlContent: string;
  editor: ReturnType<typeof useEditor>;
}) {
  const [blocks, setBlocks] = useState<{ code: string; index: number }[]>([]);

  useEffect(() => {
    if (!editor) return;
    const json = editor.getJSON();
    const mermaidBlocks: { code: string; index: number }[] = [];
    let idx = 0;

    const walk = (node: Record<string, unknown>) => {
      if (
        node.type === "codeBlock" &&
        (node.attrs as Record<string, unknown>)?.language === "mermaid"
      ) {
        const content = ((node.content as Array<Record<string, unknown>>) || [])
          .map((c) => c.text as string)
          .join("");
        mermaidBlocks.push({ code: content, index: idx++ });
      }
      if (Array.isArray(node.content)) {
        for (const child of node.content as Array<Record<string, unknown>>) {
          walk(child);
        }
      }
    };

    walk(json as Record<string, unknown>);
    setBlocks(mermaidBlocks);
  }, [htmlContent, editor]);

  if (blocks.length === 0) return null;

  return (
    <div className="mt-4 space-y-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Diagram Previews
      </p>
      {blocks.map((block) => (
        <MermaidRenderer key={block.index} code={block.code} />
      ))}
    </div>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarBtn({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      onClick={onClick}
      className={cn("h-7 w-7 rounded-md", active && "bg-accent text-accent-foreground")}
    >
      {children}
    </Button>
  );
}
