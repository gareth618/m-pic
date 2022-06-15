const onloadTwitterAPI = window.onload || (() => { });
window.onload = () => {
  const loadPhotosFromTwitter = async () => {
    const ACCESS_KEY = '9qlxqpU2SherZlf7WQVsFYQ3T';
    const SECRET_KEY = 'XKx8CpVaPQuorHrGl6mj1OLenyHeI95BVAFvsq80if3zdM5Ep9';

    const res = await fetch('https://api.twitter.com/oauth/request_token?' + new URLSearchParams({
      oauth_callback: 'https://m-p1c.herokuapp.com/my-photos-twitter'
    }));
    console.log(res);
  };
  loadPhotosFromTwitter();
  onloadTwitterAPI();
};
