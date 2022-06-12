import Router from 'router';

const router = new Router('frontend');
router.public('assets/favicons', 'image/svg+xml');
router.public('assets/photos/avif', 'image/avif');
router.public('assets/photos/jpg', 'image/jpg');
router.public('assets/photos/webp', 'image/webp');
router.public('css', 'text/css');
router.public('html', 'text/html');
router.public('js', 'application/javascript');

router.postgres({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'mpic',
  password: 'mpic'
});

router.get('/', (_, _, res) => {
  res.redirect('/sign-in');
});

router.get('/api/sign-in', (sql, req, res) => {
  const ans = sql.call(
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

router.post('/api/sign-up', (sql, req, res) => {
  const ans = sql.call(
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
