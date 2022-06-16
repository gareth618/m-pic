const onloadConnectFacebook = window.onload || (() => { });
window.onload = () => {
  const authorize = async () => {
    if (location.href.indexOf('?') === -1) {
      window.open('https://www.facebook.com/v14.0/dialog/oauth?' + new URLSearchParams({
        client_id: '1133529227195848',
        redirect_uri: location.href,
        response_type: 'code',
        state: 'mpic-random-string'
      }), '_self');
      return;
    }
    const { profile } = await call('POST', '/facebook/authorize', {
      user: localStorage.getItem('M-PIC.user'),
      code: new URLSearchParams(location.search).get('code')
    });
    await call('PUT', '/facebook/token', { profile });
    window.open('/my-profiles', '_self');
  };
  authorize();
  onloadConnectFacebook();
};
