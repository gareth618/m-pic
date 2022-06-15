function changeTheme(dark) {
  document.getElementById('favicon').href = `/public/favicons/${dark ? 'dark' : 'light'}.svg`;
}

const matcher = window.matchMedia('(prefers-color-scheme: dark)');
changeTheme(matcher.matches);
matcher.addEventListener('change', event => changeTheme(event.matches));

async function call(method, path, body) {
  let url = `/api${path}`;
  url += method === 'GET' ? '?' + new URLSearchParams(body) : '';
  const res = await fetch(url, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    ...(method === 'GET' ? { } : { body: JSON.stringify(body) })
  });
  return await res.json();
}
