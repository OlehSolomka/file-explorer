import { useMemo } from 'react';
import { toast } from 'sonner';
import { Toast, type ToastOptions } from '@/components/ui';

export const useToast = () => {
  return useMemo(
    () => ({
      success: (msg: string, opts?: ToastOptions) =>
        toast.custom((id) => <Toast toastId={id} message={msg} type="success" {...opts} />, {
          duration: 2000,
        }),
      error: (msg: string, opts?: ToastOptions) =>
        toast.custom((id) => <Toast toastId={id} message={msg} type="error" {...opts} />, { duration: 5000 }),
      warning: (msg: string, opts?: ToastOptions) =>
        toast.custom((id) => <Toast toastId={id} message={msg} type="warning" {...opts} />, {
          duration: 4000,
        }),
      info: (msg: string, opts?: ToastOptions) =>
        toast.custom((id) => <Toast toastId={id} message={msg} type="info" {...opts} />, { duration: 4000 }),
    }),
    []
  );
};
