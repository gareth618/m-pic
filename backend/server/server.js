import Router from './router.js';

const router = new Router('frontend');
await router.mime('assets/favicons', 'image/svg+xml');
await router.mime('assets/photos/avif', 'image/avif');
await router.mime('assets/photos/jpg', 'image/jpg');
await router.mime('assets/photos/webp', 'image/webp');
await router.mime('css', 'text/css');
await router.mime('html', 'text/html');
await router.mime('js', 'application/javascript');

router.postgres({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'mpic',
  password: 'mpic'
});

router.get('/', (_sql, _req, res) => {
  res.redirect('/sign-in');
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
