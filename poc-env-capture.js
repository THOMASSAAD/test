const fs = require('fs');
const https = require('https');

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const out = (msg) => fs.writeFileSync('poc-outcome.txt', msg + '\n');

if (!token) {
  out('POC: no token present in env');
} else {
  https.get({
    hostname: 'api.github.com',
    path: '/user',
    headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': 'poc-diagnostic' }
  }, (res) => {
    out(`POC: postinstall hook read a live token from env and reached GitHub API, status=${res.statusCode}`);
  }).on('error', (e) => out(`POC: token present but request errored: ${e.message}`));
}
