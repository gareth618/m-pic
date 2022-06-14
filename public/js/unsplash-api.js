const onloadUnsplashAPI = window.onload || (() => { });
window.onload = () => {
  const loadPhotosFromUnsplash = async () => {
    const ACCESS_KEY = 'fYYxcL26k6kwhwqZql_3lgO86KhpuhID-cWQg9Z9_P4';
    const SECRET_KEY = '8pkIKHWiYeck0qJCbiyNUvRT09xI2YJNb4sH33Vh0Ak';

    if (window.location.href.indexOf('?') === -1) {
      const authorizeAppURL
        = 'https://unsplash.com/oauth/authorize?'
        + new URLSearchParams({
          client_id: ACCESS_KEY,
          redirect_uri: window.location.href,
          response_type: 'code',
          scope: 'public read_user read_collections'
        });
      window.open(authorizeAppURL, '_self');
      return;
    }
    const CODE = window.location.href.match(/\?code=(?<code>.+)/).groups.code;

    const getAccessTokenURL
      = 'https://unsplash.com/oauth/token?'
      + new URLSearchParams({
        client_id: ACCESS_KEY,
        client_secret: SECRET_KEY,
        redirect_uri: window.location.href.match(/(?<uri>.*)\?/).groups.uri,
        code: CODE,
        grant_type: 'authorization_code'
      });
    const ACCESS_TOKEN = (await (await fetch(getAccessTokenURL, { method: 'POST' })).json()).access_token;

    const username = (await (await fetch('https://api.unsplash.com/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    })).json()).username;

    const collections = await (await fetch(`https://api.unsplash.com/users/${username}/collections?client_id=${ACCESS_KEY}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    })).json();

    const photos = [];
    collections.forEach(collection => {
      collection.preview_photos.forEach(photo => {
        photos.push(photo.urls.small);
      });
    });

    const gallery = document.getElementById('gallery');
    for (const photo of photos) {
      const image = document.createElement('img');
      image.setAttribute('src', photo);
      image.setAttribute('alt', 'unsplash photo')
      gallery.appendChild(image);
    }
  };
  loadPhotosFromUnsplash();
  onloadUnsplashAPI();
};
