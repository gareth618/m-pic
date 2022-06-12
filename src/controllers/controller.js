import Router from './router.js';
import Templater from './templater.js';

const templater = new Templater();
await templater.load('src/views');

const router = new Router();
await router.mime('public/favicons', 'image/svg+xml');
await router.mime('public/images/avif', 'image/avif');
await router.mime('public/images/jpg', 'image/jpg');
await router.mime('public/images/webp', 'image/webp');
await router.mime('public/css', 'text/css');
await router.mime('public/js', 'application/javascript');

router.postgres({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'mpic',
  password: 'mpic'
});

router.get('/sign-in', (_sql, _req, res) => {
  res.html(templater.get('SignIn'));
});

router.get('/sign-up', (_sql, _req, res) => {
  res.html(templater.get('SignUp'));
});

router.get('/my-photos', (_sql, _req, res) => {
  res.html(templater.get('MyPhotos'));
});

router.get('/my-profiles', (_sql, _req, res) => {
  res.html(templater.get('MyProfiles'));
});

router.get('/', (_sql, _req, res) => {
  res.goto('/sign-in');
});

router.get('/api/sign-in', async (sql, req, res) => {
  const ans = await sql.call(
    'sign_in',
    [req.body.email, req.body.password]
  );
  if (ans.startsWith('wrong')) {
    res.code(400);
    res.body({ error: ans });
  }
  else {
    res.code(200);
    res.body({ user: parseInt(ans.split(' ').slice(-1)[0]) });
  }
});

router.post('/api/sign-up', async (sql, req, res) => {
  const ans = await sql.call(
    'sign_up',
    [req.body.email, req.body.password]
  );
  if (ans.startsWith('email')) {
    res.code(400);
    res.body({ error: ans });
  }
  else {
    res.code(200);
    res.body({ user: parseInt(ans.split(' ').slice(-1)[0]) });
  }
});

router.listen('127.0.0.1', 3000);
