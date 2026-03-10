import { AlertTriangle, CheckCircle, Info, X, XCircle, type LucideIcon } from 'lucide-react';

import { toastVariants, type ToastVariants } from './toastVariants';
import { Button } from '../Button';
import { toast } from 'sonner';
import { cn } from '@/shared/utils';
import type { ObjectKeys } from '@/shared/types';

const DEFAULT_ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export interface ToastOptions {
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onAction?: () => void;
  textCenter?: boolean;
}

interface ToastProps extends ToastVariants, ToastOptions {
  message: string;
  toastId: string | number;
}

export const Toast = (props: ToastProps) => {
  const { type, message, toastId, leftIcon, rightIcon, onAction, textCenter } = props;

  const LeftIcon = leftIcon ?? DEFAULT_ICONS[type as ObjectKeys<typeof DEFAULT_ICONS>];
  const RightIcon = rightIcon;

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    toast.dismiss(toastId);
  };

  return (
    <div className={cn(toastVariants({ type }))}>
      <LeftIcon size={24} />
      <span
        className={cn('type-body-xs flex-1 font-semibold whitespace-pre-wrap', {
          'text-center': !!textCenter,
        })}
      >
        {message}
      </span>
      <Button variant="ghost" onClick={handleAction} className="text-current">
        {RightIcon ? <RightIcon /> : <X />}
      </Button>
    </div>
  );
};
