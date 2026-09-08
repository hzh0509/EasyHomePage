import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const docsDir = resolve(process.cwd(), 'docs');
rmSync(docsDir, { recursive: true, force: true });
mkdirSync(docsDir, { recursive: true });
