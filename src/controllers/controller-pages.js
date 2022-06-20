export default function controllerPages(router, templater) {
  router.get('/', (_sql, _req, res) => {
    res.goto('/sign-in');
  });

  router.get('/sign-in', (_sql, req, res) => {
    req.cook
      ? res.goto('/my-photos')
      : res.html(templater.render('SignIn', { }));
  });

  router.get('/sign-up', (_sql, req, res) => {
    req.cook
      ? res.goto('/my-photos')
      : res.html(templater.render('SignUp', { }));
  });

  router.get('/my-profiles', async (sql, req, res) => {
    const user_id = req.cook;
    if (user_id == null) {
      res.goto('/sign-in');
    }
    else {
      const dbProfiles = (await sql.call('get_profiles', [user_id])) || [];
      const profiles = [];
      for (const { id, platform, token } of dbProfiles) {
        profiles.push(await router.call('GET', `/${platform}/profile`, { profile_id: id, token }));
      }
      res.html(templater.render('MyProfiles', { profiles }));
    }
  });

  router.get('/my-photos', async (sql, req, res) => {
    const user_id = req.cook;
    if (user_id == null) {
      res.goto('/sign-in');
    }
    else {
      const profiles = (await sql.call('get_profiles', [user_id])) || [];
      const photos = [];
      photos.push(...(await router.call('GET', '/photos', { user_id })));
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
    router.get(`/authorize/${platform}`, (_sql, req, res) => {
      req.cook
        ? res.html(templater.render('Authorize', { platform }))
        : res.goto('/sign-in');
    });
  }
};
