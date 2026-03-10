import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { File, Folder, Search } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { Breadcrumb } from './Breadcrumb';
import { type TreeNode } from '../fileExplorer.schemas';
import { formatSize, getTotalSize, encodePath } from '../fileExplorer.utils';
import { TreeNodeDetailRow } from './TreeNodeDetailRow';
import { NODE_TYPE } from '../fileExplorer.const';

interface TreeNodeDetailProps {
  node: TreeNode;
  segments: string[];
}

export const TreeNodeDetail = ({ node, segments }: TreeNodeDetailProps) => {
  const [childFilter, setChildFilter] = useState('');

  const totalSize = useMemo(() => getTotalSize(node), [node]);
  const fullPath = segments.join('/');

  const filteredChildren = useMemo(() => {
    if (node.type !== NODE_TYPE.FOLDER) return [];
    const q = childFilter.trim().toLowerCase();
    return q ? node.children.filter((c) => c.name.toLowerCase().includes(q)) : node.children;
  }, [node, childFilter]);

  return (
    <div className="flex flex-1 flex-col gap-6 py-8">
      <Breadcrumb segments={segments} />

      <div className="flex items-center gap-3">
        {node.type === NODE_TYPE.FILE ? (
          <File size={20} className="text-content-secondary shrink-0" />
        ) : (
          <Folder size={20} className="text-content-secondary shrink-0" />
        )}
        <h1 className="type-heading-xs text-content-primary truncate font-semibold">{node.name}</h1>
        <span className="type-body-xs text-content-secondary bg-surface-panel border-border rounded border px-2 py-0.5">
          {node.type}
        </span>
      </div>

      <div className="border-border bg-surface-panel rounded-md border px-4">
        <TreeNodeDetailRow label="Name" value={node.name} />
        <TreeNodeDetailRow label="Full path" value={fullPath} />
        {node.type === NODE_TYPE.FILE && <TreeNodeDetailRow label="Size" value={formatSize(node.size)} />}
        {node.type === NODE_TYPE.FOLDER && (
          <>
            <TreeNodeDetailRow label="Children" value={String(node.children.length)} />
            <TreeNodeDetailRow label="Total size" value={formatSize(totalSize)} />
          </>
        )}
      </div>

      {node.type === NODE_TYPE.FOLDER && node.children.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="type-body-xs text-content-secondary font-semibold tracking-wide whitespace-nowrap uppercase">
              Children ({node.children.length})
            </h2>
            <div className="relative w-full">
              <Search
                size={12}
                className="text-content-secondary absolute top-1/2 left-2.5 -translate-y-1/2"
              />
              <input
                type="text"
                value={childFilter}
                onChange={(e) => setChildFilter(e.target.value)}
                placeholder="Filter…"
                className="border-border bg-surface-panel type-body-xs text-content-primary placeholder:text-content-secondary focus:ring-content-accent-muted/20 w-full rounded border py-1 pr-2 pl-7 focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
          <div className="border-border overflow-hidden rounded-md border">
            {filteredChildren.length === 0 ? (
              <p className="type-body-s text-content-secondary px-4 py-3">
                No children match "{childFilter}".
              </p>
            ) : (
              filteredChildren.map((child, index) => {
                const childSegments = [...segments, child.name];
                return (
                  <Link
                    key={child.name}
                    to={ROUTES.TREE_NODE(encodePath(childSegments))}
                    className={[
                      'hover:bg-surface-panel/60 flex items-center gap-3 px-4 py-2.5',
                      index !== filteredChildren.length - 1 ? 'border-border border-b' : '',
                    ].join(' ')}
                  >
                    {child.type === NODE_TYPE.FILE ? (
                      <File size={14} className="text-content-secondary shrink-0" />
                    ) : (
                      <Folder size={14} className="text-content-secondary shrink-0" />
                    )}
                    <span className="type-body-s text-content-primary min-w-0 flex-1 truncate">
                      {child.name}
                    </span>
                    <span className="type-body-xs text-content-secondary shrink-0">
                      {child.type === NODE_TYPE.FILE
                        ? formatSize(child.size)
                        : `${child.children.length} items`}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
