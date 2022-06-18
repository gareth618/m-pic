import 'dotenv/config';
import fetch from 'node-fetch';

export default function controllerUnsplash(router) {
  router.post('/api/unsplash/authorize', async (sql, req, res) => {
    const profile_id = parseInt(await sql.call(
      'add_profile',
      [req.body.user_id, 'unsplash', req.body.code]
    ));
    res.code(200);
    res.json({ profile_id });
  });

  router.put('/api/unsplash/token', async (sql, req, res) => {
    const { code } = (await sql.call(
      'get_profile',
      [req.body.profile_id]
    ))[0];
    const token = (await (await fetch('https://unsplash.com/oauth/token?' + new URLSearchParams({
      client_id: process.env.UNSPLASH_ACCESS_KEY,
      client_secret: process.env.UNSPLASH_SECRET_KEY,
      redirect_uri: router.domain() + 'authorize/unsplash',
      code,
      grant_type: 'authorization_code'
    }), {
      method: 'POST'
    })).json()).access_token;
    await sql.call(
      'set_profile_token',
      [req.body.profile_id, token]
    );
    res.code(200);
    res.json({ token });
  });

  router.get('/api/unsplash/profile', async (_sql, req, res) => {
    try {
      const profile = await (await fetch('https://api.unsplash.com/me', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${req.body.token}` }
      })).json();
      res.code(200);
      res.json({
        profileId: req.body.profile_id,
        platform: 'unsplash',
        username: profile.username,
        url: `https://unsplash.com/@${profile.username}`,
        photos: profile.total_photos,
        followers: profile.followers_count,
        likes: profile.total_likes
      });
    }
    catch (err) {
      res.code(503);
      res.json({
        profileId: req.body.profile_id,
        platform: 'unsplash',
        username: '???',
        url: 'https://unsplash.com/',
        photos: 'unsplash',
        followers: 'is',
        likes: 'down'
      });
    }
  });

  router.get('/api/unsplash/photos', async (_sql, req, res) => {
    try {
      const { username } = await router.call('GET', '/unsplash/profile', { token: req.body.token });
      const collections = await (await fetch(`https://api.unsplash.com/users/${username}/collections?` + new URLSearchParams({
        client_id: req.body.token
      }), {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${req.body.token}` }
      })).json();
      const photos = [];
      collections.forEach(collection => {
        collection.preview_photos.forEach(photo => {
          photos.push({
            platform: 'unsplash',
            url: photo.urls.small,
            post: `https://unsplash.com/photos/${photo.id}`,
            tags: [collection.title],
            date: (new Date()).toString(),
            likes: 0,
            shares: 0
          });
        });
      });
      res.code(200);
      res.json(photos);
    }
    catch (err) {
      res.code(503);
      res.json([]);
    }
  });
};
