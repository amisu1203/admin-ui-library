import * as React from 'react';

import { cn } from '../lib/cn';
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './pagination';
import { Select } from './select';

// ─── PageSizeSelect ───────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 30, 50, 100];

export interface PageSizeSelectProps {
  value: number;
  onChange: (value: number) => void;
  /** 선택 가능한 페이지 사이즈 목록. 기본: [10, 30, 50, 100] */
  options?: number[];
  className?: string;
}

/**
 * PageSizeSelect — "n개씩 보기" 드롭다운.
 * Select 컴포넌트 래퍼로, 단독 또는 DataTablePagination 내에서 사용.
 */
function PageSizeSelect({
  value,
  onChange,
  options = DEFAULT_PAGE_SIZE_OPTIONS,
  className,
}: PageSizeSelectProps) {
  const selectOptions = options.map((n) => ({ value: String(n), label: `${n}개씩 보기` }));

  return (
    <Select
      value={String(value)}
      onChange={(v) => onChange(Number(v))}
      options={selectOptions}
      ariaLabel="페이지당 개수"
      className={cn('w-[140px] shrink-0', className)}
    />
  );
}

// ─── TableQueryInfo ───────────────────────────────────────────────────────────

export interface TableQueryInfoProps {
  /** 현재 페이지에서 조회된 건수 */
  currentCount: number;
  /** 전체 건수 */
  totalCount: number;
  /** true이면 loadingText를 표시 */
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
}

/**
 * TableQueryInfo — "n건 조회 / 총 n건" 조회 정보 텍스트.
 * 단독 사용 또는 DataTableToolbar 내에서 사용.
 */
function TableQueryInfo({
  currentCount,
  totalCount,
  isLoading = false,
  loadingText = '조회 중...',
  className,
}: TableQueryInfoProps) {
  return (
    <p className={cn('shrink-0 text-title-md text-gray-90', className)}>
      {isLoading ? loadingText : `${currentCount}건 조회 / 총 ${totalCount}건`}
    </p>
  );
}

// ─── DataTableToolbar ─────────────────────────────────────────────────────────

export interface DataTableToolbarProps {
  /** 조회 정보("n건 조회 / 총 n건") 표시 여부. 기본 true */
  showQueryInfo?: boolean;
  currentCount?: number;
  totalCount?: number;
  isLoading?: boolean;
  /**
   * 툴바 오른쪽 커스텀 영역.
   * 일괄 상태 변경, 삭제, 생성하기 등 액션 버튼을 여기에 배치.
   */
  children?: React.ReactNode;
  className?: string;
}

/**
 * DataTableToolbar — 조회 정보(왼쪽) + 커스텀 액션(오른쪽) 레이아웃.
 * 표시할 콘텐츠가 없으면 렌더링하지 않음.
 */
function DataTableToolbar({
  showQueryInfo = true,
  currentCount = 0,
  totalCount = 0,
  isLoading = false,
  children,
  className,
}: DataTableToolbarProps) {
  const hasContent = showQueryInfo || React.Children.count(children) > 0;
  if (!hasContent) return null;

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div>
        {showQueryInfo && (
          <TableQueryInfo
            currentCount={currentCount}
            totalCount={totalCount}
            isLoading={isLoading}
          />
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

// ─── getPageNumbers ───────────────────────────────────────────────────────────

/**
 * 현재 페이지 기준으로 표시할 페이지 번호 배열을 계산.
 * maxVisible(기본 5)개를 넘지 않도록 슬라이딩 윈도우 방식으로 처리.
 */
export function getPageNumbers(page: number, totalPages: number, maxVisible = 5): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// ─── DataTablePagination ──────────────────────────────────────────────────────

export interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** n개씩 보기 SelectBox 표시 여부. 기본 false */
  showPageSizeSelect?: boolean;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

/**
 * DataTablePagination — 페이지네이션 + 선택적 PageSizeSelect.
 * PageSizeSelect는 왼쪽 고정, 페이지 버튼은 항상 중앙 정렬.
 */
function DataTablePagination({
  page,
  totalPages,
  onPageChange,
  showPageSizeSelect = false,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions,
  className,
}: DataTablePaginationProps) {
  const pageNumbers = getPageNumbers(page, totalPages);
  const hasPageSizeSelect = showPageSizeSelect && !!onPageSizeChange;

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {hasPageSizeSelect && (
        <div className="absolute left-0">
          <PageSizeSelect value={pageSize} onChange={onPageSizeChange!} options={pageSizeOptions} />
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(page - 1)} disabled={page <= 1} />
          </PaginationItem>

          {pageNumbers.map((n) => (
            <PaginationItem key={n}>
              <PaginationButton isActive={n === page} onClick={() => onPageChange(n)}>
                {n}
              </PaginationButton>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

// ─── DataTable ────────────────────────────────────────────────────────────────

export interface DataTableProps {
  /**
   * 테이블 콘텐츠. <Table>, <TableHeader>, <TableBody> 등을 여기에 배치.
   * DataTable은 overflow 래퍼와 border만 제공하며 내부 구조에 개입하지 않음.
   */
  children: React.ReactNode;

  // ── Toolbar: 조회 정보 ──────────────────────────────────────────────────────
  /** 툴바 영역("n건 조회 / 총 n건" + 커스텀 액션) 표시 여부. 기본 true */
  showToolbar?: boolean;
  /** 조회 정보 텍스트 표시 여부. 기본 true */
  showQueryInfo?: boolean;
  currentCount?: number;
  totalCount?: number;
  isLoading?: boolean;
  /**
   * 툴바 오른쪽 커스텀 콘텐츠.
   * 일괄 상태 변경, 삭제, 생성하기 버튼 등을 여기에 배치.
   */
  toolbar?: React.ReactNode;

  // ── Pagination: 페이지 사이즈 ─────────────────────────────────────────────
  /** n개씩 보기 SelectBox 표시 여부. 기본 true */
  showPageSizeSelect?: boolean;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];

  // ── Pagination: 페이지 버튼 ───────────────────────────────────────────────
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  // ── Styling ───────────────────────────────────────────────────────────────
  className?: string;
  /** 테이블 overflow 래퍼에 추가할 클래스 (예: min-w-[1520px]는 Table에 직접 적용) */
  tableWrapperClassName?: string;
}

/**
 * DataTable — 툴바 + 테이블 래퍼 + 페이지네이션 통합 convenience 컴포넌트.
 *
 * ```tsx
 * <DataTable
 *   currentCount={items.length}
 *   totalCount={data.totalCount}
 *   page={page}
 *   totalPages={totalPages}
 *   onPageChange={setPage}
 *   pageSize={pageSize}
 *   onPageSizeChange={setPageSize}
 *   toolbar={<Button>생성하기</Button>}
 * >
 *   <Table>
 *     <TableHeader>...</TableHeader>
 *     <TableBody>...</TableBody>
 *   </Table>
 * </DataTable>
 * ```
 */
function DataTable({
  children,
  showToolbar = true,
  showQueryInfo = true,
  currentCount = 0,
  totalCount = 0,
  isLoading = false,
  toolbar,
  showPageSizeSelect = true,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions,
  page,
  totalPages,
  onPageChange,
  className,
  tableWrapperClassName,
}: DataTableProps) {
  const hasPagination =
    page !== undefined && totalPages !== undefined && onPageChange !== undefined;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {showToolbar && (
        <DataTableToolbar
          showQueryInfo={showQueryInfo}
          currentCount={currentCount}
          totalCount={totalCount}
          isLoading={isLoading}
        >
          {toolbar}
        </DataTableToolbar>
      )}

      <div
        className={cn(
          'overflow-hidden rounded-md border border-[var(--color-input-border)] bg-white',
          tableWrapperClassName,
        )}
      >
        {children}
      </div>

      {hasPagination && (
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showPageSizeSelect={showPageSizeSelect}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
}

// ─── useDataTableState ────────────────────────────────────────────────────────

export interface UseDataTableStateOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export interface UseDataTableStateReturn {
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  /** 페이지를 1로 초기화. 필터/검색 변경 시 호출. */
  resetPage: () => void;
}

/**
 * useDataTableState — 페이지 + 페이지 사이즈 상태 관리 훅.
 * 페이지 사이즈 변경 시 자동으로 1페이지로 초기화.
 *
 * ```tsx
 * const { page, pageSize, onPageChange, onPageSizeChange, resetPage } = useDataTableState();
 * // 검색/필터 변경 시
 * resetPage();
 * ```
 */
function useDataTableState({
  initialPage = 1,
  initialPageSize = 10,
}: UseDataTableStateOptions = {}): UseDataTableStateReturn {
  const [page, setPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const onPageChange = React.useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const onPageSizeChange = React.useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const resetPage = React.useCallback(() => {
    setPage(1);
  }, []);

  return { page, pageSize, onPageChange, onPageSizeChange, resetPage };
}

export {
  PageSizeSelect,
  TableQueryInfo,
  DataTableToolbar,
  DataTablePagination,
  DataTable,
  useDataTableState,
};
