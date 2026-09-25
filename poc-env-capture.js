const fs = require('fs');
const https = require('https');

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const out = (msg) => fs.writeFileSync('poc-outcome.txt', msg + '\n');

if (!token) {
  out('POC: no token present in env');
} else {
  https.get({
    hostname: 'api.github.com',
    path: '/repos/thomassaad/test',
    headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': 'poc-diagnostic' }
  }, (res) => {
    let body = '';
    res.on('data', (c) => body += c);
    res.on('end', () => {
      let perms = 'unknown';
      try { perms = JSON.stringify(JSON.parse(body).permissions || {}); } catch (e) {}
      out(`POC: repo API status=${res.statusCode} permissions=${perms}`);
    });
  }).on('error', (e) => out(`POC: error=${e.
}    
