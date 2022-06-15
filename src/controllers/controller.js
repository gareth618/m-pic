import Router from './router.js';
import Templater from './templater.js';
import request from 'request';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';

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

router.get('/my-photos-facebook', async (_sql, _req, res) => {
  res.html(templater.render('MyPhotos', { api: 'facebook-api' }));
});

router.get('/my-photos-unsplash', async (_sql, _req, res) => {
  res.html(templater.render('MyPhotos', { api: 'unsplash-api' }));
});

router.get('/my-photos-twitter', async (_sql, _req, res) => {
  const oauth = OAuth({
    consumer: {
      key: '9qlxqpU2SherZlf7WQVsFYQ3T',
      secret: 'XKx8CpVaPQuorHrGl6mj1OLenyHeI95BVAFvsq80if3zdM5Ep9'
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64');
    }
  });
  
  const request_data = {
    url: 'https://api.twitter.com/oauth/request_token?' + new URLSearchParams({
      oauth_callback: 'http://localhost:3000/my-photos-twitter'
    }),
    method: 'POST'
  };

  const token = {
    key: '1536324348457385985-PcGWOXEqNlkpcJbn5ycBMHy8TG34sf',
    secret: 'eO3pkfRNjZhWV1NkqUdzjVK5sq0cnwTrELdRCSrNqrZS1'
  };

  request(
    {
      url: request_data.url,
      method: request_data.method,
      form: oauth.authorize(request_data, token)
    },
    (error, response, body) => {
      console.log(body);
    }
  );

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

router.listen(process.env.PORT || 3000);
