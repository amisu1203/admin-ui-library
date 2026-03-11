# @daggle-dev/admin-ui

Daggle 디자인 시스템 기반 React UI 컴포넌트 라이브러리입니다.

## 목차

- [요구 사항](#요구-사항)
- [설치](#설치)
- [빠른 시작](#빠른-시작)
- [컴포넌트](#컴포넌트)
- [기간 선택 캘린더 사용 예시](#기간-선택-캘린더-사용-예시)
- [디자인 토큰](#디자인-토큰)
- [개발 스크립트](#개발-스크립트)
- [최근 변경 사항](#최근-변경-사항)
- [라이선스](#라이선스)

## 요구 사항

- React 18+
- Tailwind CSS v4+

## 설치

```bash
# npm
npm install @daggle-dev/admin-ui

# yarn
yarn add @daggle-dev/admin-ui

# pnpm
pnpm add @daggle-dev/admin-ui
```

## 빠른 시작

```css
@import 'tailwindcss';
@import '@daggle-dev/admin-ui/styles';
```

```tsx
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  ToggleGroup,
  FilterBox,
  DateRangeToggle,
  Toaster,
} from '@daggle-dev/admin-ui';
```

## 컴포넌트

- Form: `Input`, `Textarea`, `Select`, `Checkbox`
- Action: `Button`, `ToggleGroup`
- Filter: `FilterBox`, `DateRangeToggle`, `Calendar`
- Feedback: `Toaster`

## 기간 선택 캘린더 사용 예시

```tsx
import { useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { DateRangeToggle } from '@daggle-dev/admin-ui';

const options = [
  { value: 'all', label: '전체' },
  { value: 'week', label: '일주일' },
  { value: 'month', label: '한달' },
  { value: 'custom', label: '기간 선택' },
];

export default function Example() {
  const [mode, setMode] = useState('all');
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <DateRangeToggle
      options={options}
      value={mode}
      onChange={setMode}
      calendarOptionValue="custom"
      range={range}
      onRangeChange={setRange}
    />
  );
}
```

## 디자인 토큰

`@daggle-dev/admin-ui/styles` import 후 CSS 변수 override로 커스터마이징할 수 있습니다.

```css
@layer base {
  :root {
    --color-primary-normal: #0070f3;
    --color-primary-natural: #0051bb;
  }
}
```

## 개발 스크립트

```bash
pnpm dev         # dev 앱 실행
pnpm dev:lib     # 라이브러리 watch 빌드
pnpm type-check  # 타입 체크
pnpm test        # 테스트 실행
pnpm build       # 라이브러리 빌드
```

## 최근 변경 사항

- 필터 UI 컴포넌트 추가: `Checkbox`, `ToggleGroup`, `FilterBox`
- 기간 선택 컴포넌트 추가: `DateRangeToggle`, `Calendar`
- 캘린더 오버레이(Portal) 및 상/하 방향 자동 배치 지원
- 접근성 및 키보드 내비게이션 개선
- 테스트 환경(Vitest + Testing Library) 및 기본 테스트 추가

## 라이선스

MIT
