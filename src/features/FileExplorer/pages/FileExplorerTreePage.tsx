import { useSearchParams, Link } from 'react-router';
import { ROUTES } from '@/router/routes';
import { useTree } from '../hooks';
import { TreeSearch } from '../components/TreeSearch';
import { TreeView } from '../components/TreeView';
import { ArrowLeft } from 'lucide-react';

export const FileExplorerTreePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const tree = useTree();

  if (!tree) return null;

  function handleQueryChange(value: string) {
    if (value) {
      setSearchParams({ q: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="type-heading-xs text-content-primary min-w-0 truncate font-semibold">{tree.name}</h1>
        <Link
          to={ROUTES.HOME}
          className="type-body-xs text-content-secondary hover:text-content-primary flex items-center"
        >
          <ArrowLeft size={18} className="mr-2 inline-block" />
          Load new file
        </Link>
      </div>

      <TreeSearch tree={tree} query={query} onQueryChange={handleQueryChange} />

      {!query.trim() && <TreeView tree={tree} />}
    </div>
  );
};

export default FileExplorerTreePage;
