import * as React from 'react';

import { cn } from '../lib/cn';

export interface ToggleOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  value?: string;
  onChange?: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}

const toggleBaseClass =
  'h-10 min-w-20 cursor-pointer rounded-lg border px-3 text-title-sm transition-colors outline-none focus-visible:border-[var(--color-border-strong)]';

function ToggleGroup({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: ToggleGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('flex flex-wrap items-center gap-3', className)}
    >
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            className={cn(
              toggleBaseClass,
              selected
                ? 'border-gray-60 bg-gray-30 text-gray-90'
                : 'border-gray-50 bg-white text-gray-90',
              option.disabled &&
                'cursor-not-allowed border-gray-50 bg-gray-30 text-gray-70',
            )}
            onClick={() => {
              if (!option.disabled) onChange?.(option.value);
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export { ToggleGroup };
