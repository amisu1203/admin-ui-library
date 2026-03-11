# @daggle-dev/admin-ui

Daggle 디자인 시스템 기반의 React UI 컴포넌트 라이브러리입니다.
Tailwind CSS v4 + shadcn/ui 스타일을 기반으로 만들어졌습니다.

---

## 요구 사항

- React 18 이상
- Tailwind CSS v4 이상

---

## 설치

```bash
# npm
npm install @daggle-dev/admin-ui

# yarn
yarn add @daggle-dev/admin-ui

# pnpm
pnpm add @daggle-dev/admin-ui
```

---

## 시작하기

### 1. CSS 등록

프로젝트의 전역 CSS 파일(예: `globals.css`)에 아래 한 줄을 추가하세요.
디자인 토큰, 타이포그래피, 컴포넌트 스타일이 모두 자동으로 적용됩니다.

```css
@import 'tailwindcss';
@import '@daggle-dev/admin-ui/styles'; /* ← 이것만 추가하면 됩니다 */
```

> `@source` 설정은 따로 하지 않아도 됩니다. 라이브러리 내부에서 자동 처리합니다.

### 2. 컴포넌트 사용

```tsx
import { Button, Input, Toaster } from '@daggle-dev/admin-ui';
```

---

## 컴포넌트

### Button

기본적인 버튼 컴포넌트입니다. 다양한 `variant`와 `size`를 지원합니다.

#### 기본 사용

```tsx
import { Button } from '@daggle-dev/admin-ui';

<Button>저장</Button>
<Button variant="outline">취소</Button>
<Button variant="destructive">삭제</Button>
```

#### variant

| variant | 설명 |
|---|---|
| `default` / `fill` | 기본. primary 색상 배경 (둘 다 동일) |
| `outline` | 회색 테두리 |
| `outline-primary` | primary 색상 테두리 |
| `outline-strong` | 강한 회색 테두리 |
| `outline-natural` | 중간 회색 테두리 |
| `destructive` | 삭제/경고용 빨간색 |
| `secondary` | 보조 버튼 |
| `ghost` | 배경 없음 |
| `link` | 링크 스타일 |

```tsx
<Button variant="fill">저장</Button>
<Button variant="outline-primary">더보기</Button>
<Button variant="ghost">닫기</Button>
```

#### size

| size | 높이 | 설명 |
|---|---|---|
| `xsmall` | 32px | |
| `small` | 40px | |
| `medium` | 48px | 기본값 |
| `large` | 56px | |
| `xlarge` | 64px | |
| `icon` | 40px | 정사각형 아이콘 버튼 |
| `icon-xsmall` ~ `icon-xlarge` | 32~64px | 크기별 아이콘 버튼 |

```tsx
<Button size="small">작은 버튼</Button>
<Button size="large">큰 버튼</Button>
<Button size="icon"><SearchIcon /></Button>
```

#### 전체 너비

```tsx
<Button fullWidth>전체 너비 버튼</Button>
```

#### 비활성화

```tsx
<Button disabled>비활성화</Button>
```

#### asChild — 다른 요소에 버튼 스타일 적용

`asChild`를 사용하면 `<a>`, `<Link>` 같은 다른 요소에 버튼 스타일을 그대로 입힐 수 있습니다.

```tsx
import Link from 'next/link';
import { Button } from '@daggle-dev/admin-ui';

<Button asChild variant="outline-primary">
  <Link href="/dashboard">대시보드로 이동</Link>
</Button>
```

#### 아이콘과 함께 사용

```tsx
import { PlusIcon } from 'lucide-react';

<Button>
  <PlusIcon />
  새로 만들기
</Button>
```

---

### Input

텍스트 입력 컴포넌트입니다. 기본 `<input>`과 동일하게 사용할 수 있습니다.

#### 기본 사용

```tsx
import { Input } from '@daggle-dev/admin-ui';

<Input placeholder="이메일을 입력하세요" type="email" />
```

#### 상태별 스타일

hover, focus 상태는 자동으로 적용됩니다. 추가 설정이 필요 없습니다.

**비활성화**

```tsx
<Input disabled placeholder="입력 불가" />
```

**에러 상태**

`aria-invalid` 속성을 사용하면 빨간색 테두리가 자동으로 적용됩니다.

```tsx
<Input aria-invalid={true} />
```

#### 폼과 함께 사용 (react-hook-form)

```tsx
import { useForm } from 'react-hook-form';
import { Input } from '@daggle-dev/admin-ui';

function LoginForm() {
  const { register, formState: { errors } } = useForm();

  return (
    <Input
      type="email"
      placeholder="이메일"
      aria-invalid={!!errors.email}
      {...register('email')}
    />
  );
}
```

#### className으로 스타일 추가

```tsx
<Input className="max-w-sm" placeholder="제한된 너비" />
```

---

### Toaster

toast 알림 컴포넌트입니다. 앱 최상단에 한 번만 등록하고, 어디서든 `toast()`로 호출합니다.

#### 1. 앱 최상단에 등록

```tsx
// Next.js 기준: layout.tsx 또는 providers.tsx
import { Toaster } from '@daggle-dev/admin-ui';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />  {/* ← 여기에 한 번만 추가 */}
      </body>
    </html>
  );
}
```

#### 2. 어디서든 toast 호출

```tsx
import { toast } from 'sonner';

// 기본
toast('저장되었습니다.');

// 타입별
toast.success('성공적으로 완료되었습니다.');
toast.error('오류가 발생했습니다.');
toast.warning('주의가 필요합니다.');
toast.info('참고 사항입니다.');
toast.loading('처리 중...');

// 설명 추가
toast.success('저장 완료', {
  description: '변경사항이 저장되었습니다.',
});
```

#### 다크모드 / 테마 연동

`theme` prop을 생략하면 시스템 설정을 따릅니다.
`next-themes`를 사용한다면 아래처럼 직접 연결하세요.

```tsx
import { useTheme } from 'next-themes';
import { Toaster } from '@daggle-dev/admin-ui';
import type { ToasterProps } from 'sonner';

function Providers({ children }) {
  const { theme } = useTheme();
  return (
    <>
      {children}
      <Toaster theme={theme as ToasterProps['theme']} />
    </>
  );
}
```

---

## 디자인 토큰 커스터마이징

`@daggle-dev/admin-ui/styles`를 import한 뒤, CSS 변수를 override해서 브랜드 색상을 바꿀 수 있습니다.

```css
@import 'tailwindcss';
@import '@daggle-dev/admin-ui/styles';

/* 브랜드 컬러 변경 */
@layer base {
  :root {
    --color-primary-normal: #0070f3;
    --color-primary-natural: #0051bb;
  }
}
```

#### 주요 커스터마이징 변수

| 변수 | 기본값 | 용도 |
|---|---|---|
| `--color-primary-normal` | `#ff5e5e` | 버튼 기본 배경, 링크 색상 등 |
| `--color-primary-natural` | `#f09082` | 버튼 hover 배경 |
| `--color-primary-strong` | `#ce4848` | 강조 primary |
| `--color-gray-90` | `#151515` | 기본 텍스트, toast 배경 |
| `--color-input-border` | `#eeeff1` | Input 테두리 |
| `--color-input-focus` | `#4788ff` | Input 포커스 테두리 |

---

## 타입

TypeScript 타입이 기본 포함되어 있습니다. 별도 설치가 필요 없습니다.

```tsx
import type { ButtonProps, ButtonVariants } from '@daggle-dev/admin-ui';
import { buttonVariants } from '@daggle-dev/admin-ui';

// buttonVariants를 직접 활용해 className 생성
const cls = buttonVariants({ variant: 'outline', size: 'small' });
```

---

## 전체 예시

```tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button, Input, Toaster } from '@daggle-dev/admin-ui';

export default function Example() {
  const [value, setValue] = useState('');

  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-4 p-8">
        <Input
          placeholder="내용을 입력하세요"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          fullWidth
          onClick={() => toast.success('제출되었습니다!')}
          disabled={!value}
        >
          제출
        </Button>
      </div>
    </>
  );
}
```

---

## 라이선스

MIT
