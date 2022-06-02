import { createServer } from 'http';
import { createReadStream } from 'fs';
import { readdir } from 'fs/promises';
import queryApi from './api.js';

const mimes = [
  { dir: 'assets/favicons', type: 'image/svg+xml' },
  { dir: 'assets/photos/avif', type: 'image/avif' },
  { dir: 'assets/photos/jpg', type: 'image/jpg' },
  { dir: 'assets/photos/webp', type: 'image/webp' },
  { dir: 'css', type: 'text/css' },
  { dir: 'html', type: 'text/html' },
  { dir: 'js', type: 'application/javascript' }
];

for (const mime of mimes) {
  const files = await readdir(`frontend/${mime.dir}`);
  mime.files = files.map(file => `/${mime.dir}/${file}`);
}

const server = createServer(async (req, res) => {
  if (req.url === '/') {
    res.statusCode = 302;
    res.setHeader('Location', '/sign-in');
    res.end();
    return;
  }

  if (req.url.substring(0, 5) === '/api/') {
    const route = req.url.substring(5);
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString());
    const auth = req.headers.authorisation;
    const user = auth == null ? -1 : parseInt(auth);
    const ans = await queryApi(user, req.method, route, body);
    if (ans != null) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(ans));
      return;
    }
  }

  for (const mime of mimes) {
    const file = mime.dir === 'html' ? `/html${req.url}.html` : req.url;
    if (mime.files.includes(file)) {
      res.statusCode = 200;
      res.setHeader('Content-Type', mime.type);
      createReadStream(`frontend${file}`).pipe(res);
      return;
    }
  }
  res.statusCode = 404;
  res.end('sorry, page not found');
});

const hostname = '127.0.0.1';
const port = 3000;

server.listen(port, hostname, () => {
  console.log(`server running at http://${hostname}:${port}/`);
});
