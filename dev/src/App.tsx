import { useState } from 'react';
import { type DateRange } from 'react-day-picker';
// DateRange는 DatePicker에서도 re-export 되므로 이쪽에서만 import
import {
  Button,
  Checkbox,
  DataTable,
  DataTablePagination,
  DataTableToolbar,
  DatePicker,
  FilterBox,
  Input,
  PageSizeSelect,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableQueryInfo,
  TableRow,
  Textarea,
  useCheckboxFilterControl,
  useDataTableState,
  useToggleFilterControl,
} from '@daggle-dev/admin-ui';
import type { FilterRowConfig } from '@daggle-dev/admin-ui';

// ─── 테이블 더미 데이터 ────────────────────────────────────────────────────────
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
};

const ALL_PRODUCTS: Product[] = Array.from({ length: 37 }, (_, i) => ({
  id: String(i + 1),
  name: `상품 ${i + 1}`,
  category: ['전자기기', '의류', '식품', '도서', '스포츠'][i % 5],
  price: (i + 1) * 9800,
  stock: (i * 7) % 120,
  status: (['active', 'inactive', 'pending'] as const)[i % 3],
  createdAt: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString('ko-KR'),
}));

const STATUS_LABEL: Record<Product['status'], string> = {
  active: '판매 중',
  inactive: '비활성',
  pending: '검토 중',
};

const STATUS_COLOR: Record<Product['status'], string> = {
  active: 'text-blue-normal',
  inactive: 'text-gray-60',
  pending: 'text-yellow-normal',
};

// ─── 과일 옵션 ────────────────────────────────────────────────────────────────
const fruitOptions = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'orange', label: '오렌지' },
  { value: 'grape', label: '포도' },
  { value: 'pineapple', label: '파인애플' },
  { value: 'strawberry', label: '딸기' },
  { value: 'watermelon', label: '수박' },
  { value: 'melon', label: '멜론' },
  { value: 'peach', label: '복숭아' },
  { value: 'pear', label: '배' },
  { value: 'plum', label: '자두' },
  { value: 'cherry', label: '버찌' },
];

export default function App() {
  const [single, setSingle] = useState('');
  const [multi, setMulti] = useState<string[]>([]);
  const [dateMode, setDateMode] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // ─── DatePicker 상태 ─────────────────────────────────────────────────────
  const [pickedDate, setPickedDate] = useState<Date | undefined>();
  const [pickedDateWithLabel, setPickedDateWithLabel] = useState<Date | undefined>();
  const [pickedDateError, setPickedDateError] = useState<Date | undefined>();
  const [pickedRange, setPickedRange] = useState<DateRange | undefined>();
  const [pickedRangeWithLabel, setPickedRangeWithLabel] = useState<DateRange | undefined>();

  // ─── 테이블 상태 ────────────────────────────────────────────────────────
  const { page, pageSize, onPageChange, onPageSizeChange } = useDataTableState({ initialPageSize: 10 });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const totalPages = Math.ceil(ALL_PRODUCTS.length / pageSize);
  const pagedItems = ALL_PRODUCTS.slice((page - 1) * pageSize, page * pageSize);
  const isAllSelected = pagedItems.length > 0 && pagedItems.every((p) => selectedIds.includes(p.id));

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pagedItems.map((p) => p.id).includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...pagedItems.map((p) => p.id)])]);
    }
  };
  const toggleOne = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  // FilterBox: 체크박스는 단일 선택, 값 변경 규칙은 훅에서 관리
  const statusControl = useCheckboxFilterControl('all');
  const dateControl = useToggleFilterControl('today');
  const categoryControl = useCheckboxFilterControl('all');
  const targetControl = useToggleFilterControl('all');
  const [selectCategory, setSelectCategory] = useState('');
  const [selectStatus, setSelectStatus] = useState('');

  const filterRowsCheckboxOnly: FilterRowConfig[] = [
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

  const filterRowsToggleOnly: FilterRowConfig[] = [
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

  const filterRowsMixed: FilterRowConfig[] = [
    {
      key: 'category',
      label: '카테고리',
      control: {
        type: 'checkbox',
        value: categoryControl.value,
        onOptionCheckedChange: categoryControl.onOptionCheckedChange,
        options: [
          { value: 'all', label: '전체' },
          { value: 'child', label: '유아' },
          { value: 'elementary', label: '초등' },
        ],
      },
    },
    {
      key: 'target',
      label: '대상',
      control: {
        type: 'toggle',
        value: targetControl.value,
        onOptionSelect: targetControl.onOptionSelect,
        options: [
          { value: 'all', label: '전체' },
          { value: 'project', label: '프로젝트' },
          { value: 'study', label: '자기주도스터디' },
        ],
      },
    },
  ];

  const dateOptions = [
    { value: 'all', label: '전체' },
    { value: 'week', label: '일주일' },
    { value: 'month', label: '한달' },
    { value: 'three-month', label: '세달' },
    { value: 'custom', label: '기간 선택' },
  ];

  const categoryOptions = [
    { value: 'all', label: '전체' },
    { value: 'electronics', label: '전자기기' },
    { value: 'clothing', label: '의류' },
    { value: 'food', label: '식품' },
    { value: 'book', label: '도서' },
    { value: 'sports', label: '스포츠' },
  ];

  const statusOptions = [
    { value: 'all', label: '전체' },
    { value: 'active', label: '판매 중' },
    { value: 'inactive', label: '비활성' },
    { value: 'pending', label: '검토 중' },
  ];

  const filterRowsWithSelect: FilterRowConfig[] = [
    {
      key: 'category',
      label: '카테고리',
      control: {
        type: 'select',
        options: categoryOptions,
        value: selectCategory,
        onChange: setSelectCategory,
        placeholder: '카테고리 선택',
      },
    },
    {
      key: 'status',
      label: '판매 상태',
      control: {
        type: 'select',
        options: statusOptions,
        value: selectStatus,
        onChange: setSelectStatus,
        placeholder: '상태 선택',
      },
    },
  ];

  const filterRowsWithCalendar: FilterRowConfig[] = [
    {
      key: 'registered',
      label: '등록일',
      control: {
        type: 'toggle-calendar',
        options: dateOptions,
        value: dateMode,
        onOptionSelect: setDateMode,
        calendarOptionValue: 'custom',
        range: dateRange,
        onRangeChange: setDateRange,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-30 p-12">
      <h1 className="text-display-sm text-gray-90 mb-8">
        Button Large 사이즈 테스트
      </h1>
      <div className="flex flex-wrap items-center gap-4">
        <Button size="large" variant="default">
          Large (default)
        </Button>
        <Button size="large" variant="fill">
          Large (fill)
        </Button>
        <Button size="large" variant="outline">
          Large (outline)
        </Button>
        <Button size="large" variant="outline-primary">
          Large (outline-primary)
        </Button>
        <Button size="large" variant="destructive">
          Large (destructive)
        </Button>
      </div>
      <div className="mt-12">
        <h2 className="text-h2-md text-gray-90 mb-4">
          Input 컴포넌트 테스트
        </h2>
        <div className="flex flex-col gap-4 w-96">
          <Input type="text" placeholder="기본 Input" />
          <Input
            type="text"
            label="라벨 있는 Input"
            placeholder="placeholder"
          />
          <Input
            type="text"
            label="필수 입력"
            placeholder="값을 입력하세요"
            aria-invalid
          />
          <Input
            type="text"
            label="이메일"
            placeholder="example@email.com"
            errorMessage="올바른 이메일 형식을 입력해 주세요."
          />
          <Input
            type="text"
            placeholder="에러 메시지만 (라벨 없음)"
            errorMessage="필수 입력 항목입니다."
          />
          <Input type="text" placeholder="Hover/포커스 확인용" />
          <Input type="text" placeholder="Disabled Input" disabled />
          <Input
            type="text"
            placeholder="Error 상태 (aria-invalid만)"
            aria-invalid
          />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-h2-md text-gray-90 mb-4">
          Textarea 컴포넌트 테스트
        </h2>
        <div className="flex flex-col gap-4 w-full max-w-[466px]">
          <Textarea placeholder="기본 Textarea" />
          <Textarea
            label="라벨 있는 Textarea"
            placeholder="placeholder"
          />
          <Textarea
            label="의견 입력"
            placeholder="내용을 입력해 주세요."
            ariaLabel="사용자 의견 입력"
          />
          <Textarea
            label="의견"
            placeholder="내용을 입력해 주세요."
            errorMessage="최소 10자 이상 입력해 주세요."
          />
          <Textarea placeholder="Disabled Textarea" disabled />
          <Textarea
            placeholder="Error 상태 (aria-invalid)"
            aria-invalid
          />
          <Textarea
            placeholder="에러 메시지만 (라벨 없음)"
            errorMessage="필수 입력 항목입니다."
          />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-h2-md text-gray-90 mb-4">
          Select 컴포넌트 테스트
        </h2>
        <div className="flex flex-col gap-4 w-96">
          <Select
            options={fruitOptions}
            label="단일 선택"
            placeholder="과일을 선택하세요"
            value={single}
            onChange={setSingle}
          />
          <Select
            options={fruitOptions}
            label="다중 선택"
            multiple
            value={multi}
            onChange={setMulti}
            placeholder="여러 개 선택 (Ctrl+클릭)"
          />
          <Select
            options={fruitOptions}
            label="카테고리"
            placeholder="선택하세요"
            errorMessage="항목을 선택해 주세요."
          />
          <Select
            options={fruitOptions}
            placeholder="Disabled"
            disabled
          />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-h2-md text-gray-90 mb-4">
          FilterBox 컴포넌트 테스트
        </h2>
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-body-5 text-gray-70 mb-2">
              체크박스 3개만 구성
            </p>
            <FilterBox rows={filterRowsCheckboxOnly} />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">
              토글 2개만 구성
            </p>
            <FilterBox rows={filterRowsToggleOnly} />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">
              혼합 (체크박스 행 + 토글 행)
            </p>
            <FilterBox rows={filterRowsMixed} />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">
              FilterBox 내 등록일 행 (기간 선택 시 캘린더 노출)
            </p>
            <FilterBox rows={filterRowsWithCalendar} />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">
              FilterBox 내 Select 드롭다운 (portal로 FilterBox 밖에 렌더)
            </p>
            <FilterBox rows={filterRowsWithSelect} />
          </div>
        </div>
      </div>

      {/* ── DatePicker ──────────────────────────────────────────────────── */}
      <div className="mt-12">
        <h2 className="text-h2-md text-gray-90 mb-4">DatePicker 컴포넌트 테스트</h2>

        <h3 className="text-h2-sm text-gray-80 mb-3">mode="single" (단일 날짜)</h3>
        <div className="flex flex-col gap-6 w-80 mb-10">
          <div>
            <p className="text-body-5 text-gray-70 mb-2">기본 (placeholder)</p>
            <DatePicker value={pickedDate} onChange={setPickedDate} />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">
              라벨 + 선택된 날짜: {pickedDateWithLabel?.toLocaleDateString('ko-KR') ?? '없음'}
            </p>
            <DatePicker
              label="시작일"
              value={pickedDateWithLabel}
              onChange={setPickedDateWithLabel}
            />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">에러 상태</p>
            <DatePicker
              label="종료일"
              value={pickedDateError}
              onChange={setPickedDateError}
              errorMessage="날짜를 선택해 주세요."
            />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">비활성</p>
            <DatePicker label="등록일" disabled />
          </div>
        </div>

        <h3 className="text-h2-sm text-gray-80 mb-3">mode="range" (기간 선택)</h3>
        <div className="flex flex-col gap-6 w-80">
          <div>
            <p className="text-body-5 text-gray-70 mb-2">
              기본 — 선택된 기간:{' '}
              {pickedRange?.from && pickedRange?.to
                ? `${pickedRange.from.toLocaleDateString('ko-KR')} ~ ${pickedRange.to.toLocaleDateString('ko-KR')}`
                : '없음'}
            </p>
            <DatePicker mode="range" value={pickedRange} onChange={setPickedRange} />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">
              라벨 + 선택된 기간:{' '}
              {pickedRangeWithLabel?.from && pickedRangeWithLabel?.to
                ? `${pickedRangeWithLabel.from.toLocaleDateString('ko-KR')} ~ ${pickedRangeWithLabel.to.toLocaleDateString('ko-KR')}`
                : '없음'}
            </p>
            <DatePicker
              mode="range"
              label="조회 기간"
              value={pickedRangeWithLabel}
              onChange={setPickedRangeWithLabel}
            />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">에러 상태</p>
            <DatePicker
              mode="range"
              label="등록 기간"
              errorMessage="기간을 선택해 주세요."
            />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">비활성</p>
            <DatePicker mode="range" label="기간" disabled />
          </div>
        </div>
      </div>

      {/* ── Table Primitives ────────────────────────────────────────────── */}
      <div className="mt-12">
        <h2 className="text-h2-md text-gray-90 mb-4">Table Primitives 테스트</h2>
        <div className="overflow-hidden rounded-md border border-[var(--color-input-border)] bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-30 hover:bg-gray-30">
                <TableHead className="w-12 border-r border-[var(--color-input-border)] px-0">
                  <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} aria-label="전체 선택" />
                </TableHead>
                <TableHead className="border-r border-[var(--color-input-border)]">상품명</TableHead>
                <TableHead className="w-28 border-r border-[var(--color-input-border)]">카테고리</TableHead>
                <TableHead className="w-32 border-r border-[var(--color-input-border)]">가격</TableHead>
                <TableHead className="w-20 border-r border-[var(--color-input-border)]">재고</TableHead>
                <TableHead className="w-24">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedItems.length === 0 ? (
                <TableRow className="hover:bg-white">
                  <TableCell colSpan={6} className="text-gray-70 h-24">조회된 상품이 없습니다.</TableCell>
                </TableRow>
              ) : (
                pagedItems.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <TableRow
                      key={item.id}
                      className={isChecked ? 'bg-[#fffaf9] hover:bg-[#fffaf9]' : 'bg-white'}
                    >
                      <TableCell className="w-12 border-r border-[var(--color-input-border)] px-0">
                        <Checkbox checked={isChecked} onCheckedChange={() => toggleOne(item.id)} aria-label={`${item.name} 선택`} />
                      </TableCell>
                      <TableCell className="border-r border-[var(--color-input-border)] text-left">{item.name}</TableCell>
                      <TableCell className="w-28 border-r border-[var(--color-input-border)]">{item.category}</TableCell>
                      <TableCell className="w-32 border-r border-[var(--color-input-border)]">{item.price.toLocaleString('ko-KR')}원</TableCell>
                      <TableCell className="w-20 border-r border-[var(--color-input-border)]">{item.stock}</TableCell>
                      <TableCell className={`w-24 font-semibold ${STATUS_COLOR[item.status]}`}>{STATUS_LABEL[item.status]}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Pattern Layer (Toolbar / Pagination 단독) ───────────────────── */}
      <div className="mt-12">
        <h2 className="text-h2-md text-gray-90 mb-4">Pattern Layer 단독 테스트</h2>
        <div className="flex flex-col gap-4 bg-white rounded-lg p-6 border border-[var(--color-input-border)]">
          <div>
            <p className="text-body-5 text-gray-70 mb-2">TableQueryInfo</p>
            <TableQueryInfo currentCount={pagedItems.length} totalCount={ALL_PRODUCTS.length} />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">TableQueryInfo (로딩 중)</p>
            <TableQueryInfo currentCount={0} totalCount={0} isLoading />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">PageSizeSelect</p>
            <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">DataTableToolbar (조회 정보 + 버튼 슬롯)</p>
            <DataTableToolbar
              currentCount={pagedItems.length}
              totalCount={ALL_PRODUCTS.length}
            >
              <Button variant="outline-natural" size="medium" disabled={selectedIds.length === 0}>
                상태 변경
              </Button>
              <Button variant="fill" size="medium">생성하기</Button>
            </DataTableToolbar>
          </div>
          <div>
            <p className="text-body-5 text-gray-70 mb-2">DataTablePagination (PageSizeSelect 포함)</p>
            <DataTablePagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
              showPageSizeSelect
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </div>
      </div>

      {/* ── DataTable (통합 컴포넌트) ────────────────────────────────────── */}
      <div className="mt-12">
        <h2 className="text-h2-md text-gray-90 mb-4">DataTable 통합 컴포넌트 테스트</h2>
        <DataTable
          currentCount={pagedItems.length}
          totalCount={ALL_PRODUCTS.length}
          toolbar={
            <>
              <Button variant="outline-natural" size="medium" disabled={selectedIds.length === 0}>
                상태 변경 ({selectedIds.length}건)
              </Button>
              <Button variant="fill" size="medium">생성하기</Button>
            </>
          }
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showPageSizeSelect
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        >
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-gray-30 hover:bg-gray-30">
                <TableHead className="w-12 border-r border-[var(--color-input-border)] px-0">
                  <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} aria-label="전체 선택" />
                </TableHead>
                <TableHead className="border-r border-[var(--color-input-border)]">상품명</TableHead>
                <TableHead className="w-28 border-r border-[var(--color-input-border)]">카테고리</TableHead>
                <TableHead className="w-32 border-r border-[var(--color-input-border)]">가격</TableHead>
                <TableHead className="w-20 border-r border-[var(--color-input-border)]">재고</TableHead>
                <TableHead className="w-28 border-r border-[var(--color-input-border)]">등록일</TableHead>
                <TableHead className="w-24">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedItems.map((item) => {
                const isChecked = selectedIds.includes(item.id);
                return (
                  <TableRow
                    key={item.id}
                    className={isChecked ? 'bg-[#fffaf9] hover:bg-[#fffaf9]' : 'bg-white'}
                  >
                    <TableCell className="w-12 border-r border-[var(--color-input-border)] px-0">
                      <Checkbox checked={isChecked} onCheckedChange={() => toggleOne(item.id)} aria-label={`${item.name} 선택`} />
                    </TableCell>
                    <TableCell className="border-r border-[var(--color-input-border)] text-left">{item.name}</TableCell>
                    <TableCell className="w-28 border-r border-[var(--color-input-border)]">{item.category}</TableCell>
                    <TableCell className="w-32 border-r border-[var(--color-input-border)]">{item.price.toLocaleString('ko-KR')}원</TableCell>
                    <TableCell className="w-20 border-r border-[var(--color-input-border)]">{item.stock}</TableCell>
                    <TableCell className="w-28 border-r border-[var(--color-input-border)]">{item.createdAt}</TableCell>
                    <TableCell className={`w-24 font-semibold ${STATUS_COLOR[item.status]}`}>{STATUS_LABEL[item.status]}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DataTable>
      </div>

      <div className='py-[400px]'/>
    </div>
  );
}
