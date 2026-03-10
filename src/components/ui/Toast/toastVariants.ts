import { cva, type VariantProps } from 'class-variance-authority';

export type ToastVariants = VariantProps<typeof toastVariants>;

export const toastVariants = cva(
  'flex max-w-md w-full h-13.5 items-center gap-4 rounded-[8px] px-3 shadow [&_svg]:stroke-[1.2] [&_svg]:shrink-0 [&_svg]:text-current',
  {
    variants: {
      type: {
        success: 'text-content-primary bg-surface-panel border border-border',
        error: 'text-content-error bg-surface-error border border-border-error',
        warning: 'text-content-primary bg-surface-panel border border-border',
        info: 'text-content-primary bg-surface-panel border border-border',
      },
    },
    defaultVariants: { type: 'success' },
  }
);
