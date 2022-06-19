import jwt from 'jsonwebtoken';

export default function controllerPages(router, templater) {
  const SESSION_DURATION = 3600;
  router.get('/', (_sql, _req, res) => {
    res.goto('/sign-in');
  });

  router.get('/sign-in', (_sql, req, res) => {
    const token = req.head.cookie?.split(';')?.find(cookie => cookie.startsWith('token='))?.slice('token='.length);
    token == null || Date.parse(new Date()) / 1000 - jwt.decode(token).iat > SESSION_DURATION
      ? res.html(templater.render('SignIn', { }))
      : res.goto('/my-photos');
  });

  router.get('/sign-up', (_sql, req, res) => {
    const token = req.head.cookie?.split(';')?.find(cookie => cookie.startsWith('token='))?.slice('token='.length);
    token == null || Date.parse(new Date()) / 1000 - jwt.decode(token).iat > SESSION_DURATION
      ? res.html(templater.render('SignUp', { }))
      : res.goto('/my-photos');
  });
  
  router.get('/my-profiles', async (sql, req, res) => {
    const token = req.head.cookie?.split(';')?.find(cookie => cookie.startsWith('token='))?.slice('token='.length);
    if (token == null || Date.parse(new Date()) / 1000 - jwt.decode(token).iat > SESSION_DURATION) {
      res.goto('/sign-in');
    }
    else {
      const dbProfiles = (await sql.call(
        'get_profiles',
        [jwt.decode(token).user_id]
      )) || [];
      const profiles = [];
      for (const { id, platform, token } of dbProfiles) {
        profiles.push(await router.call('GET', `/${platform}/profile`, { profile_id: id, token }));
      }
      res.html(templater.render('MyProfiles', { profiles }));
    }
  });

  router.get('/my-photos', async (sql, req, res) => {
    const token = req.head.cookie?.split(';')?.find(cookie => cookie.startsWith('token='))?.slice('token='.length);
    if (token == null || Date.parse(new Date()) / 1000 - jwt.decode(token).iat > SESSION_DURATION) {
      res.goto('/sign-in');
    }
    else {
      const profiles = (await sql.call(
        'get_profiles',
        [jwt.decode(token).user_id]
      )) || [];
      const photos = [];
      for (const { platform, token } of profiles) {
        photos.push(...(await router.call('GET', `/${platform}/photos`, { token })));
      }
      for (const photo of photos) {
        photo.date = Date.parse(photo.date);
      }
      photos.sort((a, b) => b.date - a.date);
      res.html(templater.render('MyPhotos', { photos }));
    }
  });

  for (const platform of ['unsplash', 'facebook', 'twitter']) {
    router.get(`/authorize/${platform}`, (_sql, _req, res) => {
      res.html(templater.render('Authorize', { platform }));
    });
  }
};
