import { useParams } from 'react-router';
import { useTree } from '../hooks';
import { decodePath, getNodeByPath } from '../fileExplorer.utils';
import { TreeNodeDetail } from '../components/TreeNodeDetail';
import { NodeNotFoundState } from '../components/NodeNotFoundState';

export const FileExplorerNodeDetailPage = () => {
  const { '*': nodePath = '' } = useParams();
  const tree = useTree();

  if (!tree) return null;

  const segments = decodePath(nodePath);
  const node = getNodeByPath(tree, segments);

  if (!node) return <NodeNotFoundState nodePath={nodePath} />;

  return <TreeNodeDetail node={node} segments={segments} />;
};

export default FileExplorerNodeDetailPage;
