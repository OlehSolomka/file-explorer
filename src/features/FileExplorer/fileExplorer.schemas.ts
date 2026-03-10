import type { ObjectValues } from '@/shared/types';
import { z } from 'zod';
import { NODE_TYPE } from './fileExplorer.const';

export const FileNodeSchema = z.object({
  name: z.string().min(1),
  type: z.literal(NODE_TYPE.FILE),
  size: z.number().nonnegative(),
});

export type FileNode = z.infer<typeof FileNodeSchema>;
export type TreeNode = FileNode | FolderNode;

export type FolderNode = {
  name: string;
  type: typeof NODE_TYPE.FOLDER;
  children: TreeNode[];
};

export const FolderNodeSchema: z.ZodType<FolderNode> = z.object({
  name: z.string().min(1),
  type: z.literal(NODE_TYPE.FOLDER),
  children: z.lazy(() => z.array(TreeNodeSchema)),
});

export const TreeNodeSchema: z.ZodType<TreeNode> = z.union([FileNodeSchema, FolderNodeSchema]);

export interface SearchResult {
  node: TreeNode;
  /** Path segments from root's children down to this node (not including root). */
  path: string[];
}
export type NodeType = ObjectValues<typeof NODE_TYPE>;

export interface BuildNode {
  name: string;
  type: typeof NODE_TYPE.FOLDER;
  children: TreeNode[];
  _childMap: Map<string, BuildNode>;
}
