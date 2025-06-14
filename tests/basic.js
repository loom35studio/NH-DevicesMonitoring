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

console.log('Basic file checks passed');
