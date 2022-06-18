import 'dotenv/config';
import fetch from 'node-fetch';

export default function controllerFacebook(router) {
  router.post('/api/facebook/authorize', async (sql, req, res) => {
    const profile_id = parseInt(await sql.call(
      'add_profile',
      [req.body.user_id, 'facebook', req.body.code]
    ));
    res.code(200);
    res.json({ profile_id });
  });

  router.put('/api/facebook/token', async (sql, req, res) => {
    const { code } = (await sql.call(
      'get_profile',
      [req.body.profile_id]
    ))[0];
    const token = (await (await fetch('https://graph.facebook.com/v14.0/oauth/access_token?' + new URLSearchParams({
      client_id: process.env.FACEBOOK_ACCESS_KEY,
      client_secret: process.env.FACEBOOK_SECRET_KEY,
      redirect_uri: router.domain() + 'authorize/facebook',
      code
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

  router.get('/api/facebook/profile', async (_sql, req, res) => {
    const profile = await (await fetch('https://graph.facebook.com/me?fields=name,link,friends', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${req.body.token}` }
    })).json();
    const photos = await router.call('GET', '/facebook/photos', { token: req.body.token });
    res.code(200);
    res.json({
      profileId: req.body.profile_id,
      platform: 'facebook',
      username: profile.name,
      url: profile.link,
      photos: photos.length,
      followers: profile.friends.summary.total_count,
      likes: photos.reduce((cnt, photo) => cnt + photo.likes, 0)
    });
  });

  router.get('/api/facebook/photos', async (_sql, req, res) => {
    const initCall = async path => {
      return await fetch(`https://graph.facebook.com/v14.0${path}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${req.body.token}` }
      });
    };
    const fullCall = async path => {
      return (await initCall(path)).json();
    };
    const profile_id = (await fullCall('/me')).id;
    const photos = (await Promise.all((await fullCall(`/${profile_id}/posts`)).data.map(async post => {
      const post_data = await fullCall(`/${post.id}?fields=message,shares,created_time,permalink_url,object_id`);
      const photo_id = post_data.object_id;
      const photo_picture = await initCall(`/${photo_id}/picture`);
      if (photo_picture.status !== 200) return;
      return {
        platform: 'facebook',
        url: photo_picture.url,
        post: post_data.permalink_url,
        tags: post_data.message?.match(/(?<=#)\w+(?= |)/g) || [],
        date: post_data.created_time,
        likes: (await fullCall(`/${photo_id}/likes`)).data.length,
        shares: post_data.shares?.count || 0
      };
    }))).filter(photo => photo != null);
    res.code(200);
    res.json(photos);
  });
};
