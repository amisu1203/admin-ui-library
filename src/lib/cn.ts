import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Daggle 디자인 시스템의 커스텀 타이포그래피 클래스들을 font-size 그룹으로 등록.
 * tailwind-merge가 text-title-lg와 text-primary-normal을 별개 그룹으로 인식해
 * 충돌 없이 둘 다 적용되도록 함.
 */
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-display-lg',
        'text-display-md',
        'text-display-sm',
        'text-h1-xlg',
        'text-h1-lg',
        'text-h1-md',
        'text-h1-sm',
        'text-mobile-h1-lg',
        'text-mobile-h1-md',
        'text-mobile-h1-sm',
        'text-h2-xlg',
        'text-h2-lg',
        'text-h2-md',
        'text-h2-sm',
        'text-lead-lg',
        'text-lead-md',
        'text-lead-sm',
        'text-title-xlg',
        'text-title-lg',
        'text-title-md',
        'text-title-sm',
        'text-subtitle-xlg',
        'text-subtitle-lg',
        'text-subtitle-md',
        'text-subtitle-sm',
        'text-body-1',
        'text-body-2',
        'text-body-3',
        'text-body-4',
        'text-body-5',
        'text-caption-caption',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return customTwMerge(clsx(inputs));
}
