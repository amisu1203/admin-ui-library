import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '../lib/cn';

/**
 * Pagination — 조합 가능한 페이지네이션 primitive 세트.
 * DataTablePagination 또는 단독으로 사용 가능.
 */
function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn('flex flex-row items-center gap-2', className)} {...props} />;
}

function PaginationItem(props: React.ComponentProps<'li'>) {
  return <li {...props} />;
}

export type PaginationButtonProps = {
  isActive?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function PaginationButton({
  className,
  isActive,
  type = 'button',
  ...props
}: PaginationButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border px-3 text-body-4 transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        isActive
          ? 'border-primary-normal bg-primary-normal text-label-white'
          : 'border-[var(--color-input-border)] bg-white text-gray-80 hover:bg-gray-30',
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious(props: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton aria-label="이전 페이지" {...props}>
      <ChevronLeft className="size-4" />
    </PaginationButton>
  );
}

function PaginationNext(props: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton aria-label="다음 페이지" {...props}>
      <ChevronRight className="size-4" />
    </PaginationButton>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationPrevious,
  PaginationNext,
};
