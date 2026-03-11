import * as React from 'react';

import {
  updateCheckboxFilterValue,
  updateToggleFilterValue,
} from '../lib/filter-control-rules';

export function useCheckboxFilterControl(initialValue?: string) {
  const [value, setValue] = React.useState<string | undefined>(initialValue);

  const onOptionCheckedChange = React.useCallback(
    (optionValue: string, nextChecked: boolean) => {
      setValue((prev) =>
        updateCheckboxFilterValue(prev, optionValue, nextChecked),
      );
    },
    [],
  );

  return { value, setValue, onOptionCheckedChange };
}

export function useToggleFilterControl(initialValue?: string) {
  const [value, setValue] = React.useState<string | undefined>(initialValue);

  const onOptionSelect = React.useCallback((optionValue: string) => {
    setValue((prev) => updateToggleFilterValue(prev, optionValue));
  }, []);

  return { value, setValue, onOptionSelect };
}
