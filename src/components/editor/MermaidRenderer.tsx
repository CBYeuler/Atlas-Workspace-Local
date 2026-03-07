import { useEffect } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  fontFamily: "Inter, system-ui, sans-serif",
});

export default function MermaidRenderer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const renderMermaid = async () => {
      const mermaidBlocks = document.querySelectorAll('code.language-mermaid, code[data-language="mermaid"]');
      
      for (const block of Array.from(mermaidBlocks)) {
        const code = block.textContent || "";
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        
        try {
          const { svg } = await mermaid.render(id, code.trim());
          const wrapper = document.createElement("div");
          wrapper.className = "mermaid-diagram my-4";
          wrapper.innerHTML = svg;
          block.parentElement?.replaceWith(wrapper);
        } catch (error) {
          console.error("Mermaid render error:", error);
        }
      }
    };

    renderMermaid();
  });

  return <>{children}</>;
}
