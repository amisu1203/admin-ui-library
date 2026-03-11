import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '../lib/cn';

const boxBaseClass =
  'relative inline-flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border transition-colors';

export interface CheckboxProps
  extends Omit<React.ComponentProps<'input'>, 'type' | 'onChange'> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

function Checkbox({
  id,
  checked = false,
  disabled = false,
  label,
  className,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <span
        aria-hidden
        className={cn(
          boxBaseClass,
          checked
            ? 'border-gray-90 bg-gray-90'
            : 'border-gray-50 bg-white',
          disabled && 'border-gray-50 bg-white',
        )}
      >
        {checked ? <Check className="size-4 text-white" strokeWidth={2.75} /> : null}
      </span>
      {label ? (
        <span
          className={cn(
            'text-body-5',
            checked ? 'text-gray-90' : 'text-gray-70',
            disabled && 'text-gray-70',
          )}
        >
          {label}
        </span>
      ) : null}
    </label>
  );
}

export { Checkbox };
