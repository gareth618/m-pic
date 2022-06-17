import 'dotenv/config';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import fetch from 'node-fetch';

export default function controllerTwitter(router) {
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
        oauth_callback: router.domain() + 'authorize/twitter'
      })
    };
    const token = {
      key: process.env.TWITTER_ACCESS_TOKEN,
      secret: process.env.TWITTER_SECRET_TOKEN
    };
    const params = oauth.authorize(request, token);

    let auth = '';
    for (const key in params) {
      auth += `${key}="${encodeURIComponent(params[key])}",`;
    }
    auth = auth.slice(0, -1);
    const ans = await (await fetch(request.url, {
      method: request.method,
      headers: { 'Authorization': `OAuth ${auth}` }
    })).text();
    const tokens = ans.match(/oauth_token=(?<oauth_token>.+)\&oauth_token_secret=(?<oauth_token_secret>.+)\&oauth_callback_confirmed=true/).groups;
    res.code(200);
    res.json({ token: tokens.oauth_token });
  });

  router.post('/api/twitter/authorize', async (sql, req, res) => {
    const token = await (await fetch('https://api.twitter.com/oauth/access_token?' + new URLSearchParams({
      oauth_token: req.body.oauth_token,
      oauth_verifier: req.body.oauth_verifier
    }), {
      method: 'POST'
    })).text();

    const profile_id = parseInt(await sql.call(
      'add_profile',
      [req.body.user_id, 'twitter', `oauth_token=${req.oauth_token}\&oauth_verifier=${req.oauth_verifier}`]
    ));
    await sql.call(
      'set_profile_token',
      [profile_id, token]
    );
    res.code(200);
    res.json({ token });
  });

  router.get('/api/twitter/profile', async (_sql, req, res) => {
    try {
      const tokens = req.body.token.match(/oauth_token=(?<oauth_token>.+)\&oauth_token_secret=(?<oauth_token_secret>.+)\&user_id=(?<user_id>.+)\&screen_name=(?<screen_name>.+)/).groups;
      const profile = await (await fetch(`https://api.twitter.com/2/users/${tokens.user_id}?user.fields=public_metrics`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${process.env.TWITTER_BEARER}` }
      })).json();
      res.code(200);
      res.json({
        platform: 'twitter',
        username: profile.data.username,
        url: `https://twitter.com/${profile.data.username}`,
        photos: profile.data.public_metrics.tweet_count,
        followers: profile.data.public_metrics.followers_count,
        shares: 0
      });
    }
    catch (err) {
      res.code(503);
      res.json({
        platform: 'twitter',
        username: '???',
        url: `https://twitter.com/`,
        photos: 'twitter',
        followers: 'is',
        shares: 'down'
      });
    }
  });
};
