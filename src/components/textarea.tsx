import * as React from 'react';

import { cn } from '../lib/cn';

const textareaBaseClass =
  'min-h-[200px] w-full resize-none min-w-0 rounded-lg border bg-white px-4 py-3 text-body-3 text-gray-90 outline-none transition-colors placeholder:text-[var(--color-input-placeholder)] selection:bg-primary-normal selection:text-label-white border-[var(--color-input-border)] focus-visible:border-border-strong focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-[var(--color-input-border-disabled)] disabled:bg-[var(--color-input-bg-disabled)] disabled:text-gray-70 aria-invalid:border-red-normal aria-invalid:focus-visible:border-red-normal aria-invalid:focus-visible:ring-0';

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  /** 라벨 텍스트. 지정 시 텍스트에리어 위에 Figma 스타일 라벨이 렌더링됩니다. */
  label?: string;
  /** 스크린 리더용 접근 가능 이름. label 없을 때 사용 권장. */
  ariaLabel?: string;
  /** 에러 메시지. 있으면 텍스트에리어 아래에 빨간 텍스트로 표시되고 aria-invalid, aria-describedby가 설정됩니다. */
  errorMessage?: string;
}

/**
 * Figma TextArea 스타일 적용
 *
 * CSS 변수는 @daggle-dev/admin-ui/styles import 시 자동 정의됩니다.
 * - Default: 흰 배경, border input-border, min-h-200px, px-4 py-3, rounded-lg, text-body-3
 * - Focus:    border border-strong(#000000)만, 링 없음 (Figma Border-상태/Strong)
 * - Disabled: bg input-bg-disabled, border input-border-disabled
 * - Error:    aria-invalid 속성 사용 시 red-normal 테두리
 * - Label:    label prop 사용 시 라벨( text-body-3, label-strong ), 라벨 왼쪽 8px, 영역과 gap-2(8px)
 * - 접근성:   label 있으면 aria-labelledby로 연결, ariaLabel/errorMessage로 aria-describedby 연결
 */
function Textarea({
  className,
  label,
  id: idProp,
  ariaLabel,
  'aria-label': ariaLabelFromProps,
  errorMessage,
  'aria-invalid': ariaInvalidProp,
  ...props
}: TextareaProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const explicitAriaLabel = ariaLabel ?? ariaLabelFromProps;
  const hasError = Boolean(errorMessage) || ariaInvalidProp === true;

  const textareaEl = (
    <textarea
      data-slot="textarea"
      id={id}
      className={cn(textareaBaseClass, className)}
      aria-label={explicitAriaLabel}
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={errorMessage ? errorId : undefined}
      aria-invalid={hasError}
      {...props}
    />
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
        {textareaEl}
        {errorEl}
      </div>
    );
  }

  return textareaEl;
}

export { Textarea };
