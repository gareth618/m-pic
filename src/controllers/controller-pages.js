import fetch from 'node-fetch';

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

  router.get('/my-profiles', (_sql, _req, res) => {
    const random = max => Math.floor(Math.random() * max);
    const icons = ['facebook', 'instagram', 'reddit-alien', 'twitter', 'unsplash'];
    const users = ['gareth618', 'lizzzu', 'oracolul', 'mikeIMT', 'bossu', 'bunul20', 'fanurie', 'juve45', 'b9i', 'denis2111', 'geniucos', 'usu', 'paftenie', 'macarie'];
    const count = random(25) + 25;
    const profiles = [];
    for (let i = 0; i < count; i++) {
      profiles.push({
        icon: icons[random(icons.length)],
        user: users[random(users.length)],
        photos: random(1000),
        followers: random(1000),
        shares: random(1000)
      });
    }
    res.html(templater.render('MyProfiles', { profiles }));
  });

  router.get('/my-photos', async (sql, _req, res) => {
    const profiles = (await sql.call(
      'get_profiles',
      [1] // [req.body.user]
    )) || [];
    const photos = [];
    for (const { platform, token } of profiles) {
      if (platform === 'unsplash') {
        const username = (await (await fetch('https://api.unsplash.com/me', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        })).json()).username;
        const collections = await (await fetch(`https://api.unsplash.com/users/${username}/collections?client_id=${token}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        })).json();
        collections.forEach(collection => {
          collection.preview_photos.forEach(photo => {
            photos.push(photo.urls.small);
          });
        });
      }
    }
    res.code(200);
    res.html(templater.render('MyPhotos', { photos }));
  });

  for (const platform of ['unsplash', 'facebook', 'twitter']) {
    router.get(`/authorize/${platform}`, (_sql, _req, res) => {
      res.html(templater.render('Authorize', { platform }));
    });
  }
};
