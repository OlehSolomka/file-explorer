import type { ComponentType } from 'react';
import { Route } from 'react-router';

export interface RouteConfig {
  element: ComponentType;
  path?: string;
  index?: boolean;
  children?: RouteConfig[];
}

const renderRoute = (route: RouteConfig, parentPath: string = '') => {
  const { element: PageElement, path, children, index } = route;

  if (!path && !index) {
    console.warn('Route missing both path and index');
    return null;
  }

  // Create unique key by combining parent path with current path/index
  const fullPath = path ? `${parentPath}/${path}`.replace(/\/+/g, '/') : parentPath;
  const uniqueKey = index ? `${fullPath}-index` : fullPath;

  if (Array.isArray(children)) {
    return (
      <Route key={uniqueKey} path={path} element={<PageElement />}>
        {children.map((child) => renderRoute(child, fullPath))}
      </Route>
    );
  }

  return <Route key={uniqueKey} path={path} index={index} element={<PageElement />} />;
};

export const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route) => renderRoute(route));
};
