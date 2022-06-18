const onloadAuthorizeTwitter = window.onload || (() => { });
window.onload = () => {
  const authorize = async () => {
    if (location.href.indexOf('?') === -1) {
      window.open('https://api.twitter.com/oauth/authorize?' + new URLSearchParams({
        oauth_token: (await call('GET', '/twitter/init')).token
      }), '_self');
      return;
    }
    const params = new URLSearchParams(location.search);
    const oauth_token = params.get('oauth_token');
    const oauth_verifier = params.get('oauth_verifier');
    if (oauth_token != null && oauth_verifier != null) {
      await call('POST', '/twitter/authorize', {
        user_id: localStorage.getItem('M-PIC.user'),
        oauth_token,
        oauth_verifier
      });
    }
    window.open('/my-profiles', '_self');
  };
  authorize();
  onloadAuthorizeTwitter();
};
