import 'dotenv/config';
import fetch from 'node-fetch';

export default function controllerFacebook(router) {
  router.post('/api/facebook/authorize', async (sql, req, res) => {
    const profile_id = parseInt(await sql.call(
      'add_profile',
      [req.body.user_id, 'facebook', req.body.code]
    ));
    res.code(200);
    res.json({ profile_id });
  });

  router.put('/api/facebook/token', async (sql, req, res) => {
    const { code } = (await sql.call(
      'get_profile',
      [req.body.profile_id]
    ))[0];
    const token = (await (await fetch('https://graph.facebook.com/v14.0/oauth/access_token?' + new URLSearchParams({
      client_id: process.env.FACEBOOK_ACCESS_KEY,
      client_secret: process.env.FACEBOOK_SECRET_KEY,
      redirect_uri: router.domain() + 'authorize/facebook',
      code
    }), {
      method: 'POST'
    })).json()).access_token;
    await sql.call(
      'set_profile_token',
      [req.body.profile_id, token]
    );
    res.code(200);
    res.json({ token });
  });
};

// console.log(await (await fetch('https://graph.facebook.com/me/accounts?' + new URLSearchParams({
//   access_token: accessToken
// }), { method: 'GET' })).json());
