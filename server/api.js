import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'mpic',
  host: 'localhost',
  database: 'postgres',
  password: 'mpic',
  port: 5432
});
await pool.connect();

export default async function api(route, body) {
  if (route === 'sign-in') {
    const res = await pool.query(
      'SELECT password FROM users WHERE email = $1::text',
      [body.email]
    );
    const msg
      = res.rows.length === 0 ? 'user doesn\'t exist'
      : res.rows[0].password !== body.password ? 'wrong password'
      : 'ok';
    return { msg };
  }
  if (route === 'sign-up') {
    const res = await pool.query(
      'SELECT email FROM users WHERE email = $1::text',
      [body.email]
    );
    if (res.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (email, password) VALUES ($1::text, $2::text)',
        [body.email, body.password]
      );
    }
    const msg
      = res.rows.length !== 0 ? 'email address already exists'
      : 'ok';
    return { msg };
  }
};
