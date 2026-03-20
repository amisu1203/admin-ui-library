import * as React from 'react';
import { type DateRange } from 'react-day-picker';

import { cn } from '../lib/cn';
import { Checkbox } from './checkbox';
import { DateRangeToggle } from './date-range-toggle';
import { Select, type SelectOption } from './select';
import { ToggleGroup, type ToggleOption } from './toggle-group';

export interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxControlConfig {
  type: 'checkbox';
  options: FilterOption[];
  value: string | undefined;
  onOptionCheckedChange: (optionValue: string, nextChecked: boolean) => void;
}

export interface ToggleControlConfig {
  type: 'toggle';
  options: ToggleOption[];
  value?: string;
  onOptionSelect?: (optionValue: string) => void;
}

export interface ToggleCalendarControlConfig {
  type: 'toggle-calendar';
  options: ToggleOption[];
  value?: string;
  onOptionSelect?: (optionValue: string) => void;
  calendarOptionValue?: string;
  range?: DateRange;
  onRangeChange?: (range: DateRange | undefined) => void;
}

export interface SelectControlConfig {
  type: 'select';
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export type FilterControlConfig =
  | CheckboxControlConfig
  | ToggleControlConfig
  | ToggleCalendarControlConfig
  | SelectControlConfig;

export interface FilterRowConfig {
  key: string;
  label: string;
  control: FilterControlConfig;
}

export interface FilterBoxProps {
  rows: FilterRowConfig[];
  className?: string;
}

const rowClass = 'flex min-h-[60px] w-full items-stretch border-b border-gray-40 bg-white';
const labelCellClass =
  'flex w-40 shrink-0 items-center border-r border-gray-40 bg-gray-30 px-6 text-body-5 text-gray-80';
const optionsCellClass =
  'flex min-w-0 flex-1 items-center gap-4 overflow-x-auto px-5 py-3';
const selectCellClass = 'flex min-w-0 flex-1 items-center px-5 py-3';

function FilterBox({ rows, className }: FilterBoxProps) {
  return (
    <section
      className={cn(
        'overflow-visible rounded border border-gray-40 bg-white',
        className,
      )}
      aria-label="필터 박스"
    >
      {rows.map((row, index) => (
        <div
          key={row.key}
          className={cn(rowClass, index === rows.length - 1 && 'border-b-0')}
        >
          <div className={labelCellClass}>{row.label}</div>
          {row.control.type === 'select' ? (
            <div className={selectCellClass}>
              <Select
                options={row.control.options}
                value={row.control.value}
                onChange={row.control.onChange}
                placeholder={row.control.placeholder}
                className="w-[200px]"
              />
            </div>
          ) : (
            <div className={optionsCellClass}>
              {row.control.type === 'checkbox' ? (
                (() => {
                  const control = row.control;
                  return control.options.map((option) => {
                    const checked = control.value === option.value;
                    return (
                      <Checkbox
                        key={option.value}
                        label={option.label}
                        checked={checked}
                        disabled={option.disabled}
                        onCheckedChange={(nextChecked) =>
                          control.onOptionCheckedChange(
                            option.value,
                            nextChecked,
                          )
                        }
                      />
                    );
                  });
                })()
              ) : row.control.type === 'toggle' ? (
                <ToggleGroup
                  ariaLabel={`${row.label} 토글`}
                  options={row.control.options}
                  value={row.control.value}
                  onChange={row.control.onOptionSelect}
                />
              ) : (
                <DateRangeToggle
                  options={row.control.options}
                  value={row.control.value}
                  onChange={row.control.onOptionSelect}
                  calendarOptionValue={row.control.calendarOptionValue}
                  range={row.control.range}
                  onRangeChange={row.control.onRangeChange}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

export { FilterBox };
