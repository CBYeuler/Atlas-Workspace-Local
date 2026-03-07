import { Link } from "react-router-dom";
import { ArrowRight, Terminal, FileText, Zap, Download, Cloud, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState } from "react";

const features = [
  {
    icon: Terminal,
    title: "Code-first notes",
    description: "Markdown with syntax highlighting built for developers.",
  },
  {
    icon: FileText,
    title: "Organized workspaces",
    description: "Group notes by project, tag, or whatever makes sense to you.",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Instant search and keyboard-driven navigation.",
  },
];

const useDetectedOS = () => {
  const [os, setOS] = useState<"mac" | "windows" | "linux">("mac");
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("win")) setOS("windows");
    else if (ua.includes("linux")) setOS("linux");
    else setOS("mac");
  }, []);
  return os;
};

const downloadLinks: Record<string, { label: string; href: string }[]> = {
  mac: [{ label: "Download for macOS", href: "#download-macos" }],
  windows: [{ label: "Download for Windows", href: "#download-windows" }],
  linux: [{ label: "Download for Linux", href: "#download-linux" }],
};

const allDownloads = [
  { label: "macOS", href: "#download-macos" },
  { label: "Windows", href: "#download-windows" },
  { label: "Linux", href: "#download-linux" },
];

const Index = () => {
  const os = useDetectedOS();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <span className="text-sm font-medium text-foreground">Atlas Workspace</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="opacity-0 animate-fade-in">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Atlas Workspace
          </h1>
        </div>

        <p className="mt-4 max-w-md text-lg text-muted-foreground opacity-0 animate-fade-in-delay">
          A modern workspace for developers
        </p>

        <div className="mt-8 flex flex-col items-center gap-6 opacity-0 animate-fade-in-delay-2 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-2">
            <Link to="/signup">
              <Button size="lg" className="gap-2 px-8">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <span className="max-w-[180px] text-xs text-muted-foreground">
              Sync everywhere, collaborate with teams
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <a href="#choose-workspace">
              <Button size="lg" variant="outline" className="gap-2 px-8">
                <Download className="h-4 w-4" /> Download Desktop
              </Button>
            </a>
            <span className="max-w-[200px] text-xs text-muted-foreground">
              Your machine, your rules. Works offline.
            </span>
          </div>
        </div>

        <div className="mt-24 grid w-full max-w-3xl gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border border-border bg-card p-6 text-left transition-colors hover:border-primary/30"
            >
              <f.icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="text-sm font-medium text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Choose Your Workspace Section */}
        <section id="choose-workspace" className="mt-32 w-full max-w-3xl scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Choose Your Workspace
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Cloud Card */}
            <div className="flex flex-col items-center rounded-lg border border-border bg-card p-8 text-center transition-colors hover:border-primary/30">
              <Cloud className="mb-4 h-10 w-10 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Atlas Cloud</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Full-featured workspace with sync, collaboration, and team features
              </p>
              <Link to="/signup" className="mt-6">
                <Button className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Local Card */}
            <div className="flex flex-col items-center rounded-lg border border-border bg-card p-8 text-center transition-colors hover:border-primary/30">
              <Monitor className="mb-4 h-10 w-10 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Atlas Local</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Standalone desktop app. No account, no internet, no subscription. Free forever.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                {downloadLinks[os].map((d) => (
                  <a key={d.label} href={d.href}>
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" /> {d.label}
                    </Button>
                  </a>
                ))}
                <div className="mt-1 flex items-center justify-center gap-3">
                  {allDownloads
                    .filter((d) => !downloadLinks[os].some((o) => o.href === d.href))
                    .map((d) => (
                      <a
                        key={d.label}
                        href={d.href}
                        className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                      >
                        {d.label}
                      </a>
                    ))}
                </div>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Open source on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Atlas Workspace
      </footer>
    </div>
  );
};

export default Index;
