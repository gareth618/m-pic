const onloadAuthorizeUnsplash = window.onload || (() => { });
window.onload = () => {
  const authorize = async () => {
    if (window.location.href.indexOf('?') === -1) {
      window.open('https://unsplash.com/oauth/authorize?' + new URLSearchParams({
        client_id: 'Hav7ZVsPUyp0pIpVJplZfLX9selnSzSbMV34axsosgw',
        redirect_uri: window.location.href,
        response_type: 'code',
        scope: 'public read_user read_collections'
      }), '_self');
      return;
    }
    const { profile } = await call('POST', '/unsplash/authorize', {
      user: localStorage.getItem('M-PIC.user'),
      code: new URLSearchParams(window.location.search).get('code')
    });
    await call('PUT', '/unsplash/token', { profile });
    window.open('/my-profiles', '_self');
  };
  authorize();
  onloadAuthorizeUnsplash();
};
