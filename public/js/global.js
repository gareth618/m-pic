function changeTheme(dark) {
  document.getElementById('favicon').href = `/public/favicons/${dark ? 'dark' : 'light'}.svg`;
}

const matcher = window.matchMedia('(prefers-color-scheme: dark)');
changeTheme(matcher.matches);
matcher.addEventListener('change', event => changeTheme(event.matches));

async function call(method, path, body) {
  return await (await fetch(`/api${path}` + (method === 'GET' ? '?' + new URLSearchParams(body) : ''), {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    ...(method === 'GET' ? { } : { body: JSON.stringify(body) })
  })).json();
}
