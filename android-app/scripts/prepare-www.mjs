// වෙබ් අඩවියේ ගොනු (repo එකේ මුල) android-app/www වෙත පිටපත් කරයි — ඇප් එක ඇතුළේ ඇත්තේ මෙම ගොනුයි.
import { cpSync, rmSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');
const out = resolve(here, '..', 'www');
const SKIP = new Set(['.git', '.github', 'android-app', 'node_modules', 'README.md', 'vercel.json',
  '.vercelignore', '.nojekyll', '.gitignore', 'sw.js', 'CLAUDE.md', 'build.log']);   // sw.js: ඇප් එකේ ගොනු දැනටමත් ඇතුළතය

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
let n = 0;
for (const name of readdirSync(root)) {
  if (SKIP.has(name)) continue;
  cpSync(join(root, name), join(out, name), { recursive: true });
  n++;
}
if (!existsSync(join(out, 'index.html'))) throw new Error('index.html not found in ' + root);
console.log(`www ready: ${n} items copied from ${root}`);
