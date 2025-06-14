const fs = require('fs');
const assert = require('assert');
const http = require('http');

const files = [
  'app.js',
  'package.json',
  'next/pages/index.js',
];

for (const f of files) {
  assert.ok(fs.existsSync(f), `Missing required file: ${f}`);
}

async function requestHome() {
  const app = require('../app');
  const server = http.createServer(app);
  await new Promise(res => server.listen(0, res));
  const port = server.address().port;
  const result = await new Promise((resolve, reject) => {
    http.get({ port, path: '/' }, res => {
      const { statusCode } = res;
      res.resume();
      res.on('end', () => resolve(statusCode));
    }).on('error', reject);
  });
  server.close();
  assert.strictEqual(result, 200, 'Home page did not return 200');
}

(async () => {
  await requestHome();
  console.log('Application basic checks passed');
})();
