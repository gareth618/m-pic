const onloadConnectFacebook = window.onload || (() => { });
window.onload = () => {
  const loadPhotos = async () => {
    const APP_ID = '1022457085310254';
    const APP_SECRET = '6912644212667349802c64057b8dad40';
    const CLIENT_TOKEN = '2d3a83d8aa2070e3dd96577205607bb6';
    const REDIRECT_URI = 'https://m-p1c.herokuapp.com/my-photos-facebook';
    const STATE_PARAM = 'mpic-random-string';

    if (window.location.href.indexOf('?') === -1) {
      const authorizeAppURL
        = 'https://www.facebook.com/v14.0/dialog/oauth?'
        + new URLSearchParams({
          client_id: APP_ID,
          redirect_uri: REDIRECT_URI,
          state: STATE_PARAM,
          response_type: 'code'
        });
      window.open(authorizeAppURL, '_self');
      return;
    }
    const CODE = window.location.href.match(/\?code=(?<code>.+)\&state=/).groups.code;

    const getAccessTokenURL
      = 'https://graph.facebook.com/v14.0/oauth/access_token?'
      + new URLSearchParams({
        client_id: APP_ID,
        client_secret: APP_SECRET,
        redirect_uri: REDIRECT_URI,
        code: CODE
      });
    const accessToken = (await (await fetch(getAccessTokenURL, { method: 'POST' })).json()).access_token;

    console.log(await (await fetch('https://graph.facebook.com/me/accounts?' + new URLSearchParams({
      access_token: accessToken
    }), { method: 'GET' })).json());
  };
  loadPhotos();
  onloadConnectFacebook();
};
