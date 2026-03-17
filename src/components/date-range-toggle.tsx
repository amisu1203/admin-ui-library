import * as React from 'react';
import { type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { createPortal } from 'react-dom';

import { cn } from '../lib/cn';
import { Calendar } from './calendar';
import { type ToggleOption, ToggleGroup } from './toggle-group';

export interface DateRangeToggleProps {
  options: ToggleOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  calendarOptionValue?: string;
  range?: DateRange;
  onRangeChange?: (range: DateRange | undefined) => void;
  todayLabel?: string;
  cancelLabel?: string;
  selectLabel?: string;
}

function DateRangeToggle({
  options,
  value,
  onChange,
  className,
  calendarOptionValue = 'custom',
  range,
  onRangeChange,
  todayLabel = '오늘',
  cancelLabel = '취소',
  selectLabel = '선택',
}: DateRangeToggleProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [draftRange, setDraftRange] = React.useState<DateRange | undefined>(range);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [panelPosition, setPanelPosition] = React.useState({ top: 0, left: 0 });
  const [month, setMonth] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    setDraftRange(range);
    if (!month && range?.from) {
      setMonth(range.from);
    }
  }, [range?.from, range?.to]);

  React.useEffect(() => {
    if (value !== calendarOptionValue) {
      setIsCalendarOpen(false);
    }
  }, [value, calendarOptionValue]);

  React.useEffect(() => {
    if (!isCalendarOpen) return;

    const updatePosition = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const anchorButton = containerRef.current?.querySelector(
        `button[data-toggle-value="${calendarOptionValue}"]`,
      ) as HTMLButtonElement | null;
      const anchorRect = anchorButton?.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const panelHeight = panelRef.current?.offsetHeight ?? 460;
      const offset = 8;
      const spaceBelow = viewportHeight - rect.bottom - offset;
      const shouldOpenUpward = spaceBelow < panelHeight && rect.top > panelHeight;

      setPanelPosition({
        top: shouldOpenUpward
          ? Math.max(offset, rect.top - panelHeight - offset)
          : rect.bottom + offset,
        left: anchorRect?.left ?? rect.left,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isCalendarOpen]);

  const handleToday = () => {
    const today = new Date();
    setDraftRange({ from: today, to: today });
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handleCancel = () => {
    setDraftRange(range);
    setIsCalendarOpen(false);
  };

  const handleSelect = () => {
    onRangeChange?.(draftRange);
    onChange?.(calendarOptionValue); // 확정 후 부모 value를 '기간 지정'으로 맞춤
    setIsCalendarOpen(false);
  };
  const isRangeComplete = Boolean(draftRange?.from && draftRange?.to);
  const isSameDayRange = Boolean(
    draftRange?.from &&
      draftRange?.to &&
      draftRange.from.toDateString() === draftRange.to.toDateString(),
  );
  const isSingleDaySelection = Boolean(
    draftRange?.from && (!draftRange?.to || isSameDayRange),
  );

  const handleDayClick: React.ComponentProps<typeof Calendar>['onDayClick'] = (
    day,
    modifiers,
  ) => {
    if (modifiers.outside) {
      const newMonth = new Date(day.getFullYear(), day.getMonth(), 1);
      setMonth(newMonth);
    }
  };

  const handleToggleChange = (nextValue: string) => {
    if (nextValue === calendarOptionValue) {
      // '기간 지정' 클릭 시: onChange 호출하지 않음. 달력만 노출.
      // (부모가 value 변경을 받아 page 리셋 등을 하지 않도록 함. 확정은 '선택' 클릭 시 onRangeChange만.)
      setIsCalendarOpen(true);
    } else {
      onChange?.(nextValue);
      setIsCalendarOpen(false);
    }
  };

  const committedRangeText =
    range?.from && range?.to
      ? `${format(range.from, 'yyyy.MM.dd')} - ${format(range.to, 'yyyy.MM.dd')}`
      : '';

  return (
    <div ref={containerRef} className={cn('relative inline-flex flex-col gap-3', className)}>
      <div className="flex items-center gap-3">
        <ToggleGroup
          options={options}
          value={isCalendarOpen ? calendarOptionValue : value}
          onChange={handleToggleChange}
          ariaLabel="기간 선택 토글"
        />
        {value === calendarOptionValue && committedRangeText ? (
          <p className="text-body-5 whitespace-nowrap text-gray-90">
            {committedRangeText}
          </p>
        ) : null}
      </div>

      {isCalendarOpen
        ? createPortal(
        <div
          ref={panelRef}
          className="fixed z-[999] w-[350px] min-w-[260px] max-w-[360px] overflow-hidden rounded-lg border border-[var(--color-input-border)] bg-white py-6 shadow-[0_12px_20px_rgba(0,0,0,0.16)]"
          style={{ top: panelPosition.top, left: panelPosition.left }}
        >
          <Calendar
            mode="range"
            locale={ko}
            month={month}
            onMonthChange={setMonth}
            selected={draftRange}
            onSelect={setDraftRange}
            onDayClick={handleDayClick}
            classNames={
              isSingleDaySelection
                ? {
                    // 하루만 선택된 상태에서는 연결 바(좌/우 반쪽 배경)를 모두 비활성화
                    range_start:
                      '[&>button]:rounded-lg [&>button]:bg-[var(--color-component-accent)] [&>button]:text-white',
                    range_end:
                      '[&>button]:rounded-lg [&>button]:bg-[var(--color-component-accent)] [&>button]:text-white',
                    range_middle:
                      '[&>button]:rounded-lg [&>button]:bg-[var(--color-component-accent)] [&>button]:text-white',
                  }
                : undefined
            }
            showOutsideDays
          />

          <div className="mt-6 flex items-start justify-between px-4">
            <button
              type="button"
              className="cursor-pointer h-10 rounded-[6px] border border-[var(--color-input-border-disabled)] bg-white px-5 text-title-sm text-black"
              onClick={handleToday}
            >
              {todayLabel}
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="cursor-pointer h-10 rounded-lg border border-black bg-white px-5 text-title-sm text-black"
                onClick={handleCancel}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                disabled={!isRangeComplete}
                className={cn(
                  'h-10 rounded-lg px-4 text-title-sm',
                  isRangeComplete
                    ? 'cursor-pointer bg-[var(--color-component-accent)] text-white'
                    : 'cursor-not-allowed bg-[var(--color-input-border-disabled)] text-[var(--color-input-placeholder)]',
                )}
                onClick={handleSelect}
              >
                {selectLabel}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
        : null}
    </div>
  );
}

export { DateRangeToggle };
