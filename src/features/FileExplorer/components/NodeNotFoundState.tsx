import { Link } from 'react-router';
import { ROUTES } from '@/router/routes';

interface NodeNotFoundStateProps {
  nodePath: string;
}

export const NodeNotFoundState = ({ nodePath }: NodeNotFoundStateProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <h1 className="type-heading-xs text-content-primary">Node not found</h1>
      <p className="type-body-s text-content-secondary">
        <code className="bg-surface-panel inline-block max-w-sm truncate rounded px-1 align-bottom">{nodePath}</code> does not exist in the tree.
      </p>
      <Link to={ROUTES.TREE} className="type-body-s text-content-accent-muted underline underline-offset-4">
        Back to tree
      </Link>
    </div>
  );
};
