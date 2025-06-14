const fs = require('fs');
const assert = require('assert');
const files = [
  'package.json',
  'next/pages/index.js',
  'next/pages/_app.js',
];

for (const f of files) {
  assert.ok(fs.existsSync(f), `Missing required file: ${f}`);
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.ok(pkg.scripts && pkg.scripts.start === 'next start next', 'start script should run Next.js');

console.log('Basic file checks passed');
