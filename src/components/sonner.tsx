'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

/**
 * Figma Center Toast 스타일 적용
 *
 * CSS 스타일은 @daggle-dev/admin-ui/styles import 시 자동 적용됩니다.
 *
 * 테마 연동이 필요하다면 소비자 쪽에서 theme prop을 직접 전달하세요:
 * @example
 * // next-themes 사용 시
 * import { useTheme } from 'next-themes';
 * const { theme } = useTheme();
 * <Toaster theme={theme as ToasterProps['theme']} />
 *
 * // theme prop 생략 시 Sonner 기본값('system') 사용
 * <Toaster />
 */
function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 shrink-0" />,
        info: <InfoIcon className="size-5 shrink-0" />,
        warning: <TriangleAlertIcon className="size-5 shrink-0" />,
        error: <OctagonXIcon className="size-5 shrink-0" />,
        loading: <Loader2Icon className="size-5 shrink-0 animate-spin" />,
      }}
      closeButton
      style={
        {
          '--normal-bg': 'var(--color-gray-90)',
          '--normal-text': 'var(--color-label-white)',
          '--normal-border': 'transparent',
          '--border-radius': '20px',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: '!toast-figma',
          title: '!text-mobile-h1-sm !text-label-white',
          description: '!text-body-3 !text-label-white/90',
          closeButton: '!size-6 !text-label-white hover:!bg-white/10',
          actionButton: '!bg-label-white !text-gray-90',
          cancelButton: '!text-label-white/80',
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
