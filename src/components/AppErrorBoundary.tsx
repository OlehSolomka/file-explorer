import { ErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';
import { Button } from './ui';

interface Props {
  children: React.ReactNode;
}

export const AppErrorBoundary = ({ children }: Props) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }: FallbackProps) => {
        return (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
            <h1 className="type-heading-xs text-content-primary">Something went wrong</h1>
            <p className="type-body-s text-content-secondary max-w-sm text-center">
              {error instanceof Error ? error.message : 'An unexpected error occurred.'}
            </p>
            <Button onClick={resetErrorBoundary}>Try again</Button>
          </div>
        );
      }}
      onError={(error, errorInfo) => {
        console.error('CRITICAL APP ERROR:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
