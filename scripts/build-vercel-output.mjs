import { cpSync, copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, '.vercel', 'output');
const funcDir = join(out, 'functions', 'api.func');
const staticDir = join(out, 'static');
const clientDist = join(root, 'client', 'dist');

rmSync(out, { recursive: true, force: true });
mkdirSync(funcDir, { recursive: true });
mkdirSync(staticDir, { recursive: true });

if (!existsSync(clientDist)) {
  console.error('client/dist not found — run the client build first.');
  process.exit(1);
}

try {
  execSync('node scripts/build-sitemap.mjs', { cwd: root, stdio: 'inherit' });
} catch (e) {
  console.error('[build-vercel-output] sitemap build failed:', e.message);
}

cpSync(clientDist, staticDir, { recursive: true });
if (existsSync(join(root, 'client', 'public', 'sitemap.xml'))) {
  copyFileSync(join(root, 'client', 'public', 'sitemap.xml'), join(staticDir, 'sitemap.xml'));
}

const esbuildBin =
  (existsSync(join(root, 'client', 'node_modules', '.bin', process.platform === 'win32' ? 'esbuild.cmd' : 'esbuild')) &&
    join(root, 'client', 'node_modules', '.bin', process.platform === 'win32' ? 'esbuild.cmd' : 'esbuild')) ||
  join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'esbuild.cmd' : 'esbuild');
const bundlePath = join(funcDir, 'index.js');
const esbuildCmd = `"${esbuildBin}" api/index.js --bundle --platform=node --format=cjs --target=node20 --outfile="${bundlePath}"`;
try {
  execSync(esbuildCmd, { cwd: root, stdio: 'inherit' });
} catch (e) {
  console.error('[build-vercel-output] esbuild failed. Command: ' + esbuildCmd);
  process.exit(1);
}

mkdirSync(join(funcDir, 'data'), { recursive: true });
copyFileSync(join(root, 'server', 'data', 'kurals.json'), join(funcDir, 'data', 'kurals.json'));
if (existsSync(join(root, 'server', 'data', 'urais.json'))) {
  copyFileSync(join(root, 'server', 'data', 'urais.json'), join(funcDir, 'data', 'urais.json'));
}
if (existsSync(join(root, 'server', 'data', 'db.json'))) {
  copyFileSync(join(root, 'server', 'data', 'db.json'), join(funcDir, 'data', 'db.json'));
}

writeFileSync(
  join(funcDir, '.vc-config.json'),
  JSON.stringify(
    { runtime: 'nodejs20.x', handler: 'index.js', launcherType: 'Nodejs', maxDuration: 30, shouldAddHelpers: false },
    null,
    2
  )
);

writeFileSync(
  join(out, 'config.json'),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: 'filesystem' },
        { src: '/api(?:/(.*))?', dest: '/api' },
        { src: '/cdn(?:/(.*))?', dest: '/api' },
        { src: '/(.*)', dest: '/index.html' },
      ],
    },
    null,
    2
  )
);

console.log('Build Output API v3 written to .vercel/output');

const clientOut = join(root, 'client', '.vercel', 'output');
rmSync(clientOut, { recursive: true, force: true });
cpSync(out, clientOut, { recursive: true });
console.log('Mirrored to client/.vercel/output');