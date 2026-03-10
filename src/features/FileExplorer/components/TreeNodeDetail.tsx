import { useMemo } from 'react';
import { Link } from 'react-router';
import { File, Folder } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { Breadcrumb } from './Breadcrumb';
import { type FolderNode, type TreeNode } from '../fileExplorer.schemas';
import { formatSize, getTotalSize, encodePath } from '../fileExplorer.utils';
import { TreeNodeDetailRow } from './TreeNodeDetailRow';
import { NODE_TYPE } from '../fileExplorer.const';

interface TreeNodeDetailProps {
  node: TreeNode;
  segments: string[];
}

export const TreeNodeDetail = ({ node, segments }: TreeNodeDetailProps) => {
  const fullPath = segments.join('/');

  const totalSize = useMemo(() => getTotalSize(node), [node]);

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
        <div className="flex flex-col gap-1">
          <h2 className="type-body-xs text-content-secondary font-semibold tracking-wide uppercase">
            Children ({node.children.length})
          </h2>
          <div className="border-border overflow-hidden rounded-md border">
            {(node as FolderNode).children.map((child, index) => {
              const childSegments = [...segments, child.name];
              return (
                <Link
                  key={child.name}
                  to={ROUTES.TREE_NODE(encodePath(childSegments))}
                  className={[
                    'hover:bg-surface-panel/60 flex items-center gap-3 px-4 py-2.5',
                    index !== (node as FolderNode).children.length - 1 ? 'border-border border-b' : '',
                  ].join(' ')}
                >
                  {child.type === NODE_TYPE.FILE ? (
                    <File size={14} className="text-content-secondary shrink-0" />
                  ) : (
                    <Folder size={14} className="text-content-secondary shrink-0" />
                  )}
                  <span className="type-body-s text-content-primary min-w-0 flex-1 truncate">{child.name}</span>
                  <span className="type-body-xs text-content-secondary shrink-0">
                    {child.type === NODE_TYPE.FILE
                      ? formatSize(child.size)
                      : `${child.children.length} items`}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
