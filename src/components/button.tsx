import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/cn';

const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg font-bold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-normal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-100 aria-invalid:ring-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        /**
         * fill (default): primary 배경, hover 시 natural
         * "default"는 하위 호환을 위해 fill과 동일하게 유지
         */
        default:
          'bg-primary-normal text-label-white hover:bg-primary-natural disabled:bg-gray-40 disabled:text-gray-70',
        fill: 'bg-primary-normal text-label-white hover:bg-primary-natural disabled:bg-gray-40 disabled:text-gray-70',
        destructive:
          'bg-destructive text-label-white hover:bg-destructive/90 focus-visible:ring-destructive disabled:bg-gray-40 disabled:text-gray-70',
        outline:
          'border border-gray-60 bg-transparent text-gray-90 hover:bg-gray-40 focus-visible:ring-blue-normal disabled:border-gray-40 disabled:bg-gray-40 disabled:text-gray-70',
        /** outline-primary: primary 테두리/텍스트 */
        'outline-primary':
          'border border-primary-normal bg-transparent text-primary-normal hover:bg-primary-normal/10 focus-visible:ring-blue-normal disabled:border-gray-40 disabled:bg-gray-40 disabled:text-gray-70',
        /** outline-strong: gray-90 테두리/텍스트 */
        'outline-strong':
          'border border-gray-90 bg-transparent text-gray-90 hover:bg-gray-40 focus-visible:ring-blue-normal disabled:border-gray-40 disabled:bg-gray-40 disabled:text-gray-70',
        /** outline-natural: gray-50 테두리, gray-90 텍스트 */
        'outline-natural':
          'border border-gray-50 bg-transparent text-gray-90 hover:bg-gray-40 focus-visible:ring-blue-normal disabled:border-gray-40 disabled:bg-gray-40 disabled:text-gray-70',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:bg-gray-40 disabled:text-gray-70',
        ghost:
          'hover:bg-gray-40 hover:text-gray-90 disabled:bg-transparent disabled:text-gray-70',
        link: 'text-primary-normal underline-offset-4 hover:underline',
      },
      size: {
        xsmall:
          'h-8 gap-1 rounded-lg px-2.5 text-title-md [&_svg:not([class*="size-"])]:size-4',
        small:
          'h-10 gap-1 rounded-lg px-3 text-title-md [&_svg:not([class*="size-"])]:size-5',
        medium:
          'h-12 gap-2 rounded-lg px-4 text-title-lg [&_svg:not([class*="size-"])]:size-5',
        large:
          'h-14 gap-2 rounded-lg px-5 text-title-lg [&_svg:not([class*="size-"])]:size-5',
        xlarge:
          'h-16 gap-2 rounded-lg px-6 text-title-xlg [&_svg:not([class*="size-"])]:size-6',
        icon: 'size-10 rounded-lg',
        'icon-xsmall': 'size-8 rounded-lg [&_svg:not([class*="size-"])]:size-4',
        'icon-small': 'size-10 rounded-lg [&_svg:not([class*="size-"])]:size-5',
        'icon-medium': 'size-12 rounded-lg [&_svg:not([class*="size-"])]:size-5',
        'icon-large': 'size-14 rounded-lg [&_svg:not([class*="size-"])]:size-5',
        'icon-xlarge': 'size-16 rounded-lg [&_svg:not([class*="size-"])]:size-6',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
      fullWidth: false,
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    ButtonVariants {
  /** true이면 자식 요소에 버튼 props를 병합 (예: <a>, <Link>) */
  asChild?: boolean;
}

function Button({
  className,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
