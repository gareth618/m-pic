function changeTheme(dark) {
  document.getElementById('favicon').href = `../assets/favicons/${dark ? 'dark' : 'light'}.ico`;
}

const matcher = window.matchMedia('(prefers-color-scheme: dark)');
changeTheme(matcher.matches);
matcher.addEventListener('change', event => changeTheme(event.matches));
