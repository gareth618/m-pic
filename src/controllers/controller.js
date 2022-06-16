import 'dotenv/config';
import Router from './router.js';
import Templater from './templater.js';
import controllerPages from './controller-pages.js';
import controllerInternal from './controller-internal.js';
import controllerExternal from './controller-external.js';

const templater = new Templater();
await templater.load('src/views');

const router = new Router();
await router.page404('src/views/404.html');

await router.mime('public/favicons', 'image/svg+xml');
await router.mime('public/images/avif', 'image/avif');
await router.mime('public/images/jpg', 'image/jpg');
await router.mime('public/images/webp', 'image/webp');
await router.mime('public/css', 'text/css');
await router.mime('public/js', 'application/javascript');

router.postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});
controllerPages(router, templater);
controllerInternal(router);
controllerExternal(router);
router.listen(process.env.PORT || 3000);
