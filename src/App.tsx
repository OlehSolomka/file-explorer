import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { AppErrorBoundary, AppSuspenseFallback, AppLayout } from '@/components';
import { APP_ROUTES, renderRoutes, NotFoundPage } from '@/router';

const App = () => {
  return (
    <AppErrorBoundary>
      <Suspense fallback={<AppSuspenseFallback />}>
        <AppLayout>
          <Routes>
            {renderRoutes(APP_ROUTES)}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppLayout>
      </Suspense>
    </AppErrorBoundary>
  );
};

export default App;
