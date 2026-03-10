import { memo, useState } from 'react';
import { Link } from 'react-router';
import { ChevronRight, File, Folder, FolderOpen, MoveUpRight } from 'lucide-react';
import type { TreeNode } from '../fileExplorer.schemas';
import { encodePath, formatSize } from '../fileExplorer.utils';
import { ROUTES } from '@/router/routes';
import { NODE_TYPE } from '../fileExplorer.const';

interface TreeNodeRowProps {
  node: TreeNode;
  /** Path segments from root's children down to this node. */
  pathSegments: string[];
  depth: number;
}

export const TreeNodeRow = memo(({ node, pathSegments, depth }: TreeNodeRowProps) => {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const nodePath = ROUTES.TREE_NODE(encodePath(pathSegments));
  const indent = depth * 16;

  if (node.type === NODE_TYPE.FILE) {
    return (
      <div
        className="hover:bg-surface-panel flex items-center gap-2 rounded px-2 py-1"
        style={{ paddingLeft: indent + 8 }}
      >
        <File size={14} className="text-content-secondary shrink-0" />
        <Link
          to={nodePath}
          className="type-body-s text-content-primary hover:text-content-accent-muted flex-1 truncate"
        >
          {node.name}
        </Link>
        <span className="type-body-xs text-content-secondary shrink-0">{formatSize(node.size)}</span>
      </div>
    );
  }

  return (
    <>
      <div
        className="hover:bg-surface-panel flex cursor-pointer items-center gap-2 rounded px-2 py-1 select-none"
        style={{ paddingLeft: indent + 8 }}
      >
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="flex min-w-0 flex-1 items-center gap-2"
          aria-expanded={isOpen}
        >
          <ChevronRight
            size={14}
            className={`text-content-secondary shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          />
          {isOpen ? (
            <FolderOpen size={14} className="text-content-secondary shrink-0" />
          ) : (
            <Folder size={14} className="text-content-secondary shrink-0" />
          )}
          <span className="type-body-s text-content-primary truncate">{node.name}</span>
        </button>
        <Link
          to={nodePath}
          className="type-body-xs text-content-secondary hover:text-content-accent-muted shrink-0 px-1"
          title="View details"
        >
          <MoveUpRight size={14} />
        </Link>
      </div>
      {isOpen && node.children.length > 0 && (
        <>
          {node.children.map((child) => (
            <TreeNodeRow
              key={child.name}
              node={child}
              pathSegments={[...pathSegments, child.name]}
              depth={depth + 1}
            />
          ))}
        </>
      )}
      {isOpen && node.children.length === 0 && (
        <div style={{ paddingLeft: indent + 32 }} className="py-1">
          <span className="type-body-xs text-content-secondary italic">empty</span>
        </div>
      )}
    </>
  );
});
