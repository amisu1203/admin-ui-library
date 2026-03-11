import * as React from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../lib/cn';

export type CalendarProps = DayPickerProps;

function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn('p-0', className)}
      classNames={{
        root: 'w-full',
        month: 'w-full',
      
        // 월 캡션 영역을 기준 컨테이너로 사용
        month_caption:
          'relative flex w-full justify-start px-4 pb-6 text-[var(--color-gray-100)]',
      
        caption_label:
          'text-title-lg font-bold tracking-[-0.015em] leading-[1.5]',
      
        // 쉐브론 버튼을 오른쪽 끝에 배치
        nav:
          'absolute right-4 top-6 flex items-center gap-3',
      
        button_previous:
          'inline-flex z-10 size-6 shrink-0 cursor-pointer items-center justify-center rounded text-[var(--color-input-placeholder)]',
      
        button_next:
          'inline-flex z-10 size-6 shrink-0 cursor-pointer items-center justify-center rounded text-[var(--color-input-placeholder)]',
      
        month_grid: 'w-full border-collapse',
        weekdays: 'grid grid-cols-7 px-2',
      
        weekday:
          'flex h-[34px] items-center justify-center text-[14px] font-semibold tracking-[-0.01em] leading-[1.4] text-[var(--color-input-placeholder)]',
      
        week: 'grid grid-cols-7 px-2 py-2',
      
        day:
          'flex items-center justify-center p-0 [&.rdp-range_start.rdp-range_end]:bg-transparent',
      
        day_button:
          'inline-flex size-[30px] cursor-pointer items-center justify-center rounded-lg text-[14px] font-medium tracking-[-0.025em] leading-[1.5] text-black outline-none transition-colors focus-visible:border focus-visible:border-[var(--color-border-strong)] disabled:cursor-default',
      
        today:
          '[&>button]:cursor-pointer [&>button]:rounded-lg [&>button]:border [&>button]:border-black [&>button]:text-black',
      
        outside: 'text-[var(--color-label-natural)]',
        disabled: 'text-gray-60',
      
        selected:
          '[&>button]:rounded-lg [&>button]:bg-[var(--color-component-accent)] [&>button]:text-white',
      
        range_start:
          'bg-[linear-gradient(to_right,transparent_50%,var(--color-calendar-range-bg)_50%)] [&>button]:rounded-lg [&>button]:bg-[var(--color-component-accent)] [&>button]:text-white',
      
        range_end:
          'bg-[linear-gradient(to_right,var(--color-calendar-range-bg)_50%,transparent_50%)] [&>button]:rounded-lg [&>button]:bg-[var(--color-component-accent)] [&>button]:text-white',
      
        range_middle:
          'bg-[var(--color-calendar-range-bg)] [&>button]:rounded-none [&>button]:bg-transparent [&>button]:!text-black',
      
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName }) => (
          orientation === 'left' ? (
            <ChevronLeft
              aria-hidden
              className={cn('size-6 opacity-80', iconClassName)}
            />
          ) : (
            <ChevronRight
              aria-hidden
              className={cn('size-6 opacity-80', iconClassName)}
            />
          )
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
