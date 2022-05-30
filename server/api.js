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
      'select sign_in ($1::text, $2::text)',
      [body.email, body.password]
    );
    return { message: res.rows[0].sign_in };
  }
  if (route === 'sign-up') {
    const res = await pool.query(
      'select sign_up ($1::text, $2::text)',
      [body.email, body.password]
    );
    return { message: res.rows[0].sign_up };
  }
};
