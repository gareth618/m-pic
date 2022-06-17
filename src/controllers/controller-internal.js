export default function controllerInternal(router) {
  router.get('/api/sign-in', async (sql, req, res) => {
    const user_id = parseInt(await sql.call(
      'sign_in',
      [req.body.email, req.body.password]
    ));
    if (user_id === -1) {
      res.code(400);
      res.json({ error: 'wrong email or password' });
    }
    else {
      res.code(200);
      res.json({ user_id });
    }
  });

  router.post('/api/sign-up', async (sql, req, res) => {
    const user_id = parseInt(await sql.call(
      'sign_up',
      [req.body.email, req.body.password]
    ));
    if (user_id === -1) {
      res.code(400);
      res.json({ error: 'email already in use' });
    }
    else {
      res.code(200);
      res.json({ user_id });
    }
  });
};
