import { cva, type VariantProps } from 'class-variance-authority';

export interface ButtonVariants extends VariantProps<typeof buttonVariants> {}

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding type-body-s font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-border focus-visible:ring-2 focus-visible:ring-border/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-border-error aria-invalid:ring-2 aria-invalid:ring-border-error/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-surface-accent text-content-accent hover:opacity-90',
        outline:
          'border-border bg-surface-page hover:bg-surface-panel hover:text-content-primary aria-expanded:bg-surface-panel aria-expanded:text-content-primary',
        secondary:
          'bg-surface-panel text-content-primary hover:opacity-80 aria-expanded:bg-surface-panel aria-expanded:text-content-primary',
        ghost:
          'hover:bg-surface-panel hover:text-content-primary aria-expanded:bg-surface-panel aria-expanded:text-content-primary',
        destructive:
          'bg-surface-error text-content-error hover:opacity-90 focus-visible:border-border-error focus-visible:ring-border-error/20',
        link: 'text-content-accent-muted underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
