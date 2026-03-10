import { lazy } from 'react';
import { ROUTE_SEGMENTS } from './routes';
import type { RouteConfig } from '@/router/utils';

const FileExplorerPage = lazy(() => import('@/features/FileExplorer/pages/FileExplorerPage'));
const FileExplorerTreePage = lazy(() => import('@/features/FileExplorer/pages/FileExplorerTreePage'));
const FileExplorerNodeDetailPage = lazy(
  () => import('@/features/FileExplorer/pages/FileExplorerNodeDetailPage')
);

export const APP_ROUTES: RouteConfig[] = [
  { path: ROUTE_SEGMENTS.ROOT, element: FileExplorerPage },
  { path: ROUTE_SEGMENTS.TREE, element: FileExplorerTreePage },
  { path: ROUTE_SEGMENTS.TREE_NODE, element: FileExplorerNodeDetailPage },
];
