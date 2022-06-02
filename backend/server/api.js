import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'mpic',
  password: 'mpic'
});
await pool.connect();

const apis = [];

function makeApi(requiresUser, theMethod, theRoute, theBody, query) {
  const theBodyFields = JSON.stringify(theBody.map(({ field }) => field).sort());
  apis.push(async (user, method, route, body) => {
    if (requiresUser && user == -1) return;
    if (theMethod != method) return;
    if (theRoute != route) return;
    const bodyFields = JSON.stringify(Object.keys(body).sort());
    if (theBodyFields != bodyFields) return;
    for (const { field, type } of theBody) {
      if (type !== typeof body[field]) {
        return;
      }
    }
    return await query(body, user);
  });
}

makeApi(false, 'PUT', 'sign-in', [
  { field: 'email', type: 'string' },
  { field: 'password', type: 'string' }
], async body => {
  const res = await pool.query(
    'select sign_in ($1::text, $2::text)',
    [body.email, body.password]
  );
  const ans = res.rows[0].sign_in;
  return ans.startsWith('wrong')
    ? { error: ans }
    : { user: parseInt(ans.split(' ').slice(-1)[0]) }
});

makeApi(false, 'POST', 'sign-up', [
  { field: 'email', type: 'string' },
  { field: 'password', type: 'string' }
], async body => {
  const res = await pool.query(
    'select sign_up ($1::text, $2::text)',
    [body.email, body.password]
  );
  const ans = res.rows[0].sign_up;
  return ans.startsWith('email')
    ? { error: ans }
    : { user: parseInt(ans.split(' ').slice(-1)[0]) }
});

export default async function queryApi(user, method, route, body) {
  for (const api of apis) {
    const ans = await api(user, method, route, body);
    if (ans != null) return ans;
  }
};
