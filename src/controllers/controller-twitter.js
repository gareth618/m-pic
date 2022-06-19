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
      [req.cook, 'twitter', `oauth_token=${req.body.oauth_token}\&oauth_verifier=${req.body.oauth_verifier}`]
    ));
    await sql.call(
      'set_profile_token',
      [profile_id, token]
    );
    res.code(200);
    res.json({ token });
  });

  router.get('/api/twitter/profile', async (_sql, req, res) => {
    const tokens = req.body.token.match(/oauth_token=(?<oauth_token>.+)\&oauth_token_secret=(?<oauth_token_secret>.+)\&user_id=(?<user_id>.+)\&screen_name=(?<screen_name>.+)/).groups;
    const followers = await (await fetch(`https://api.twitter.com/2/users/${tokens.user_id}/followers`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${process.env.TWITTER_BEARER}` }
    })).json();
    const photos = await router.call('GET', '/twitter/photos', { token: req.body.token });
    res.code(200);
    res.json({
      profileId: req.body.profile_id,
      platform: 'twitter',
      username: tokens.screen_name,
      url: `https://twitter.com/${tokens.screen_name}`,
      photos: photos.length,
      followers: followers.data.length,
      likes: photos.reduce((likes, photo) => likes + photo.likes, 0)
    });
  });

  router.get('/api/twitter/photos', async (_sql, req, res) => {
    const tokens = req.body.token.match(/oauth_token=(?<oauth_token>.+)\&oauth_token_secret=(?<oauth_token_secret>.+)\&user_id=(?<user_id>.+)\&screen_name=(?<screen_name>.+)/).groups;
    const data = await (await fetch(`https://api.twitter.com/2/users/${tokens.user_id}/tweets?tweet.fields=attachments,created_at,public_metrics&expansions=attachments.media_keys&media.fields=url`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${process.env.TWITTER_BEARER}` }
    })).json();
    const photos = [];
    const posts = data.data;
    const media = data.includes.media;

    for (const post of posts) {
      const keys = post.attachments?.media_keys || [];
      for (const key of keys) {
        photos.push({
          platform: 'twitter',
          url: media.find(item => item.media_key === key).url,
          post: post.text.split(' ').slice(-1)[0],
          tags: post.text.match(/(?<=#)\w+(?= |)/g) || [],
          date: post.created_at,
          likes: post.public_metrics.like_count,
          shares: post.public_metrics.retweet_count
        });
      }
    }
    res.code(200);
    res.json(photos);
  });
};
