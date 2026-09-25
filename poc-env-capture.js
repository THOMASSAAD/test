const https = require('https');
const fs = require('fs');

function req(method, path, token, body) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'poc-diagnostic',
        'Accept': 'application/vnd.github+json',
        ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const r = https.request(options, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    r.on('error', (e) => resolve({ status: 0, body: e.message }));
    if (data) r.write(data);
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

  const refRes = await req('GET', '/repos/THOMASSAAD/test/git/ref/heads/main', token);
  lines.push(`get-ref status=${refRes.status}`);
  let sha = null;
  try {
    sha = JSON.parse(refRes.body).object.sha;
  } catch (e) {}
  lines.push(`sha=${sha ? 'obtained' : 'none'}`);

  if (sha) {
    const branchName = 'poc-write-test-' + Date.now();
    const createRes = await req('POST', '/repos/THOMASSAAD/test/git/refs', token, {
      ref: `refs/heads/${branchName}`,
      sha
    });
    lines.push(`create-branch status=${createRes.status} branch=${branchName}`);
  }
  fs.writeFileSync('poc-outcome.txt', lines.join('\n') + '\n');
})();
