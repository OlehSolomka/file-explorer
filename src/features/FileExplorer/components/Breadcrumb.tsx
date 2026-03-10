import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '@/router/routes';
import { encodePath } from '../fileExplorer.utils';

interface BreadcrumbProps {
  /** Path segments from root down to (and including) the current node. */
  segments: string[];
}

export function Breadcrumb({ segments }: BreadcrumbProps) {
  // little with proxy pattern to avoid calculating inside map and keep JSX clean
  const withBreadcrumbProxy = (
    index: number,
    callback: (props: { isLast: boolean; pathTo: string }) => React.ReactNode
  ) => {
    const isLast = index === segments.length - 1;
    const nodePath = segments.slice(0, index + 1);
    const pathTo = ROUTES.TREE_NODE(encodePath(nodePath));

    return callback({ isLast, pathTo });
  };

  return (
    <nav className="flex w-full flex-wrap items-center gap-1">
      <Link
        to={ROUTES.TREE}
        className="type-body-s text-content-accent-muted shrink-0 underline-offset-4 hover:underline"
      >
        root
      </Link>
      {segments.map((segment, index) => {
        return withBreadcrumbProxy(index, ({ isLast, pathTo }) => (
          <span key={pathTo} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-content-secondary shrink-0" />
            {isLast ? (
              <span className="type-body-s text-content-primary truncate font-semibold">{segment}</span>
            ) : (
              <Link
                to={pathTo}
                className="type-body-s text-content-accent-muted truncate underline-offset-4 hover:underline"
              >
                {segment}
              </Link>
            )}
          </span>
        ));
      })}
    </nav>
  );
}
