import 'dotenv/config';
import pg from 'pg';
import fetch from 'node-fetch';
import { parse } from 'url';
import { createServer } from 'http';
import { createReadStream } from 'fs';
import { readdir, readFile } from 'fs/promises';

export default class Router {
  domain() {
    return process.env.PORT == null
      ? 'http://localhost:3000/'
      : 'https://m-p1c.herokuapp.com/';
  }

  async call(method, path, body) {
    return await (await fetch(`${this.domain()}api${path}` + (method === 'GET' ? '?' + new URLSearchParams(body) : ''), {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      ...(method === 'GET' ? { } : { body: JSON.stringify(body) })
    })).json();
  }

  constructor() {
    this.mimes = [];
    this.routes = [];
  }

  async mime(dir, type) {
    const files = (await readdir(dir)).map(file => `/${dir}/${file}`);
    this.mimes.push({ dir, type, files });
  }

  async page404(file) {
    this.html404 = await readFile(file, { encoding: 'utf8' });
  }

  postgres(config) {
    this.pool = new pg.Pool(config);
  }

  get(url, callback) { this.routes.push({ method: 'GET', url, callback }); }
  post(url, callback) { this.routes.push({ method: 'POST', url, callback }); }
  put(url, callback) { this.routes.push({ method: 'PUT', url, callback }); }
  delete(url, callback) { this.routes.push({ method: 'DELETE', url, callback }); }

  listen(port) {
    const server = createServer(async (req, res) => {
      if (req.method === 'GET') {
        for (const mime of this.mimes) {
          if (mime.files.includes(req.url)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', mime.type);
            createReadStream(req.url.slice(1)).pipe(res);
            return;
          }
        }
      }

      const route = this.routes.find(route => {
        const position = req.url.indexOf('?');
        const cleanReqURL = position === -1 ? req.url : req.url.slice(0, position);
        return route.method === req.method && route.url === cleanReqURL;
      });
      if (route == null) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(this.html404);
        return;
      }

      const client = await this.pool.connect();
      const sqlFacade = {
        call: async (fun, args) => {
          const ans = await client.query(
            `SELECT ${fun} (${args.map((_, index) => `$${index + 1}`).join(', ')})`,
            args
          );
          return ans.rows[0][fun];
        }
      };
      const reqFacade = {
        head: req.headers,
        body: route.method === 'GET'
          ? parse(req.url, true).query
          : await (async () => {
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(chunk);
            }
            return JSON.parse(Buffer.concat(chunks).toString());
          })()
      };
      const resFacade = {
        goto: url => {
          res.statusCode = 301;
          res.setHeader('Location', url);
          res.end();
        },
        html: html => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.end(html);
        },
        code: code => {
          res.statusCode = code;
          res.setHeader('Content-Type', 'application/json');
        },
        json: json => {
          res.end(JSON.stringify(json))
        }
      };
      route.callback(sqlFacade, reqFacade, resFacade);
      client.release();
    });

    server.listen(port);
    console.log(`locally running at http://localhost:${port}/`);
  }
};
