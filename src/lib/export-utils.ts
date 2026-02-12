import TurndownService from "turndown";
import { jsPDF } from "jspdf";
import mermaid from "mermaid";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

// Preserve mermaid code blocks
turndown.addRule("mermaidCodeBlock", {
  filter: (node) =>
    node.nodeName === "PRE" &&
    node.querySelector("code")?.getAttribute("class")?.includes("mermaid") === true,
  replacement: (_content, node) => {
    const code = (node as HTMLElement).querySelector("code")?.textContent || "";
    return `\n\`\`\`mermaid\n${code.trim()}\n\`\`\`\n`;
  },
});

export function exportAsMarkdown(title: string, htmlContent: string) {
  const md = `# ${title}\n\n${turndown.turndown(htmlContent || "")}`;
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  downloadBlob(blob, `${sanitizeFilename(title)}.md`);
}

export async function exportAsPdf(
  title: string,
  htmlContent: string,
  editorElement: HTMLElement | null
) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  const titleLines = pdf.splitTextToSize(title, contentWidth);
  pdf.text(titleLines, margin, y);
  y += titleLines.length * 10 + 6;

  // Horizontal rule
  pdf.setDrawColor(200);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Parse the HTML and render text
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent || "";

  const addPageIfNeeded = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - margin) {
      addPageNumber(pdf, pageWidth, pageHeight);
      pdf.addPage();
      y = margin;
    }
  };

  const processNode = async (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (!text) return;
      const lines = pdf.splitTextToSize(text, contentWidth);
      addPageIfNeeded(lines.length * 6);
      pdf.text(lines, margin, y);
      y += lines.length * 6 + 2;
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    switch (tag) {
      case "h1":
        addPageIfNeeded(14);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text(pdf.splitTextToSize(el.textContent || "", contentWidth), margin, y);
        y += 10;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        break;
      case "h2":
        addPageIfNeeded(12);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(15);
        pdf.text(pdf.splitTextToSize(el.textContent || "", contentWidth), margin, y);
        y += 9;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        break;
      case "h3":
        addPageIfNeeded(10);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.text(pdf.splitTextToSize(el.textContent || "", contentWidth), margin, y);
        y += 8;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        break;
      case "p":
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        for (const child of Array.from(el.childNodes)) {
          await processNode(child);
        }
        y += 3;
        break;
      case "strong":
      case "b":
        pdf.setFont("helvetica", "bold");
        pdf.text(pdf.splitTextToSize(el.textContent || "", contentWidth), margin, y);
        y += 6;
        pdf.setFont("helvetica", "normal");
        break;
      case "em":
      case "i":
        pdf.setFont("helvetica", "italic");
        pdf.text(pdf.splitTextToSize(el.textContent || "", contentWidth), margin, y);
        y += 6;
        pdf.setFont("helvetica", "normal");
        break;
      case "ul":
      case "ol": {
        let idx = 0;
        for (const li of Array.from(el.children)) {
          idx++;
          const bullet = tag === "ul" ? "•" : `${idx}.`;
          const text = li.textContent || "";
          const lines = pdf.splitTextToSize(text, contentWidth - 8);
          addPageIfNeeded(lines.length * 6);
          pdf.text(`${bullet} `, margin + 2, y);
          pdf.text(lines, margin + 8, y);
          y += lines.length * 6 + 1;
        }
        y += 3;
        break;
      }
      case "blockquote": {
        addPageIfNeeded(10);
        pdf.setDrawColor(180);
        pdf.setLineWidth(0.5);
        const bqText = el.textContent || "";
        const lines = pdf.splitTextToSize(bqText, contentWidth - 10);
        pdf.line(margin + 2, y - 2, margin + 2, y + lines.length * 6);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(120);
        pdf.text(lines, margin + 6, y);
        y += lines.length * 6 + 4;
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0);
        break;
      }
      case "pre": {
        // Check if it's a mermaid code block
        const codeEl = el.querySelector("code");
        const isMermaid = codeEl?.className?.includes("mermaid") || codeEl?.getAttribute("data-language") === "mermaid";

        if (isMermaid && codeEl) {
          // Render mermaid as image
          try {
            const mermaidCode = codeEl.textContent || "";
            const { svg } = await mermaid.render(
              `pdf-mermaid-${Math.random().toString(36).slice(2)}`,
              mermaidCode.trim()
            );
            // Convert SVG to image
            const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);
            const img = new Image();
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = reject;
              img.src = url;
            });
            const canvas = document.createElement("canvas");
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            const ctx = canvas.getContext("2d")!;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);

            const imgData = canvas.toDataURL("image/png");
            const ratio = img.height / img.width;
            const imgW = Math.min(contentWidth, 150);
            const imgH = imgW * ratio;
            addPageIfNeeded(imgH + 5);
            pdf.addImage(imgData, "PNG", margin, y, imgW, imgH);
            y += imgH + 5;
          } catch {
            // Fallback: render as code
            const text = codeEl.textContent || "";
            const lines = pdf.splitTextToSize(text, contentWidth - 8);
            addPageIfNeeded(lines.length * 5 + 6);
            pdf.setFillColor(240, 240, 240);
            pdf.rect(margin, y - 3, contentWidth, lines.length * 5 + 6, "F");
            pdf.setFont("courier", "normal");
            pdf.setFontSize(9);
            pdf.text(lines, margin + 4, y);
            y += lines.length * 5 + 6;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(11);
          }
        } else {
          const codeText = el.textContent || "";
          const lines = pdf.splitTextToSize(codeText, contentWidth - 8);
          addPageIfNeeded(lines.length * 5 + 6);
          pdf.setFillColor(240, 240, 240);
          pdf.rect(margin, y - 3, contentWidth, lines.length * 5 + 6, "F");
          pdf.setFont("courier", "normal");
          pdf.setFontSize(9);
          pdf.text(lines, margin + 4, y);
          y += lines.length * 5 + 6;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(11);
        }
        break;
      }
      case "hr":
        addPageIfNeeded(8);
        pdf.setDrawColor(200);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 8;
        break;
      default:
        for (const child of Array.from(el.childNodes)) {
          await processNode(child);
        }
    }
  };

  for (const child of Array.from(tempDiv.childNodes)) {
    await processNode(child);
  }

  // Add page number to last page
  addPageNumber(pdf, pageWidth, pageHeight);

  pdf.save(`${sanitizeFilename(title)}.pdf`);
}

function addPageNumber(pdf: jsPDF, pageWidth: number, pageHeight: number) {
  const pageCount = pdf.getNumberOfPages();
  pdf.setFontSize(9);
  pdf.setTextColor(150);
  pdf.text(`Page ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: "center" });
  pdf.setTextColor(0);
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-_]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 60) || "note";
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
