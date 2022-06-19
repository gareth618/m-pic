const onloadConnectFacebook = window.onload || (() => { });
window.onload = () => {
  const authorize = async () => {
    if (location.href.indexOf('?') === -1) {
      window.open('https://www.facebook.com/v14.0/dialog/oauth?' + new URLSearchParams({
        client_id: '1133529227195848',
        redirect_uri: location.href,
        response_type: 'code',
        state: 'mpic-random-string'
      }) + '&scope=public_profile,user_posts,user_photos,user_friends,user_link', '_self');
      return;
    }
    const code = new URLSearchParams(location.search).get('code');
    if (code != null) {
      const { profile_id } = await call('POST', '/facebook/authorize', { code });
      await call('PUT', '/facebook/token', { profile_id });
    }
    window.open('/my-profiles', '_self');
  };
  authorize();
  onloadConnectFacebook();
};
