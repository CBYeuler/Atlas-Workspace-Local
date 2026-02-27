import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, AlertTriangle } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    darkMode: true,
    background: "transparent",
    primaryColor: "hsl(225, 75%, 57%)",
    primaryTextColor: "hsl(220, 14%, 96%)",
    primaryBorderColor: "hsl(228, 10%, 20%)",
    lineColor: "hsl(220, 10%, 55%)",
    secondaryColor: "hsl(228, 10%, 18%)",
    tertiaryColor: "hsl(228, 12%, 13%)",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
  },
});

interface MermaidRendererProps {
  code: string;
  onCodeChange?: (code: string) => void;
  editable?: boolean;
}

export default function MermaidRenderer({
  code,
  onCodeChange,
  editable = false,
}: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string>("");
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    if (mode === "edit") return;

    let cancelled = false;

    const render = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(
          idRef.current,
          code.trim()
        );
        if (!cancelled) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Invalid mermaid syntax";
          setError(message);
          setSvg("");
        }
        // Clean up mermaid error element
        const errorEl = document.getElementById("d" + idRef.current);
        if (errorEl) errorEl.remove();
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [code, mode]);

  return (
    <div className="my-3 rounded-lg border border-border overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Mermaid Diagram
        </span>
        {editable && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 px-2 text-xs gap-1",
                mode === "edit" && "bg-accent text-accent-foreground"
              )}
              onClick={() => setMode("edit")}
            >
              <Pencil className="h-3 w-3" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 px-2 text-xs gap-1",
                mode === "preview" && "bg-accent text-accent-foreground"
              )}
              onClick={() => setMode("preview")}
            >
              <Eye className="h-3 w-3" /> Preview
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {mode === "edit" ? (
        <textarea
          value={code}
          onChange={(e) => onCodeChange?.(e.target.value)}
          className="w-full min-h-[120px] bg-muted/30 p-3 font-mono text-sm text-foreground resize-y focus:outline-none border-none"
          spellCheck={false}
        />
      ) : error ? (
        <div className="flex items-start gap-2 p-3 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Diagram syntax error</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono break-all">{error}</p>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex justify-center p-4 overflow-x-auto [&_svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  );
}
