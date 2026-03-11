/**
 * 빌드 후 'use client' 지시어를 번들 상단에 추가합니다.
 * esbuild는 번들링 과정에서 module-level directive를 제거하므로
 * 빌드 완료 후 직접 파일에 prepend합니다.
 */
import { readFileSync, writeFileSync } from 'fs';

const files = ['dist/index.js', 'dist/index.mjs'];
const directive = "'use client';\n";

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  if (!content.startsWith("'use client'")) {
    writeFileSync(file, directive + content);
    console.log(`✓ Added 'use client' to ${file}`);
  }
}
