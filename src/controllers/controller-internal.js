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
      res.cook(user_id, req.body.remember === 'true');
      res.json({ });
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
      res.cook(user_id, req.body.remember === 'true');
      res.json({ });
    }
  });

  router.delete('/api/delete', async (sql, req, res) => {
    await sql.call(
      'delete_profile',
      [req.body.profile_id]
    );
    res.code(200);
    res.json({ });
  });
};
