import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const docsDir = resolve(process.cwd(), 'docs');

writeFileSync(join(docsDir, 'CNAME'), 'hzhshuaige.com\n', 'utf8');

const redirectPage = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Henry / Zihan</title>
  <script>
    const language = (navigator.language || '').toLowerCase();
    window.location.replace(language.startsWith('zh') ? '/cn/' : '/en/');
  <\/script>
  <noscript><meta http-equiv="refresh" content="0; url=/en/"></noscript>
</head>
<body>
  <p><a href="/en/">English</a> · <a href="/cn/">中文</a></p>
</body>
</html>`;

writeFileSync(join(docsDir, 'index.html'), redirectPage, 'utf8');
