const onloadFacebookAPI = window.onload || (() => { });
window.onload = () => {
  const loadPhotosFromFacebook = async () => {
    const APP_ID = '1022457085310254';
    const APP_SECRET = '6912644212667349802c64057b8dad40';
    const CLIENT_TOKEN = '2d3a83d8aa2070e3dd96577205607bb6';
    const REDIRECT_URI = 'https://m-p1c.herokuapp.com/my-photos-facebook';
    const STATE_PARAM = 'mpic-random-string';

    const loginDialogURL = 'https://www.facebook.com/v14.0/dialog/oauth?' + new URLSearchParams({
      client_id: APP_ID,
      redirect_uri: REDIRECT_URI,
      state: STATE_PARAM
    });
    window.open(loginDialogURL, '_self');
  };
  loadPhotosFromFacebook();
  onloadFacebookAPI();
};
