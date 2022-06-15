import 'dotenv/config';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import fetch from 'node-fetch';

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
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

router.get('/', (_sql, _req, res) => {
  res.goto('/sign-in');
});

router.get('/sign-in', (_sql, _req, res) => {
  res.html(templater.render('SignIn', { }));
});

router.get('/sign-up', (_sql, _req, res) => {
  res.html(templater.render('SignUp', { }));
});

router.get('/my-photos-unsplash', async (_sql, _req, res) => {
  res.html(templater.render('MyPhotos', { api: 'unsplash' }));
});

router.get('/my-photos-facebook', async (_sql, _req, res) => {
  res.html(templater.render('MyPhotos', { api: 'facebook' }));
});

router.get('/my-photos-twitter', async (_sql, _req, res) => {
  res.html(templater.render('MyPhotos', { api: 'twitter' }));
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

router.get('/api/authorize/twitter', async (_sql, _req, res) => {
  const oauth = OAuth({
    signature_method: 'HMAC-SHA1',
    consumer: {
      key: '9qlxqpU2SherZlf7WQVsFYQ3T',
      secret: 'XKx8CpVaPQuorHrGl6mj1OLenyHeI95BVAFvsq80if3zdM5Ep9'
    },
    hash_function(base_string, key) {
      return crypto
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64');
    }
  });

  const request = {
    method: 'POST',
    url: 'https://api.twitter.com/oauth/request_token?' + new URLSearchParams({
      oauth_callback: 'https://m-p1c.herokuapp.com/my-photos-twitter'
    })
  };
  const token = {
    key: '1536324348457385985-KwEXWkOLRdfEQVj4gTFHswIGqb98td',
    secret: 'CsQDUW5Mu78N9uOPp8sTOW4eutbGOHY6dSApOyGp2qCrW'
  };

  const params = oauth.authorize(request, token);
  let auth = '';
  for (const key in params) {
    auth += `${key}="${encodeURIComponent(params[key])}", `;
  }
  auth = auth.slice(0, -2);

  const ans = await (await fetch(request.url, {
    method: request.method,
    headers: { 'Authorization': `OAuth ${auth}` }
  })).text();
  res.code(200);
  const tokens = ans.match(/oauth_token=(?<oauth_token>.+)\&oauth_token_secret=(?<oauth_token_secret>.+)\&oauth_callback_confirmed=true/).groups;
  res.body(tokens.oauth_token);
});

router.get('/api/token/twitter', async(_sql, req, res) => {
  const request = {
    method: 'POST',
    url: 'https://api.twitter.com/oauth/access_token?' + new URLSearchParams({
      oauth_token: req.body.oauth_token,
      oauth_verifier: req.body.oauth_verifier
    })
  };

  const ans = await (await fetch(request.url, {
    method: request.method
  })).text();
  res.code(200);
  const tokens = ans.match(/oauth_token=(?<oauth_token>.+)\&oauth_token_secret=(?<oauth_token_secret>.+)\&user_id=(?<user_id>.+)\&screen_name=(?<screen_name>.+)/).groups;
  res.body(tokens);
});

router.listen(process.env.PORT || 3000);
