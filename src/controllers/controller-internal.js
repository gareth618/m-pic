import crypto from 'crypto';

export default function controllerInternal(router) {
  router.get('/api/sign-in', async (sql, req, res) => {
    const user_id = parseInt(await sql.call(
      'sign_in',
      [req.body.email, req.body.password]
    ));
    if (user_id === -1) {
      res.code(400);
      res.json({ error: 'wrong email or password' });
    }
    else {
      res.code(200);
      res.cook(user_id, req.body.remember === 'true');
      res.json({ });
    }
  });

  router.post('/api/sign-up', async (sql, req, res) => {
    const user_id = parseInt(await sql.call(
      'sign_up',
      [req.body.email, req.body.password]
    ));
    if (user_id === -1) {
      res.code(400);
      res.json({ error: 'email already in use' });
    }
    else {
      res.code(200);
      res.cook(user_id, req.body.remember === 'true');
      res.json({ });
    }
  });

  router.delete('/api/delete', async (sql, req, res) => {
    await sql.call('delete_profile', [req.body.profile_id]);
    res.code(200);
    res.json({ });
  });

  router.post('/api/upload', async (sql, req, res) => {
    const uri = crypto.randomBytes(20).toString('hex');
    await sql.call('add_photo', [req.cook, uri, new Date()]);
    router.photo(uri, req.body.data);
    res.code(200);
    res.json({ });
  });

  router.get('/api/photos', async (sql, req, res) => {
    const photos = (await sql.call('get_photos', [req.body.user_id])) || [];
    res.code(200);
    res.json(photos.map(photo => ({
      platform: 'm-pic',
      url: `${router.domain()}media/${photo.uri}.png`,
      post: router.domain(),
      tags: [],
      date: photo.created_at,
      likes: 0,
      shares: 0
    })));
  });
};
