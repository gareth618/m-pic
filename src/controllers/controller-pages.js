import { randomBytes } from 'crypto';
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

  router.get('/my-profiles', async (sql, _req, res) => {
    const my_profiles = (await sql.call(
      'get_profiles',
      [1]
    )) || [];
    const profiles = [];
    const random = max => Math.floor(Math.random() * max);
    for (const { platform, token } of my_profiles) {
      profiles.push({
        icon: platform,
        user: token ? 'username' : 'unknown',
        photos: random(1000),
        followers: random(1000),
        shares: random(1000)
      })
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
