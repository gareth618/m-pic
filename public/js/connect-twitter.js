const onloadConnectTwitter = window.onload || (() => { });
window.onload = () => {
  const loadPhotos = async () => {
    console.log(await call('GET', '/connect/twitter'));
  };
  loadPhotos();
  onloadConnectTwitter();
};
