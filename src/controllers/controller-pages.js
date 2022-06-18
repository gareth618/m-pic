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
    for (const { id, platform, token } of dbProfiles) {
      profiles.push(await router.call('GET', `/${platform}/profile`, { profile_id: id, token }));
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
      photos.push(...(await router.call('GET', `/${platform}/photos`, { token })));
    }
    for (const photo of photos) {
      photo.date = new Date(Date.parse(photo.date));
    }
    photos.sort((a, b) => b.date.getTime() - a.date.getTime());
    res.html(templater.render('MyPhotos', { photos }));
  });

  for (const platform of ['unsplash', 'facebook', 'twitter']) {
    router.get(`/authorize/${platform}`, (_sql, _req, res) => {
      res.html(templater.render('Authorize', { platform }));
    });
  }
};
