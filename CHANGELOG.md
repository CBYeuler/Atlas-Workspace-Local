# Changelog

All notable changes to Atlas Workspace will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-03-06

### MAJOR UPDATE: Vault System

This is the biggest architectural change since launch. Atlas now uses a dedicated vault system similar to Obsidian, providing dramatically improved performance and user experience.

### Added

#### Vault Management System
- **Dedicated Vault Storage**: All vaults stored in `~/.atlas-vaults/` directory
- **Create Unlimited Vaults**: Organize notes into separate workspaces (Work, Personal, Projects, etc.)
- **Recent Vaults**: Quick access to 5 most recently opened vaults
- **Vault Registry**: Automatic tracking of all vaults with metadata (creation date, last opened)
- **Fast Vault Switching**: Switch between vaults instantly from sidebar dropdown

#### Performance Improvements
- **10x Faster Loading**: No more scanning entire filesystem
- **Instant Note Creation**: Notes appear immediately in sidebar
- **Smooth Navigation**: Zero lag when switching between notes
- **Optimized File Operations**: Direct vault-specific file access

#### User Experience
- **Beautiful Vault Selector**: New onboarding screen with vault creation
- **Inline Note Creation**: Create notes with a simple name input
- **Vault Deletion**: Remove vaults you no longer need
- **Clean File Management**: All notes isolated per vault

### Changed

- **Architecture**: Moved from filesystem-based to vault-based storage
- **File Access**: Atlas no longer accesses all PC files (security + speed)
- **Workspace → Vault**: Terminology updated for clarity
- **Note Creation**: Now uses vault-relative paths instead of absolute paths

### Performance

- **Loading Time**: Reduced from 2-3 seconds to <100ms for large workspaces
- **Note Switching**: Instant (previously 500ms+ for large folders)
- **Search**: Foundation laid for fast full-text search (coming in v1.4)
- **Memory Usage**: Reduced by ~40% due to limited file scanning

### Fixed

- App no longer slows down with 100+ notes
- No more loading delays when opening workspaces
- Eliminated filesystem permission issues
- Fixed crashes with deeply nested folder structures

### Export System (Maintained)

- **Vault Export**: Export entire vault to any location on PC
- **Single Note Export**: Export individual notes as .md files
- **PDF Export**: Maintained from v1.1.0 (unchanged)
- **Git-Friendly**: Exported files work seamlessly with version control

### Security & Privacy

- **Isolated Storage**: Vaults stored in dedicated `.atlas-vaults` directory
- **No Filesystem Access**: App only accesses its own vault directory
- **User Control**: Full control over vault location and structure
- **Offline-First**: Still works 100% offline with no cloud dependency

---
## [1.2.0] - 2026-02-27
### Added
- **Custom PDF Export Engine**: Implemented a coordinate-based rendering system using `jsPDF` for higher precision.
- **High-Res Mermaid Support**: Added a 2x scale rendering pipeline for Mermaid diagrams using HTML5 Canvas.
- **Markdown Export**: Integrated `TurndownService` with custom fencers for Mermaid blocks.
- **Sanitized Filenaming**: Logic to auto-clean filenames for cross-OS compatibility.

### Changed
- **Print Optimization**: Overhauled `index.css` with a robust `@media print` layer (A4 standard, 2cm margins, 12pt typography).
- **DOM Traversal**: Switched to a recursive `processNode` algorithm in `export-utils.ts` to preserve nested HTML styles.
- **Asset Loading**: Moved to an asynchronous `Promise`-based model for image and SVG rendering to prevent race conditions during export.

### Fixed
- **UI Bleed**: Resolved issue where navigation buttons and sidebars were visible in PDF exports.
- **Layout Breaks**: Improved page-break logic for headers and code blocks.


---

## [1.1.0] - 2026-02-14

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

## [1.0.0] - 2026-02-12

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
