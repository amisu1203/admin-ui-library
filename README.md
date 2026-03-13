# @daggle-dev/admin-ui

Daggle 디자인 시스템 기반 React UI 컴포넌트 라이브러리입니다.

## 목차

- [요구 사항](#요구-사항)
- [설치](#설치)
- [빠른 시작](#빠른-시작)
- [컴포넌트 목록](#컴포넌트-목록)
- [컴포넌트 사용 예시](#컴포넌트-사용-예시)
  - [Button](#button)
  - [Select](#select)
  - [Table](#table)
  - [Pagination](#pagination)
  - [DataTable — 통합 테이블](#datatable--통합-테이블)
  - [DataTablePagination](#datatablepagination)
  - [DataTableToolbar / TableQueryInfo / PageSizeSelect](#datatabletoolbar--tablequeryinfo--pagesizeselect)
  - [FilterBox / DateRangeToggle](#filterbox--daterangetoggle)
- [디자인 토큰 커스터마이징](#디자인-토큰-커스터마이징)
- [개발 스크립트](#개발-스크립트)
- [라이선스](#라이선스)

---

## 요구 사항

- React 18+
- Tailwind CSS v4+

## 설치

```bash
npm install @daggle-dev/admin-ui
# or
pnpm add @daggle-dev/admin-ui
```

## 빠른 시작

CSS 진입점에 스타일을 import합니다.

```css
/* globals.css 또는 app.css */
@import 'tailwindcss';
@import '@daggle-dev/admin-ui/styles';
```

---

## 컴포넌트 목록

| 카테고리 | 컴포넌트 |
|---|---|
| **Form** | `Input`, `Textarea`, `Select`, `Checkbox` |
| **Action** | `Button`, `ToggleGroup` |
| **Filter** | `FilterBox`, `DateRangeToggle`, `Calendar` |
| **Table** | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` |
| **Pagination** | `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationButton`, `PaginationPrevious`, `PaginationNext` |
| **DataTable** | `DataTable`, `DataTableToolbar`, `DataTablePagination`, `PageSizeSelect`, `TableQueryInfo` |
| **Hooks** | `useDataTableState`, `useCheckboxFilterControl`, `useToggleFilterControl` |
| **Feedback** | `Toaster` |

---

## 컴포넌트 사용 예시

### Button

`variant`와 `size`로 스타일을 제어합니다. outline 계열은 모두 1px border입니다.

```tsx
import { Button } from '@daggle-dev/admin-ui';

// 기본 (fill)
<Button>저장</Button>

// outline 계열
<Button variant="outline">삭제</Button>
<Button variant="outline-primary">수정</Button>
<Button variant="outline-natural">상태 변경</Button>
<Button variant="outline-strong">확인</Button>

// 크기
<Button size="xsmall">상세 보기</Button>
<Button size="medium">생성하기</Button>

// 전체 너비
<Button fullWidth>로그인</Button>

// 비활성
<Button disabled>비활성</Button>

// Link처럼 사용 (asChild)
<Button asChild variant="fill">
  <a href="/create">강의 생성</a>
</Button>
```

---

### Select

드롭다운이 뷰포트 하단에 걸리면 자동으로 위쪽으로 열립니다.

```tsx
import { Select } from '@daggle-dev/admin-ui';

// 단일 선택
const [value, setValue] = useState('');

<Select
  label="상태"
  placeholder="선택하세요"
  options={[
    { value: 'active', label: '활성' },
    { value: 'inactive', label: '비활성' },
  ]}
  value={value}
  onChange={setValue}
/>

// 다중 선택
const [values, setValues] = useState<string[]>([]);

<Select
  multiple
  label="카테고리"
  placeholder="카테고리를 선택하세요"
  options={options}
  value={values}
  onChange={setValues}
/>

// 에러 상태
<Select
  label="필수 항목"
  options={options}
  value={value}
  onChange={setValue}
  errorMessage="값을 선택해 주세요."
/>
```

---

### Table

`Table` 은 내부에 수평 스크롤 래퍼를 내장합니다. 각 서브 컴포넌트는 `className`으로 스타일을 덮어쓸 수 있습니다.

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@daggle-dev/admin-ui';

<Table>
  <TableHeader>
    {/* 헤더 행 배경은 className으로 지정 */}
    <TableRow className="bg-gray-30 hover:bg-gray-30">
      <TableHead>이름</TableHead>
      <TableHead>상태</TableHead>
      <TableHead>등록일</TableHead>
      <TableHead>관리</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.status}</TableCell>
        <TableCell>{item.createdAt}</TableCell>
        <TableCell>
          <Button variant="outline" size="xsmall">상세 보기</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### 열 너비 지정

```tsx
<TableHead className="w-[50px]">선택</TableHead>
<TableHead className="w-[372px]">제목</TableHead>
<TableHead className="w-[130px]">상태</TableHead>
```

#### 빈 상태 처리

```tsx
<TableBody>
  {items.length === 0 ? (
    <TableRow className="hover:bg-white">
      <TableCell colSpan={4} className="text-gray-70 h-24">
        조회된 데이터가 없습니다.
      </TableCell>
    </TableRow>
  ) : (
    items.map((item) => <TableRow key={item.id}>...</TableRow>)
  )}
</TableBody>
```

#### 행 선택 하이라이트

```tsx
import { cn } from '@/lib/utils'; // 프로젝트의 cn 유틸

<TableRow
  className={cn(
    isSelected ? 'bg-[#fffaf9] hover:bg-[#fffaf9]' : 'bg-white',
  )}
>
```

---

### Pagination

페이지네이션 primitive를 직접 조합해 완전히 커스텀할 수 있습니다.

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationPrevious,
  PaginationNext,
} from '@daggle-dev/admin-ui';

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        onClick={() => setPage((p) => p - 1)}
        disabled={page <= 1}
      />
    </PaginationItem>

    {[1, 2, 3, 4, 5].map((n) => (
      <PaginationItem key={n}>
        <PaginationButton
          isActive={n === page}
          onClick={() => setPage(n)}
        >
          {n}
        </PaginationButton>
      </PaginationItem>
    ))}

    <PaginationItem>
      <PaginationNext
        onClick={() => setPage((p) => p + 1)}
        disabled={page >= totalPages}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

### DataTable — 통합 테이블

`DataTable` 은 **툴바 + 테이블 래퍼 + 페이지네이션**을 하나의 컴포넌트로 제공하는 convenience 레이어입니다. `children`에 `<Table>` 을 그대로 넘기면 됩니다.

```tsx
import {
  DataTable,
  useDataTableState,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
} from '@daggle-dev/admin-ui';

function LectureListPage() {
  const { page, pageSize, onPageChange, onPageSizeChange, resetPage } =
    useDataTableState({ initialPageSize: 10 });

  const { data, isLoading } = useLecturesQuery({ page, pageSize });
  const totalPages = Math.ceil((data?.totalCount ?? 0) / pageSize);

  // 검색/필터 변경 시 페이지 초기화
  const handleFilterChange = (filters) => {
    setFilters(filters);
    resetPage();
  };

  return (
    <DataTable
      // 조회 정보
      currentCount={data?.items.length ?? 0}
      totalCount={data?.totalCount ?? 0}
      isLoading={isLoading}
      // 툴바 오른쪽 커스텀 액션
      toolbar={
        <>
          <Button variant="outline-natural" disabled={!hasSelection}>
            상태 변경
          </Button>
          <Button variant="outline" disabled={!hasSelection}>
            삭제
          </Button>
          <Button variant="fill">생성하기</Button>
        </>
      }
      // 페이지네이션
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      // n개씩 보기 (끄려면 showPageSizeSelect={false})
      showPageSizeSelect
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
    >
      <Table className="min-w-[1200px]">
        <TableHeader>
          <TableRow className="bg-gray-30 hover:bg-gray-30">
            <TableHead>제목</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>등록일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTable>
  );
}
```

#### DataTable Props

| Prop | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `children` | `ReactNode` | — | `<Table>` 콘텐츠 |
| `showToolbar` | `boolean` | `true` | 툴바 영역 on/off |
| `showQueryInfo` | `boolean` | `true` | "n건 조회 / 총 n건" on/off |
| `currentCount` | `number` | `0` | 현재 페이지 조회 건수 |
| `totalCount` | `number` | `0` | 전체 건수 |
| `isLoading` | `boolean` | `false` | true이면 "조회 중..." 표시 |
| `toolbar` | `ReactNode` | — | 툴바 오른쪽 커스텀 슬롯 |
| `showPageSizeSelect` | `boolean` | `true` | n개씩 보기 on/off |
| `pageSize` | `number` | `10` | 현재 페이지 사이즈 |
| `onPageSizeChange` | `(n: number) => void` | — | 페이지 사이즈 변경 핸들러 |
| `pageSizeOptions` | `number[]` | `[10, 30, 50, 100]` | 선택 가능한 사이즈 목록 |
| `page` | `number` | — | 현재 페이지 (없으면 페이지네이션 숨김) |
| `totalPages` | `number` | — | 전체 페이지 수 |
| `onPageChange` | `(n: number) => void` | — | 페이지 변경 핸들러 |
| `tableWrapperClassName` | `string` | — | 테이블 border 래퍼 추가 클래스 |

---

### DataTablePagination

페이지 버튼은 항상 중앙 정렬, `PageSizeSelect`는 왼쪽에 독립적으로 위치합니다. `DataTable` 없이 단독 사용도 가능합니다.

```tsx
import { DataTablePagination } from '@daggle-dev/admin-ui';

// 기본 (페이지 버튼만)
<DataTablePagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>

// n개씩 보기 포함
<DataTablePagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
  showPageSizeSelect
  pageSize={pageSize}
  onPageSizeChange={setPageSize}
  pageSizeOptions={[10, 30, 50, 100, 1000]}
/>
```

---

### DataTableToolbar / TableQueryInfo / PageSizeSelect

각 요소를 개별적으로 꺼내 쓸 수 있습니다. 레이아웃이 다른 경우에 유용합니다.

```tsx
import {
  DataTableToolbar,
  TableQueryInfo,
  PageSizeSelect,
} from '@daggle-dev/admin-ui';

// DataTableToolbar: 조회 정보(왼쪽) + 커스텀 슬롯(오른쪽)
<DataTableToolbar
  currentCount={10}
  totalCount={120}
  isLoading={isLoading}
>
  <Button variant="fill">생성하기</Button>
</DataTableToolbar>

// TableQueryInfo 단독 사용
<TableQueryInfo currentCount={10} totalCount={120} />
<TableQueryInfo isLoading loadingText="불러오는 중..." />

// PageSizeSelect 단독 사용
<PageSizeSelect
  value={pageSize}
  onChange={setPageSize}
  options={[10, 50, 100]}
/>
```

---

### FilterBox / DateRangeToggle

```tsx
import {
  FilterBox,
  DateRangeToggle,
  useCheckboxFilterControl,
  useToggleFilterControl,
} from '@daggle-dev/admin-ui';
import { type DateRange } from 'react-day-picker';

function SearchFilters({ onChange }) {
  const statusControl = useCheckboxFilterControl(['active', 'inactive', 'draft']);
  const periodControl = useToggleFilterControl(['all', 'week', 'month', 'custom']);
  const [range, setRange] = useState<DateRange | undefined>();

  const handleChange = () => {
    onChange({
      status: statusControl.value || undefined,
      period: periodControl.value === 'all' ? undefined : periodControl.value,
    });
  };

  return (
    <FilterBox
      rows={[
        {
          label: '상태',
          control: { type: 'checkbox', ...statusControl },
        },
        {
          label: '등록일',
          control: {
            type: 'toggle-calendar',
            ...periodControl,
            calendarOptionValue: 'custom',
            range,
            onRangeChange: setRange,
          },
        },
      ]}
      onChange={handleChange}
    />
  );
}
```

---

### useDataTableState

페이지 + 페이지 사이즈 상태를 한 번에 관리하는 훅입니다. 페이지 사이즈 변경 시 자동으로 1페이지로 초기화됩니다.

```tsx
import { useDataTableState } from '@daggle-dev/admin-ui';

const {
  page,           // 현재 페이지 (number)
  pageSize,       // 현재 페이지 사이즈 (number)
  onPageChange,   // (page: number) => void
  onPageSizeChange, // (size: number) => void — 호출 시 자동으로 1페이지 초기화
  resetPage,      // () => void — 검색/필터 변경 시 수동으로 1페이지 초기화
} = useDataTableState({ initialPage: 1, initialPageSize: 10 });

// 검색 버튼 클릭 시
const handleSearch = () => {
  setSearchQuery(input);
  resetPage(); // 검색 결과 첫 페이지부터 표시
};
```

---

## 디자인 토큰 커스터마이징

`@daggle-dev/admin-ui/styles` import 후 CSS 변수를 override합니다.

```css
@import 'tailwindcss';
@import '@daggle-dev/admin-ui/styles';

/* 브랜드 컬러 교체 */
@layer base {
  :root {
    --color-primary-normal: #0070f3;
    --color-primary-natural: #0051bb;
    --color-primary-strong: #003d99;
  }
}
```

#### 주요 토큰 목록

| 토큰 | 기본값 | 용도 |
|---|---|---|
| `--color-primary-normal` | `#ff5e5e` | 버튼, 활성 페이지, 포커스 링 |
| `--color-primary-natural` | `#f09082` | 버튼 hover |
| `--color-gray-30` | `#f6f7fa` | 테이블 헤더 배경, row hover |
| `--color-gray-70` | `#959bb1` | 비활성 텍스트 |
| `--color-gray-80` | `#565962` | 보조 텍스트 |
| `--color-gray-90` | `#151515` | 기본 텍스트 |
| `--color-input-border` | `#eeeff1` | 입력창·테이블·페이지네이션 border |
| `--color-input-bg-hover` | `#f9fafa` | 드롭다운 hover 배경 |
| `--color-red-normal` | `#e61919` | 에러 메시지, destructive 버튼 |
| `--color-blue-normal` | `#0059ff` | 포커스 링 |

---

## 개발 스크립트

```bash
pnpm dev         # dev 앱 실행
pnpm dev:lib     # 라이브러리 watch 빌드
pnpm type-check  # 타입 체크
pnpm test        # 테스트 실행
pnpm build       # 라이브러리 빌드
```

---

## 라이선스

MIT
