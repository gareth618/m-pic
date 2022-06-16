const onloadConnectFacebook = window.onload || (() => { });
window.onload = () => {
  const authorize = async () => {
    if (window.location.href.indexOf('?') === -1) {
      window.open('https://www.facebook.com/v14.0/dialog/oauth?' + new URLSearchParams({
        client_id: '1133529227195848',
        redirect_uri: window.location.href,
        response_type: 'code',
        state: 'mpic-random-string'
      }), '_self');
      return;
    }
    console.log(new URLSearchParams(window.location.search).get('code'));
  //   const CODE = window.location.href.match(/\?code=(?<code>.+)\&state=/).groups.code;

  //   const getAccessTokenURL
  //     = 'https://graph.facebook.com/v14.0/oauth/access_token?'
  //     + new URLSearchParams({
  //       client_id: APP_ID,
  //       client_secret: APP_SECRET,
  //       redirect_uri: REDIRECT_URI,
  //       code: CODE
  //     });
  //   const accessToken = (await (await fetch(getAccessTokenURL, { method: 'POST' })).json()).access_token;

  //   console.log(await (await fetch('https://graph.facebook.com/me/accounts?' + new URLSearchParams({
  //     access_token: accessToken
  //   }), { method: 'GET' })).json());
  };
  authorize();
  onloadConnectFacebook();
};
