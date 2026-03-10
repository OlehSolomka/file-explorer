# FileTree Explorer

A developer tool for visualizing and navigating JSON-based directory structures.

## Getting started

```bash
pnpm install && pnpm dev
```

## Features

- Paste or upload a JSON file representing a directory tree
- Upload a real local folder — the tree is built directly from the file system structure
- Interactive tree view with expandable/collapsible folders
- Node detail page for both files and folders
- Full-tree search by name with results persisted across page refreshes via URL query params

## Stack

- **React 19** + **TypeScript** (strict)
- **React Router v7**
- **Vite 8**
- **Zod** — runtime schema validation and type derivation
- **Tailwind CSS v4**
- **Sonner** — toast notifications

## Architectural decisions

### Schema-first typing
All core domain types (`FileNode`, `FolderNode`, `TreeNode`) are derived from Zod schemas rather than defined manually. This keeps runtime validation and compile-time types always in sync. The recursive `FolderNode` type requires a small workaround — TypeScript can't infer through circular references - so the types are declared upfront and the schemas are annotated with `z.ZodType<T>`.

### Feature-based structure
Code is organized under `src/features/FileExplorer/` with clear internal layers: `pages/` (routing entry points), `components/` (UI), `hooks/`, `schemas`, `utils`, `const`. Pages are kept thin — they handle routing guards and delegate all rendering to components.

### URL as state for search
The search query is stored in the URL (`?q=`) via `useSearchParams`. This means search results survive page refreshes and are shareable by URL — a requirement from the spec.

### Tree stored in localStorage
The parsed tree is persisted to `localStorage` after validation. Any route that requires the tree redirects to `/` if the data is missing or invalid, rather than crashing.

### Folder upload via `webkitdirectory`
Real folder uploads are supported through `<input webkitdirectory>`. The browser provides a flat `FileList` with `webkitRelativePath` on each file — the app reconstructs the nested tree from those paths. A `Map`-based lookup (`_childMap`) is used during construction to avoid O(n) child scans per insert, then stripped before the tree is stored.

## What would be done with more time

- **Virtual scrolling** for large trees (thousands of nodes)
- **Drag-and-drop** JSON upload in addition to the file input
- **Keyboard navigation** in the tree view
- **Unit tests** for `buildTreeFromFiles`, `searchNodes`, `getNodeByPath`, and the Zod schemas
- **Sorting** — folders before files, alphabetical within each group
- **Breadcrumb on the tree page** to show current location context

## Known limitations

- `webkitdirectory` is not part of the HTML spec — it works in all major browsers but is not standardized
- For very large folders (thousands of files), the tree-building step runs on the main thread and may cause a brief UI freeze despite the zero-delay yield before processing. A Web Worker would be the proper fix for production use
- `localStorage` has a ~5 MB limit — very large trees serialized as JSON may exceed it silently
- The tree root is always treated as a folder; a bare file at the root is not a supported input format
