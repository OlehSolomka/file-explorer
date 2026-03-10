import { Link } from 'react-router';
import { Search, X, File, Folder } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { encodePath, formatSize, searchNodes } from '../fileExplorer.utils';
import { NODE_TYPE } from '../fileExplorer.const';
import type { TreeNode } from '../fileExplorer.schemas';

interface TreeSearchProps {
  tree: TreeNode;
  query: string;
  onQueryChange: (value: string) => void;
}

export const TreeSearch = ({ tree, query, onQueryChange }: TreeSearchProps) => {
  const results = query.trim() ? searchNodes(tree, query) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search size={14} className="text-content-secondary absolute top-1/2 left-3 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search files and folders…"
          className="border-border bg-surface-panel type-body-s text-content-primary placeholder:text-content-secondary focus:ring-content-accent-muted/20 w-full rounded-md border py-2 pr-9 pl-9 focus:ring-2 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="text-content-secondary hover:text-content-primary absolute top-1/2 right-3 -translate-y-1/2"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {results !== null && (
        <div className="flex flex-col gap-1">
          <p className="type-body-xs text-content-secondary mb-2">
            {results.length === 0
              ? `No results for "${query}"`
              : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
          </p>
          {results.map(({ node, path }) => (
            <Link
              key={path.join('/')}
              title={path.join('/')}
              to={ROUTES.TREE_NODE(encodePath(path))}
              className="border-border bg-surface-panel hover:bg-surface-panel/80 flex items-center gap-2 rounded-md border px-3 py-2"
            >
              {node.type === NODE_TYPE.FILE ? (
                <File size={14} className="text-content-secondary shrink-0" />
              ) : (
                <Folder size={14} className="text-content-secondary shrink-0" />
              )}
              <span className="type-body-s text-content-primary max-w-[40%] truncate font-semibold">
                {node.name}
              </span>
              {node.type === NODE_TYPE.FILE && (
                <span className="type-body-xs text-content-secondary ml-auto shrink-0">
                  {formatSize(node.size)}
                </span>
              )}
              {node.type === NODE_TYPE.FOLDER && (
                <span className="type-body-xs text-content-secondary ml-auto shrink-0">
                  {node.children.length} item{node.children.length !== 1 ? 's' : ''}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
