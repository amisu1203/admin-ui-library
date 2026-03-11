/** 체크박스 필터 단일 선택: 선택 시 해당 값만, 해제 시 undefined */
export function updateCheckboxFilterValue(
  current: string | undefined,
  optionValue: string,
  nextChecked: boolean,
): string | undefined {
  return nextChecked ? optionValue : undefined;
}

export function updateToggleFilterValue(
  _current: string | undefined,
  optionValue: string,
): string {
  return optionValue;
}
