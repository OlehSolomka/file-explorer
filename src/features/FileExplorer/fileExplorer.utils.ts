import { NODE_TYPE } from './fileExplorer.const';
import type { BuildNode, SearchResult, TreeNode } from './fileExplorer.schemas';

/** Traverse the tree by path segments (relative to root's children). */
export function getNodeByPath(root: TreeNode, segments: string[]): TreeNode | null {
  if (segments.length === 0) return root;
  if (root.type !== NODE_TYPE.FOLDER) return null;

  const [first, ...rest] = segments;
  const child = root.children.find((c) => c.name === first);
  if (!child) return null;

  return rest.length === 0 ? child : getNodeByPath(child, rest);
}

/** Recursively sum all file sizes under a node. */
export function getTotalSize(node: TreeNode): number {
  if (node.type === NODE_TYPE.FILE) return node.size;
  return node.children.reduce((sum, child) => sum + getTotalSize(child), 0);
}

/** Search nodes by name (case-insensitive) across the entire tree. */
export function searchNodes(root: TreeNode, query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const q = query.toLowerCase().trim();
  if (!q) return results;

  function traverse(node: TreeNode, currentPath: string[]) {
    if (node.name.toLowerCase().includes(q)) {
      results.push({ node, path: currentPath });
    }
    if (node.type === NODE_TYPE.FOLDER) {
      for (const child of node.children) {
        traverse(child, [...currentPath, child.name]);
      }
    }
  }

  if (root.type === NODE_TYPE.FOLDER) {
    for (const child of root.children) {
      traverse(child, [child.name]);
    }
  }

  return results;
}

/** Format bytes as B / KB / MB. */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Encode path segments for use in a URL param. */
export function encodePath(segments: string[]): string {
  return segments.map(encodeURIComponent).join('/');
}

/** Decode a URL param back to path segments. */
export function decodePath(encoded: string): string[] {
  return encoded.split('/').map(decodeURIComponent);
}

/**
 * Build a TreeNode from a browser FileList produced by a <input webkitdirectory> upload.
 * Each file has a `webkitRelativePath` like "root/src/index.ts".
 * Folders are inferred from the path segments; files get their real byte size.
 */
// Augmented node used only during tree construction

export function buildTreeFromFiles(files: FileList): TreeNode {
  const rootName = files[0]?.webkitRelativePath.split('/')[0] ?? 'root';
  const root: BuildNode = { name: rootName, type: NODE_TYPE.FOLDER, children: [], _childMap: new Map() };

  for (const file of Array.from(files)) {
    const parts = file.webkitRelativePath.split('/');
    const pathParts = parts.slice(1);
    if (pathParts.length === 0) continue;

    let current = root;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const segmentName = pathParts[i];
      if (!segmentName) continue;

      let folder = current._childMap.get(segmentName);
      if (!folder) {
        folder = { name: segmentName, type: NODE_TYPE.FOLDER, children: [], _childMap: new Map() };
        current.children.push(folder);
        current._childMap.set(segmentName, folder);
      }
      current = folder;
    }

    const fileName = pathParts[pathParts.length - 1];
    if (fileName) {
      current.children.push({ name: fileName, type: NODE_TYPE.FILE, size: file.size });
    }
  }

  // Strip the temporary lookup maps before returning
  const clean = (node: BuildNode | TreeNode): TreeNode => {
    if (node.type === NODE_TYPE.FILE) return node;
    const { _childMap, ...rest } = node as BuildNode;
    return { ...rest, children: rest.children.map(clean) };
  };

  return clean(root);
}
