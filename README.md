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
All core domain types (`FileNode`, `FolderNode`, `TreeNode`) are derived from Zod schemas rather than defined manually. This keeps runtime validation and compile-time types always in sync. The recursive `FolderNode` type requires a small workaround — TypeScript can't infer through circular references — so the types are declared upfront and the schemas are annotated with `z.ZodType<T>`.

### Feature-based structure
Code is organized under `src/features/FileExplorer/` with clear internal layers: `pages/` (routing entry points), `components/` (UI), `hooks/`, `schemas`, `utils`, `const`. Pages are kept thin — they handle routing guards and delegate all rendering to components.

### URL as state for search
The search query is stored in the URL (`?q=`) via `useSearchParams`. This means search results survive page refreshes and are shareable by URL — a requirement from the spec.

### Tree stored in localStorage
The parsed tree is persisted to `localStorage` after validation. Any route that requires the tree redirects to `/` if the data is missing or invalid, rather than crashing.

### Folder upload via `webkitdirectory`
Real folder uploads are supported through `<input webkitdirectory>`. The browser provides a flat `FileList` with `webkitRelativePath` on each file — the app reconstructs the nested tree from those paths. A `Map`-based lookup (`_childMap`) is used during construction to avoid O(n) child scans per insert, then stripped before the tree is stored.

### CSS architecture
Styling uses **Tailwind CSS v4** in CSS-first configuration mode — there is no `tailwind.config.js`. All design tokens (colors, typography, radius, z-index, shadow) are defined as CSS custom properties in `src/styles/index.css` under `:root`, then mapped into Tailwind's theme via `@theme inline`. This makes every token available both as a raw CSS variable (`var(--content-primary)`) and as a Tailwind utility (`text-content-primary`).

A custom `@utility type-*` rule drives the typography scale: classes like `type-heading-xs` or `type-body-s` each apply font size, line height, and letter spacing together as a single token, avoiding utility sprawl and keeping text styles consistent across components.

### Self-hosted fonts
The UI font (Instrument Sans) is self-hosted as `.woff2` files declared via `@font-face` in `src/styles/fonts.css`. Only the four weights actually used in the UI (400, 500, 600, 700) are included — no variable font, no CDN request. `font-display: swap` ensures text renders immediately with the system fallback and swaps to the custom font once it loads.

### Application entry point
`src/main.tsx` is the single entry point. It imports global styles and fonts before mounting React, so Tailwind base styles and `@font-face` declarations are registered before any component renders. The app is wrapped in `StrictMode` and `BrowserRouter` at the root level.

## What would be done with more time

- **JSON error highlighting** — surface the exact line, column, and character that caused a parse failure. V8's `JSON.parse` error message includes a byte offset; a custom parser or a library like `jsonc-parser` could map that offset to line/column and underline the offending token directly in the textarea using a positioned `<mark>` overlay or a lightweight embedded editor (e.g. CodeMirror with a minimal setup).
- **Virtual scrolling** for large trees — rendering every row into the DOM is the main performance bottleneck for deep trees; `@tanstack/react-virtual` would fix this without touching the data model.
- **Drag-and-drop** JSON upload onto the textarea area
- **Keyboard navigation** in the tree view — arrow keys to move between nodes, space/enter to expand/collapse, similar to native file explorer behavior
- **Unit tests** for `buildTreeFromFiles`, `searchNodes`, `getNodeByPath`, and the Zod schemas

## Known limitations

- `webkitdirectory` is not part of the HTML spec — it works in all major browsers but is not standardized and can behave inconsistently (e.g. Safari has historically had edge cases with large folder uploads)
- For very large folders (thousands of files), tree building runs on the main thread and may cause a brief UI freeze despite the zero-delay yield before processing. A Web Worker would be the proper fix for production use.
- `localStorage` has a ~5 MB limit — very large trees serialized as JSON may silently fail to save; the app does not currently catch or report quota exceeded errors
- JSON parse errors show only the native browser error message with no indication of which line or token is invalid
- The tree root must be a folder object; a bare file node at the root is not a supported input format
- No multi-root support — the schema expects a single root node; a JSON array of top-level entries will fail validation
- Search is case-insensitive name matching only — no filtering by type, size range, extension, or glob patterns
