import * as React from 'react';

import { cn } from '../lib/cn';

/**
 * Figma TextInputField 스타일 적용
 *
 * CSS 변수는 @daggle-dev/admin-ui/styles import 시 자동 정의됩니다.
 * - Default: 흰 배경, border input-border, h-12, px-4 py-3, rounded-lg, text-body-3
 * - Hover:    bg input-bg-hover
 * - Focus:    border input-focus, ring
 * - Disabled: bg input-bg-disabled, border input-border-disabled
 * - Error:    aria-invalid 속성 사용 시 red-normal 테두리
 */
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-12 w-full min-w-0 rounded-lg border bg-white px-4 py-3 text-body-3 text-gray-90 outline-none transition-colors selection:bg-primary-normal selection:text-label-white',
        'border-[var(--color-input-border)] placeholder:text-[var(--color-input-placeholder)]',
        'hover:bg-[var(--color-input-bg-hover)]',
        'focus-visible:border-[var(--color-input-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-input-focus)]/20 focus-visible:ring-offset-0',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-[var(--color-input-border-disabled)] disabled:bg-[var(--color-input-bg-disabled)] disabled:text-gray-70',
        'aria-invalid:border-red-normal aria-invalid:focus-visible:border-red-normal aria-invalid:focus-visible:ring-red-normal/20',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-90',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
