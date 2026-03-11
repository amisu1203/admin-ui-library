import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FilterBox, type FilterRowConfig } from './filter-box';
import {
  useCheckboxFilterControl,
  useToggleFilterControl,
} from '../hooks/use-filter-controls';

function CheckboxOnlyHarness() {
  const statusControl = useCheckboxFilterControl('all');

  const rows: FilterRowConfig[] = [
    {
      key: 'status',
      label: '강의 상태',
      control: {
        type: 'checkbox',
        value: statusControl.value,
        onOptionCheckedChange: statusControl.onOptionCheckedChange,
        options: [
          { value: 'all', label: '전체' },
          { value: 'selling', label: '판매 중' },
          { value: 'waiting', label: '대기 중' },
        ],
      },
    },
  ];

  return <FilterBox rows={rows} />;
}

function ToggleOnlyHarness() {
  const dateControl = useToggleFilterControl('today');

  const rows: FilterRowConfig[] = [
    {
      key: 'date',
      label: '등록일',
      control: {
        type: 'toggle',
        value: dateControl.value,
        onOptionSelect: dateControl.onOptionSelect,
        options: [
          { value: 'today', label: '오늘' },
          { value: 'week', label: '1주일' },
        ],
      },
    },
  ];

  return <FilterBox rows={rows} />;
}

describe('FilterBox', () => {
  it('체크박스 3개 구성에서 선택 상태를 변경할 수 있다', async () => {
    const user = userEvent.setup();
    render(<CheckboxOnlyHarness />);

    const allCheckbox = screen.getByRole('checkbox', { name: '전체' });
    const sellingCheckbox = screen.getByRole('checkbox', { name: '판매 중' });
    const waitingCheckbox = screen.getByRole('checkbox', { name: '대기 중' });

    expect(allCheckbox).toBeChecked();
    expect(sellingCheckbox).not.toBeChecked();
    expect(waitingCheckbox).not.toBeChecked();

    await user.click(sellingCheckbox);
    expect(allCheckbox).not.toBeChecked();
    expect(sellingCheckbox).toBeChecked();
    expect(waitingCheckbox).not.toBeChecked();
  });

  it('토글 2개 구성에서 단일 선택을 변경할 수 있다', async () => {
    const user = userEvent.setup();
    render(<ToggleOnlyHarness />);

    const today = screen.getByRole('radio', { name: '오늘' });
    const week = screen.getByRole('radio', { name: '1주일' });

    expect(today).toHaveAttribute('aria-checked', 'true');
    expect(week).toHaveAttribute('aria-checked', 'false');

    await user.click(week);

    expect(today).toHaveAttribute('aria-checked', 'false');
    expect(week).toHaveAttribute('aria-checked', 'true');
  });
});
