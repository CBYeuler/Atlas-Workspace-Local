# Changelog

All notable changes to Atlas Workspace will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2025-02-14

###  Added
- Hash-based routing for better navigation structure
- Settings page placeholder
- About page with project information

###  Changed
- Refactored dashboard into proper routes
- Improved component organization
- Updated README with clearer authentication stance

###  Fixed
- Removed compiled TypeScript files (.d.ts, .js) from repository
- Cleaned up build artifacts from source control
- Fixed .gitignore to exclude future compiled files

###  Acknowledgments
Special thanks to ** @dreamer_948 ** for the detailed code review and suggestions that shaped this release:
- Pointed out the TypeScript compilation artifacts issue
- Suggested hash routing for better scalability
- Recommended build configuration improvements

---

## [1.0.0] - 2025-02-12

###  Initial Release

**Features:**
- Rich markdown editing with Tiptap
- Mermaid diagram support
- Local-first architecture (no cloud, no auth)
- Auto-save functionality
- Export to Markdown and PDF
- Dark/light theme toggle
- File management (create, edit, delete)
- Syntax highlighting for code blocks

**Tech Stack:**
- Electron 28
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Tiptap editor

---

## [Unreleased] - v2.0.0 Roadmap

###  Planned Features
- [ ] **Folder Organization**: Nested folder support for better note structure
- [ ] **Search Functionality**: Full-text search across all notes
- [ ] **File Renaming**: Rename notes directly from the UI
- [ ] **Recent Workspaces**: Quick access to previously opened workspaces
- [ ] **Note Templates**: Pre-built templates for common use cases
- [ ] **Git Integration**: Optional git status indicators and commit shortcuts
- [ ] **Multiple Workspace Tabs**: Work with multiple workspaces simultaneously
- [ ] **Vim Mode**: Keyboard shortcuts for Vim users
- [ ] **Advanced Diagrams**: Support for more diagram types (sequence, class, etc.)
- [ ] **Plugin System**: Allow community extensions

###  Technical Improvements
- [ ] Migration to electron-forge + pnpm
- [ ] Better file watching with native APIs
- [ ] Performance optimizations for large workspaces
- [ ] Automated testing suite
- [ ] CI/CD pipeline for releases

---

**Want to contribute?** Reach me from my socials!
