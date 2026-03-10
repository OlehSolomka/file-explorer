//used in config and for route definitions
export const ROUTE_SEGMENTS = {
  ROOT: '/',
  TREE: '/tree',
  TREE_NODE: '/tree/*',
} as const;

//used for navigate() function and Navigate component
export const ROUTES = {
  HOME: ROUTE_SEGMENTS.ROOT,
  TREE: ROUTE_SEGMENTS.TREE,
  TREE_NODE: (nodePath: string) => `${ROUTE_SEGMENTS.TREE}/${nodePath}`,
} as const;
