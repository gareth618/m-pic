export default function controllerPages(router, templater) {
  router.get('/', (_sql, _req, res) => {
    res.goto('/sign-in');
  });
  router.get('/sign-in', (_sql, _req, res) => {
    res.html(templater.render('SignIn', { }));
  });
  router.get('/sign-up', (_sql, _req, res) => {
    res.html(templater.render('SignUp', { }));
  });

  router.get('/my-profiles', async (sql, _req, res) => {
    const dbProfiles = (await sql.call(
      'get_profiles',
      [1]
    )) || [];
    const profiles = [];
    for (const { platform, token } of dbProfiles) {
      if (platform === 'facebook') {
        profiles.push({ platform });
        continue;
      }
      profiles.push(await router.call('GET', `/${platform}/profile`, { token }));
    }
    res.html(templater.render('MyProfiles', { profiles }));
  });

  router.get('/my-photos', async (sql, _req, res) => {
    const profiles = (await sql.call(
      'get_profiles',
      [1]
    )) || [];
    const photos = [];
    for (const { platform, token } of profiles) {
      if (platform !== 'unsplash') continue;
      const crtPhotos = await router.call('GET', `/${platform}/photos`, { token });
      for (const photo of crtPhotos) {
        photos.push(photo);
      }
    }
    res.html(templater.render('MyPhotos', { photos }));
  });

  for (const platform of ['unsplash', 'facebook', 'twitter']) {
    router.get(`/authorize/${platform}`, (_sql, _req, res) => {
      res.html(templater.render('Authorize', { platform }));
    });
  }
};
