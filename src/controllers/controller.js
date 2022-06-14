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
  res.html(templater.render('SignIn', { }));
});

router.get('/sign-up', (_sql, _req, res) => {
  res.html(templater.render('SignUp', { }));
});

router.get('/my-photos-unsplash', async (_sql, _req, res) => {
  res.html(templater.render('MyPhotos', { api: 'unsplash-api' }));
});

router.get('/my-photos-twitter', async (_sql, _req, res) => {
  res.html(templater.render('MyPhotos', { api: 'twitter-api' }));
});

router.get('/my-profiles', (_sql, _req, res) => {
  const random = max => Math.floor(Math.random() * max);
  const icons = ['facebook', 'instagram', 'reddit-alien', 'twitter', 'unsplash'];
  const users = ['gareth618', 'lizzzu', 'oracolul', 'mikeIMT', 'bossu', 'bunul20', 'fanurie', 'juve45', 'b9i', 'denis2111', 'geniucos', 'usu', 'paftenie', 'macarie'];
  const count = random(25) + 25;
  const profiles = [];
  for (let i = 0; i < count; i++) {
    profiles.push({
      icon: icons[random(icons.length)],
      user: users[random(users.length)],
      photos: random(1000),
      followers: random(1000),
      shares: random(1000)
    });
  }
  res.html(templater.render('MyProfiles', { profiles }));
});

router.get('/', (_sql, _req, res) => {
  res.goto('/sign-in');
});

router.get('/api/sign-in', async (sql, req, res) => {
  const ans = await sql.call(
    'sign_in',
    [req.body.email, req.body.password]
  );
  const user = parseInt(ans);
  if (user === -1) {
    res.code(400);
    res.body({ error: 'wrong email or password' });
  }
  else {
    res.code(200);
    res.body({ user });
  }
});

router.post('/api/sign-up', async (sql, req, res) => {
  const ans = await sql.call(
    'sign_up',
    [req.body.email, req.body.password]
  );
  const user = parseInt(ans);
  if (user === -1) {
    res.code(400);
    res.body({ error: 'email already in use' });
  }
  else {
    res.code(200);
    res.body({ user });
  }
});

const port = process.env.PORT || 3000;
router.listen('localhost', port);
