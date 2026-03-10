import { Link } from 'react-router';
import { ROUTES } from '@/router/routes';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <span className="text-6xl font-semibold text-content-secondary">404</span>
      <h1 className="type-heading-xs text-content-primary">Page not found</h1>
      <p className="type-body-s text-content-secondary">The page you're looking for doesn't exist.</p>
      <Link to={ROUTES.HOME} className="type-body-s text-content-accent-muted underline underline-offset-4">
        Go home
      </Link>
    </div>
  );
};
