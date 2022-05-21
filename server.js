import { createServer } from 'http';
import { stat, createReadStream } from 'fs';
import { readdir } from 'fs/promises';

import pg from 'pg';
const { Pool } = pg;

const client = new Pool({
  user: 'mpic',
  host: 'localhost',
  database: 'postgres',
  password: 'mpic',
  port: 5432
});
await client.connect();

const res = await client.query("select * from users where password = $1::text", ['iamauser']);
for (const { email, password } of res.rows) {
  console.log(email + ' ' + password);
}
await client.end();

const hostname = '127.0.0.1';
const port = 3000;

const resources = [
  {
    dir: 'assets/favicons',
    type: 'image/svg+xml'
  },
  {
    dir: 'assets/photos/avif',
    type: 'image/avif'
  },
  {
    dir: 'assets/photos/jpg',
    type: 'image/jpg'
  },
  {
    dir: 'assets/photos/webp',
    type: 'image/webp'
  },
  {
    dir: 'css',
    type: 'text/css'
  },
  {
    dir: 'html',
    type: 'text/html'
  },
  {
    dir: 'js',
    type: 'application/javascript'
  }
];

for (const resource of resources) {
  const files = await readdir(resource.dir);
  resource.files = files.map(file => `/${resource.dir}/${file}`);
}

const server = createServer((req, res) => {
  if (req.url === '/api/sign-in') {
    const chunks = [];
    req
      .on('data', chunk => chunks.push(chunk))
      .on('end', () => {
        const body = Buffer.concat(chunks).toString();
        console.log(JSON.parse(body));
      });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
    return;
  }
	if (req.url === '/') {
    render(res, '/html/sign-in.html', 'text/html');
    return;
  }
  for (const resource of resources) {
    const file = resource.dir === 'html' ? `/html${req.url}.html` : req.url;
    if (resource.files.includes(file)) {
      render(res, file, resource.type);
      return;
    }
  }
  res.statusCode = 404;
  res.end('Sorry, page not found!');
});

function render(res, file, type) {
  stat(`./${file}`, () => {
    res.statusCode = 200;
    res.setHeader('Content-Type', type);
    createReadStream(`.${file}`).pipe(res);
	});
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
