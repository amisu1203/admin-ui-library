import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: false,
  clean: true,
  external: ['react', 'react-dom', 'tailwindcss'],
  treeshake: true,
  // 'use client' 지시어는 esbuild가 번들 시 제거하므로
  // scripts/add-directives.mjs에서 빌드 후 파일에 직접 prepend합니다.
});
