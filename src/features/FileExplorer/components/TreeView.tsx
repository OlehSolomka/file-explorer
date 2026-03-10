import { NODE_TYPE } from '../fileExplorer.const';
import type { TreeNode } from '../fileExplorer.schemas';
import { TreeNodeRow } from './TreeNodeRow';

interface TreeViewProps {
  tree: TreeNode;
}

export const TreeView = ({ tree }: TreeViewProps) => (
  <div className="border-border bg-surface-panel rounded-md border py-2">
    {tree.type === NODE_TYPE.FOLDER && tree.children.length > 0 ? (
      tree.children.map((child) => (
        <TreeNodeRow key={child.name} node={child} pathSegments={[child.name]} depth={0} />
      ))
    ) : (
      <p className="type-body-s text-content-secondary px-4 py-3">Empty tree.</p>
    )}
  </div>
);
