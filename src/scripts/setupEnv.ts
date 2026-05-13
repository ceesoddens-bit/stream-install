import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function loadDotEnv() {
  const path = resolve(process.cwd(), '.env');
  if (!existsSync(path)) return;
  const raw = readFileSync(path, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, key, rawVal] = m;
    const val = rawVal.replace(/^['"]|['"]$/g, '').trim();
    process.env[key] = val;
  }
}
loadDotEnv();

// Mock Browser Globals
const mockWindow = {
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
};

try {
  Object.defineProperty(global, 'window', { value: mockWindow, configurable: true, writable: true });
  Object.defineProperty(global, 'navigator', { value: { userAgent: 'node', onLine: true }, configurable: true, writable: true });
  Object.defineProperty(global, 'document', { value: { createElement: () => ({}), head: { appendChild: () => {} } }, configurable: true, writable: true });
  Object.defineProperty(global, 'location', { value: { protocol: 'https:', hostname: 'localhost' }, configurable: true, writable: true });
  Object.defineProperty(global, 'Blob', { value: class {}, configurable: true, writable: true });
  Object.defineProperty(global, 'FileReader', { value: class { readAsDataURL() {}; onloadend() {} }, configurable: true, writable: true });
} catch (e) {
  // Ignore
}
