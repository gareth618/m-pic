import 'dotenv/config';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import fetch from 'node-fetch';

export default function(router) {
  const domain = [
    'http://localhost:3000/',
    'https://m-p1c.herokuapp.com/'
  ][process.env.PORT == null ? 0 : 1];

  router.post('/api/unsplash/authorize', async (sql, req, res) => {
    const profile = await sql.call(
      'add_profile',
      [req.body.user, 'unsplash', req.body.code]
    );
    res.code(200);
    res.json({ profile: parseInt(profile) });
  });

  router.put('/api/unsplash/token', async (sql, req, res) => {
    const code = await sql.call(
      'get_profile_code',
      [req.body.profile]
    );
    const token = (await (await fetch('https://unsplash.com/oauth/token?' + new URLSearchParams({
      client_id: process.env.UNSPLASH_ACCESS_KEY,
      client_secret: process.env.UNSPLASH_SECRET_KEY,
      redirect_uri: domain + 'authorize/unsplash',
      code,
      grant_type: 'authorization_code'
    }), {
      method: 'POST'
    })).json()).access_token;
    await sql.call(
      'set_profile_token',
      [req.body.profile, token]
    );
    res.code(200);
    res.json({ token });
  });

  router.post('/api/facebook/authorize', async (sql, req, res) => {
    
  });

  router.get('/api/twitter/init', async (_sql, _req, res) => {
    const oauth = OAuth({
      signature_method: 'HMAC-SHA1',
      consumer: {
        key: process.env.TWITTER_ACCESS_KEY,
        secret: process.env.TWITTER_SECRET_KEY
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
        oauth_callback: domain + 'authorize/twitter'
      })
    };
    const token = {
      key: process.env.TWITTER_ACCESS_TOKEN,
      secret: process.env.TWITTER_SECRET_TOKEN
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
    const tokens = ans.match(/oauth_token=(?<oauth_token>.+)\&oauth_token_secret=(?<oauth_token_secret>.+)\&oauth_callback_confirmed=true/).groups;
    res.code(200);
    res.json({ token: tokens.oauth_token });
  });

  router.get('/api/twitter/authorize', async (_sql, req, res) => {
    const ans = await (await fetch('https://api.twitter.com/oauth/access_token?' + new URLSearchParams({
      oauth_token: req.body.oauth_token,
      oauth_verifier: req.body.oauth_verifier
    }), {
      method: 'POST'
    })).text();
    const tokens = ans.match(/oauth_token=(?<oauth_token>.+)\&oauth_token_secret=(?<oauth_token_secret>.+)\&user_id=(?<user_id>.+)\&screen_name=(?<screen_name>.+)/).groups;
    res.code(200);
    res.json(tokens);
  });
};
