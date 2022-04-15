function changeTheme(dark) {
  const lightIcon = document.getElementById('light-icon');
  const darkIcon = document.getElementById('dark-icon');
  if (dark) {
    lightIcon.remove();
    document.head.append(darkIcon);
  }
  else {
    document.head.append(lightIcon);
    darkIcon.remove();
  }
}

const matcher = window.matchMedia('(prefers-color-scheme: dark)');
changeTheme(matcher.matches);
matcher.addEventListener('change', event => changeTheme(event.matches));
