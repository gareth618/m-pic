const onloadConnectTwitter = window.onload || (() => { });
window.onload = () => {
  const loadPhotos = async () => {
    if (window.location.href.indexOf('?') === -1) {
      const token = await call('GET', '/authorize/twitter');
      const authorizeAppURL
        = 'https://api.twitter.com/oauth/authorize?'
        + new URLSearchParams({
          oauth_token: token
        });
      window.open(authorizeAppURL, '_self');
      return;
    }
    const params = window.location.href.match(/\?oauth_token=(?<token>.+)\&oauth_verifier=(?<verifier>.+)/).groups;

    const tokens = await call('GET', '/token/twitter', {
      oauth_token: params.token,
      oauth_verifier: params.verifier
    });
    console.log(tokens);
  };
  loadPhotos();
  onloadConnectTwitter();
};
