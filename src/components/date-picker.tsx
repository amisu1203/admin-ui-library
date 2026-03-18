import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { createPortal } from 'react-dom';
import { type DateRange } from 'react-day-picker';

import { cn } from '../lib/cn';
import { Calendar, type CalendarProps } from './calendar';

// ─── 공통 스타일 ──────────────────────────────────────────────────────────────

const triggerBaseClass =
  'h-12 w-full flex items-center justify-between gap-2 cursor-pointer rounded-lg border border-[var(--color-input-border)] bg-white px-4 py-3 outline-none transition-colors focus-visible:border-[var(--color-border-strong)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-[var(--color-input-border-disabled)] disabled:bg-[var(--color-input-bg-disabled)] disabled:text-gray-70 aria-invalid:border-red-normal aria-invalid:focus-visible:border-red-normal';

const panelClass =
  'fixed z-[999] w-[350px] overflow-hidden rounded-lg border border-[var(--color-input-border)] bg-white py-6 shadow-[0_12px_20px_rgba(0,0,0,0.16)]';

// range 모드: 단일 날짜만 선택된 상태일 때 반쪽 배경(range bar)을 제거
const singleDayRangeClassNames = {
  range_start:
    '[&>button]:rounded-lg [&>button]:bg-[var(--color-component-accent)] [&>button]:text-white',
  range_end:
    '[&>button]:rounded-lg [&>button]:bg-[var(--color-component-accent)] [&>button]:text-white',
  range_middle:
    '[&>button]:rounded-lg [&>button]:bg-[var(--color-component-accent)] [&>button]:text-white',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface DatePickerCommonProps {
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  ariaLabel?: string;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  /** range 모드 패널의 버튼 레이블 */
  todayLabel?: string;
  cancelLabel?: string;
  selectLabel?: string;
  /** Calendar 컴포넌트에 전달할 추가 옵션 (mode / selected / onSelect 제외) */
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
}

export interface DatePickerSingleProps extends DatePickerCommonProps {
  mode?: 'single';
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export interface DatePickerRangeProps extends DatePickerCommonProps {
  mode: 'range';
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

// ─── 패널 위치 계산 훅 ────────────────────────────────────────────────────────

function usePanelPosition(
  open: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  panelRef: React.RefObject<HTMLDivElement | null>,
) {
  const [pos, setPos] = React.useState({ top: 0, left: 0 });
  // 위치 계산 전까지 패널을 숨겨 (0,0) 위치에서 반짝이는 현상 방지
  const [ready, setReady] = React.useState(false);

  const update = React.useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const panelHeight = panelRef.current?.offsetHeight ?? 420;
    const offset = 8;
    const spaceBelow = window.innerHeight - rect.bottom - offset;
    const openUpward = spaceBelow < panelHeight && rect.top > panelHeight;
    setPos({
      top: openUpward ? rect.top - panelHeight - offset : rect.bottom + offset,
      left: rect.left,
    });
    setReady(true);
  }, [containerRef, panelRef]);

  React.useEffect(() => {
    if (!open) {
      setReady(false);
      return;
    }
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, update]);

  return { pos, ready };
}

// ─── DatePicker ───────────────────────────────────────────────────────────────

/**
 * DatePicker — 단일 날짜 선택(single) 또는 기간 선택(range) 컴포넌트.
 *
 * **single 모드** (기본)
 * - 날짜를 클릭하면 즉시 선택되고 패널이 닫힙니다.
 *
 * **range 모드**
 * - DateRangeToggle의 캘린더 패널을 그대로 재사용합니다.
 * - 드래프트 범위를 먼저 선택한 뒤 "선택" 버튼으로 확정합니다.
 * - "오늘" 버튼, "취소" 버튼, 단일 날짜 선택 시 스타일 처리 모두 동일합니다.
 */
function DatePicker(props: DatePickerProps) {
  const {
    placeholder,
    label,
    errorMessage,
    disabled,
    className,
    id: idProp,
    ariaLabel,
    'aria-label': ariaLabelFromProps,
    'aria-invalid': ariaInvalidProp,
    todayLabel = '오늘',
    cancelLabel = '취소',
    selectLabel = '선택',
    calendarProps,
  } = props;

  const isRange = props.mode === 'range';

  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const explicitAriaLabel = ariaLabel ?? ariaLabelFromProps;
  const hasError = Boolean(errorMessage) || ariaInvalidProp === true;

  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // ── range 모드 전용 상태 (DateRangeToggle과 동일) ─────────────────────────
  const rangeValue = isRange ? (props as DatePickerRangeProps).value : undefined;
  const [draftRange, setDraftRange] = React.useState<DateRange | undefined>(rangeValue);
  const [month, setMonth] = React.useState<Date | undefined>(undefined);

  // 외부 value 변경 시 draft 동기화 (DateRangeToggle과 동일)
  React.useEffect(() => {
    if (!isRange) return;
    setDraftRange(rangeValue);
    if (!month && rangeValue?.from) setMonth(rangeValue.from);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeValue?.from, rangeValue?.to]);

  const { pos: panelPosition, ready: panelReady } = usePanelPosition(open, containerRef, panelRef);

  // ── 공통: 외부 클릭 닫기 ──────────────────────────────────────────────────
  React.useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (containerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  // ── 공통: Escape 닫기 ─────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  // ── range 모드 핸들러 (DateRangeToggle과 동일) ────────────────────────────
  const handleToday = () => {
    const today = new Date();
    setDraftRange({ from: today, to: today });
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const handleCancel = () => {
    setDraftRange(rangeValue);
    setOpen(false);
  };

  const handleConfirm = () => {
    (props as DatePickerRangeProps).onChange?.(draftRange);
    setOpen(false);
  };

  // 바깥 날짜 클릭 시 해당 월로 이동 (DateRangeToggle과 동일)
  const handleDayClick: React.ComponentProps<typeof Calendar>['onDayClick'] = (day, modifiers) => {
    if (modifiers.outside) {
      setMonth(new Date(day.getFullYear(), day.getMonth(), 1));
    }
  };

  // single 날짜 선택 즉시 확정
  const handleSingleSelect = (date: Date | undefined) => {
    (props as DatePickerSingleProps).onChange?.(date);
    setOpen(false);
  };

  // ── range: 단일 날짜 선택 여부 판정 (DateRangeToggle과 동일) ──────────────
  const isRangeComplete = Boolean(draftRange?.from && draftRange?.to);
  const isSameDayRange = Boolean(
    draftRange?.from &&
      draftRange?.to &&
      draftRange.from.toDateString() === draftRange.to.toDateString(),
  );
  const isSingleDaySelection = Boolean(draftRange?.from && (!draftRange?.to || isSameDayRange));

  // ── 트리거 표시 텍스트 ────────────────────────────────────────────────────
  const defaultPlaceholder = isRange ? 'YYYY.MM.DD - YYYY.MM.DD' : 'YYYY.MM.DD';
  const resolvedPlaceholder = placeholder ?? defaultPlaceholder;

  const displayValue = isRange
    ? rangeValue?.from && rangeValue?.to
      ? `${format(rangeValue.from, 'yyyy.MM.dd')} - ${format(rangeValue.to, 'yyyy.MM.dd')}`
      : null
    : (props as DatePickerSingleProps).value
      ? format((props as DatePickerSingleProps).value!, 'yyyy.MM.dd')
      : null;

  // ── 패널 콘텐츠 ───────────────────────────────────────────────────────────
  const panelContent = isRange ? (
    // range: DateRangeToggle 패널과 완전히 동일한 구조
    <>
      <Calendar
        mode="range"
        locale={ko}
        month={month}
        onMonthChange={setMonth}
        selected={draftRange}
        onSelect={setDraftRange}
        onDayClick={handleDayClick}
        classNames={isSingleDaySelection ? singleDayRangeClassNames : undefined}
        showOutsideDays
        {...calendarProps}
      />
      <div className="mt-6 flex items-start justify-between px-4">
        <button
          type="button"
          className="h-10 cursor-pointer rounded-[6px] border border-[var(--color-input-border-disabled)] bg-white px-5 text-title-sm text-black"
          onClick={handleToday}
        >
          {todayLabel}
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="h-10 cursor-pointer rounded-lg border border-black bg-white px-5 text-title-sm text-black"
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
            onClick={handleConfirm}
          >
            {selectLabel}
          </button>
        </div>
      </div>
    </>
  ) : (
    // single: Calendar 컴포넌트 단독 (클릭 즉시 확정)
    <Calendar
      mode="single"
      locale={ko}
      selected={(props as DatePickerSingleProps).value}
      onSelect={handleSingleSelect}
      {...calendarProps}
    />
  );

  // ── 트리거 + 패널 ─────────────────────────────────────────────────────────
  const triggerEl = (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <button
        type="button"
        id={id}
        aria-label={explicitAriaLabel}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
        aria-invalid={hasError || undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          triggerBaseClass,
          !displayValue && 'text-[var(--color-label-alternative)]',
        )}
      >
        <span className="truncate text-body-3">{displayValue ?? resolvedPlaceholder}</span>
        <CalendarIcon
          className="size-6 shrink-0 text-[var(--color-label-assistive)]"
          aria-hidden
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label={isRange ? '기간 선택' : '날짜 선택'}
            className={panelClass}
            style={{ top: panelPosition.top, left: panelPosition.left, visibility: panelReady ? 'visible' : 'hidden' }}
          >
            {panelContent}
          </div>,
          document.body,
        )}
    </div>
  );

  const errorEl = errorMessage ? (
    <p id={errorId} className="ml-2 text-body-5 text-red-normal" role="alert">
      {errorMessage}
    </p>
  ) : null;

  if (label || errorEl) {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label id={labelId} htmlFor={id} className="ml-2 text-body-3 text-label-strong">
            {label}
          </label>
        )}
        {triggerEl}
        {errorEl}
      </div>
    );
  }

  return triggerEl;
}

export { DatePicker };
export type { DateRange };
