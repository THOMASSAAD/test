const https = require('https');
const fs = require('fs');

function req(method, path, token) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'poc-diagnostic',
        Accept: 'application/vnd.github+json'
      }
    };
    const r = https.request(options, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    r.on('error', (e) => resolve({ status: 0, body: e.message }));
    r.end();
  });
}

(async () => {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  const lines = [];
  if (!token) {
    fs.writeFileSync('poc-outcome.txt', 'no token\n');
    return;
  }

  const own = await req('GET', '/repos/THOMASSAAD/test', token);
  lines.push(`own-repo(test) status=${own.status}`);

  const other = await req('GET', '/repos/THOMASSAAD/GraduationProject', token);
  lines.push(`other-repo(GraduationProject, private, NOT connected to CodeRabbit) status=${other.status}`);

  fs.writeFileSync('poc-outcome.txt', lines.join('\n') + '\n');
})();
