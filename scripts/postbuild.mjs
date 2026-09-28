import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'client', 'dist');
const dst = join(root, 'dist');

if (!existsSync(src)) {
  console.error('client/dist not found — did the client build run?');
  process.exit(1);
}

rmSync(dst, { recursive: true, force: true });
cpSync(src, dst, { recursive: true });
console.log(`Copied client/dist -> dist`);