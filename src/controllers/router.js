import 'dotenv/config';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { parse } from 'url';
import { createServer } from 'http';
import { existsSync, createReadStream } from 'fs';
import { readdir, readFile, writeFile } from 'fs/promises';

export default class Router {
  domain() {
    return process.env.PORT == null
      ? `http://localhost:${this.port}/`
      : this.deploy;
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

  constructor(port, deploy) {
    this.port = port;
    this.deploy = deploy;
    this.mimes = [];
    this.routes = [];
  }

  async mime(dir, type) {
    const files = (await readdir(dir)).map(file => `/${dir}/${file}`);
    this.mimes.push({ dir, type, files });
  }

  async photo(uri, data) {
    await writeFile(`media/${uri}.png`, data, 'base64');
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

  listen() {
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
      if (req.method === 'GET' && req.url.startsWith('/media/') && req.url.endsWith('.png')) {
        const file = req.url.slice(1);
        if (existsSync(file)) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'image/png');
          createReadStream(file).pipe(res);
          return;
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
        cook: (() => {
          const token = req.headers.cookie?.split(';')?.find(cookie => cookie.startsWith('token='))?.slice('token='.length);
          if (token == null) return;
          const info = jwt.decode(token);
          if (Date.parse(new Date()) / 1000 - info.iat > (info.remember ? 3600 : 60)) return;
          return info.user_id;
        })(),
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
        cook: (user_id, remember) => {
          const token = jwt.sign({ user_id, remember }, process.env.JWT_SECRET_KEY);
          res.setHeader('access-control-expose-headers', 'Set-Cookie');
          res.setHeader('Set-Cookie', `token=${token}; Path=/`);
        },
        json: json => {
          res.end(JSON.stringify(json));
        }
      };
      route.callback(sqlFacade, reqFacade, resFacade);
      client.release();
    });

    server.listen(this.port);
    console.log(`locally running at http://localhost:${this.port}/`);
  }
};
