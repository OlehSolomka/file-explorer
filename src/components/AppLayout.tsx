import { AppToaster } from './AppToaster';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-6">
      {children}
      <AppToaster />
    </main>
  );
};
