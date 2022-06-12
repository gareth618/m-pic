import pg from 'pg';
import { parse } from 'url';
import { createServer } from 'http';
import { createReadStream } from 'fs';
import { readdir } from 'fs/promises';

export default class Router {
  constructor() {
    this.mimes = [];
    this.routes = [];
  }

  async mime(dir, type) {
    const files = (await readdir(dir)).map(file => `/${dir}/${file}`);
    this.mimes.push({ dir, type, files });
  }

  postgres(config) {
    this.pool = new pg.Pool(config);
  }

  get(url, callback) { this.routes.push({ method: 'GET', url, callback }); }
  post(url, callback) { this.routes.push({ method: 'POST', url, callback }); }
  put(url, callback) { this.routes.push({ method: 'PUT', url, callback }); }

  listen(hostname, port) {
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
        res.end('sorry, page not found');
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
          : JSON.parse(Buffer.concat(chunks).toString())
      };
      const resFacade = {
        goto: url => {
          res.statusCode = 302;
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
        body: body => res.end(JSON.stringify(body))
      };
      route.callback(sqlFacade, reqFacade, resFacade);
      client.release();
    });

    server.listen(port, hostname, () => {
      console.log(`server running at http://${hostname}:${port}/`);
    });
  }
};
