const fs = require('fs');
const https = require('https');

function checkToken(token) {
  return new Promise((resolve) => {
    https.get({
      hostname: 'api.github.com',
      path: '/repos/thomassaad/test',
      headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': 'poc-diagnostic' }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        let perms = 'unknown';
        try { perms = JSON.stringify(JSON.parse(body).permissions || {}); } catch (e) {}
        resolve(`status=${res.statusCode} perms=${perms}`);
      });
    }).on('error', (e) => resolve(`ERROR:${e.message}`));
  });
}

(async () => {
  const lines = [];
  for (let i = 0; i < 6; i++) {
    const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
    const result = token ? await checkToken(token) : 'ABSENT';
    lines.push(`t+${i * 2}s present=${!!token} result=${result}`);
    fs.writeFileSync('poc-outcome.txt', lines.join('\n') + '\n');
    await new Promise((r) => setTimeout(r, 2000));
  }
})();
