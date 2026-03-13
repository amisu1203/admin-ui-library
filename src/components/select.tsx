import * as React from 'react';

import { cn } from '../lib/cn';

/** Figma Dropdown trigger: bg white, border #EEEFF1, px-16 py-12, rounded-8, placeholder #C8C9D0, chevron 18px */
const triggerBaseClass =
  'h-12 w-full min-w-0 flex items-center justify-between gap-2 cursor-pointer rounded-lg border border-[var(--color-input-border)] bg-white pl-4 pr-4 py-3 text-body-3 outline-none transition-colors focus-visible:border-[var(--color-border-strong)] focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-[var(--color-input-border-disabled)] disabled:bg-[var(--color-input-bg-disabled)] disabled:text-gray-70 aria-invalid:border-red-normal aria-invalid:focus-visible:border-red-normal aria-invalid:focus-visible:ring-0 text-left';

/** Figma SelectItem list: white, border #EEEFF1, rounded-8, shadow. max-h로 넘치면 스크롤 */
const listBaseClass =
  'absolute left-0 right-0 z-50 max-h-60 overflow-y-auto overflow-x-hidden rounded-lg border border-[var(--color-input-border)] bg-white py-2 shadow-[0_4px_24px_rgba(0,0,0,0.1)]';

/** Figma SelectItem row: outer p-8, inner content p-12 → py-3 px-4 (12px 16px) */
const itemBaseClass =
  'flex w-full cursor-pointer items-center px-4 py-3 text-body-3 text-[var(--color-black-1)] outline-none transition-colors hover:bg-[var(--color-input-bg-hover)] focus-visible:bg-[var(--color-input-bg-hover)]';

/** Figma Multi Select Badge: bg #e9e9ec, px-8 py-4, rounded-4, text 14px label/strong */
const multiBadgeClass =
  'inline-flex shrink-0 items-center justify-center rounded px-2 py-1 text-body-5 text-[var(--color-label-strong)] bg-[var(--color-component-alternative)] whitespace-nowrap';

const chevronSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%23c8c9d0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectBaseProps {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  ariaLabel?: string;
  'aria-label'?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-invalid'?: boolean;
}

interface SelectSingleProps extends SelectBaseProps {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
}

interface SelectMultipleProps extends SelectBaseProps {
  multiple: true;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export type SelectProps = SelectSingleProps | SelectMultipleProps;

/**
 * Figma 스타일 셀렉트박스 (단일 / 다중 선택)
 * - 트리거: bg white, border #EEEFF1, px-16 py-12, rounded-8, placeholder #C8C9D0, chevron 18px
 * - 펼침 리스트: 흰 배경, border #EEEFF1, rounded-8, shadow 0 4px 24px, 아이템 p-12/px-16
 */
function Select(props: SelectProps) {
  const {
    options,
    placeholder,
    label,
    errorMessage,
    ariaLabel,
    'aria-label': ariaLabelFromProps,
    disabled,
    className,
    id: idProp,
    'aria-invalid': ariaInvalidProp,
  } = props;

  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const listboxId = `${id}-listbox`;
  const getOptionId = (index: number) => `${id}-option-${index}`;
  const explicitAriaLabel = ariaLabel ?? ariaLabelFromProps;
  const hasError = Boolean(errorMessage) || ariaInvalidProp === true;

  const isMultiple = props.multiple === true;
  const [open, setOpen] = React.useState(false);
  const [dropUp, setDropUp] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [liveAnnouncement, setLiveAnnouncement] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listboxRef = React.useRef<HTMLDivElement>(null);
  const isInitialMount = React.useRef(true);

  const selectValue = isMultiple
    ? (props as SelectMultipleProps).value ?? []
    : (props as SelectSingleProps).value ?? '';

  const isEmpty =
    !selectValue || (Array.isArray(selectValue) && selectValue.length === 0);

  const selectedValues = isMultiple ? (selectValue as string[]) : [];
  const selectedOptions = options.filter((o) => selectedValues.includes(o.value));

  const displayLabel = isEmpty
    ? null
    : !isMultiple
      ? options.find((o) => o.value === selectValue)?.label ?? null
      : null;

  const handleTriggerClick = () => {
    if (disabled) return;
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // max-h-60 = 240px, mt-2 = 8px → 248px 필요
      setDropUp(window.innerHeight - rect.bottom < 248);
    }
    setOpen((prev) => !prev);
  };

  const handleSelectSingle = (value: string) => {
    (props as SelectSingleProps).onChange?.(value);
    setOpen(false);
  };

  const handleSelectMultiple = (value: string) => {
    const current = (props as SelectMultipleProps).value ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    (props as SelectMultipleProps).onChange?.(next);
  };

  // 다중 선택 시 선택 개수 변경을 스크린 리더에 알림 (polite: 현재 읽기 완료 후 재생)
  React.useEffect(() => {
    if (!isMultiple) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const count = selectedValues.length;
    setLiveAnnouncement(count === 0 ? '선택 해제됨' : `${count}개 선택됨`);
  }, [isMultiple, selectedValues.length]);

  // 열릴 때 활성 옵션을 현재 선택값 또는 0으로 맞춤
  React.useEffect(() => {
    if (open && options.length > 0) {
      const idx = isMultiple
        ? 0
        : options.findIndex((o) => o.value === selectValue);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [open, options, selectValue, isMultiple]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // 키보드로 활성 옵션 변경 시 스크롤하여 보이게 함
  React.useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const el = document.getElementById(getOptionId(highlightedIndex));
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, highlightedIndex]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (open) {
          if (options[highlightedIndex]) {
            const opt = options[highlightedIndex];
            if (isMultiple) handleSelectMultiple(opt.value);
            else handleSelectSingle(opt.value);
          }
        } else {
          setOpen(true);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else if (options.length > 0) {
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0,
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (open && options.length > 0) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1,
          );
        }
        break;
      case 'Home':
        if (open) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      case 'End':
        if (open) {
          e.preventDefault();
          setHighlightedIndex(options.length - 1);
        }
        break;
      default:
        break;
    }
  };

  const triggerEl = (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* 다중 선택 시 선택 개수 변경 알림: polite로 현재 읽기 완료 후 재생, atomic으로 문장 전체 읽기 */}
      {isMultiple && (
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          role="status"
        >
          {liveAnnouncement}
        </div>
      )}
      <button
        type="button"
        data-slot="select"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={open && highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined}
        aria-label={explicitAriaLabel}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={errorMessage ? errorId : undefined}
        aria-invalid={hasError}
        disabled={disabled}
        className={cn(
          triggerBaseClass,
          isMultiple && selectedOptions.length > 0 && 'min-h-12 h-auto items-center py-3',
          !isMultiple && isEmpty && 'text-[var(--color-label-assistive)]',
        )}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        <span
          className={cn(
            'min-w-0 flex-1 text-left',
            isMultiple && selectedOptions.length > 0
              ? 'flex flex-wrap items-center gap-2'
              : 'truncate text-body-3',
          )}
        >
          {isMultiple && selectedOptions.length > 0 ? (
            selectedOptions.map((opt) => (
              <span key={opt.value} className={multiBadgeClass}>
                {opt.label}
              </span>
            ))
          ) : (
            <>{displayLabel ?? placeholder ?? ''}</>
          )}
        </span>
        <span
          className="size-[18px] shrink-0 bg-no-repeat bg-center bg-[length:18px_18px]"
          style={{ backgroundImage: `url("${chevronSvg}")` }}
          aria-hidden
        />
      </button>

      {open && (
        <div
          ref={listboxRef}
          id={listboxId}
          className={cn(listBaseClass, dropUp ? 'bottom-full mb-2' : 'top-full mt-2')}
          role="listbox"
          aria-multiselectable={isMultiple || undefined}
        >
          {options.map((opt, index) => {
            const selected = isMultiple
              ? (selectValue as string[]).includes(opt.value)
              : (selectValue as string) === opt.value;
            const isHighlighted = index === highlightedIndex;
            return (
              <div
                key={opt.value}
                id={getOptionId(index)}
                role="option"
                aria-selected={selected}
                className={cn(itemBaseClass, isHighlighted && 'bg-[var(--color-input-bg-hover)]')}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => {
                  if (isMultiple) handleSelectMultiple(opt.value);
                  else handleSelectSingle(opt.value);
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const errorEl = errorMessage ? (
    <p id={errorId} className="text-body-5 text-red-normal ml-2" role="alert">
      {errorMessage}
    </p>
  ) : null;

  if (label || errorEl) {
    return (
      <div className="flex flex-col gap-2">
        {label ? (
          <label
            id={labelId}
            htmlFor={id}
            className="text-body-3 text-label-strong ml-2"
          >
            {label}
          </label>
        ) : null}
        {triggerEl}
        {errorEl}
      </div>
    );
  }

  return triggerEl;
}

export { Select };
