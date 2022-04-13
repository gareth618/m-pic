const lightIcon = document.getElementById('light-icon');
const darkIcon = document.getElementById('dark-icon');

const matcher = window.matchMedia('(prefers-color-scheme: dark)');
matcher.addEventListener('change', event => changeTheme(event.matches ? 'dark' : 'light'));
changeTheme(matcher.matches ? 'dark' : 'light');

function changeTheme(theme) {
  if (theme === 'dark') {
    lightIcon.remove();
    document.head.append(darkIcon);
  }
  else {
    document.head.append(lightIcon);
    darkIcon.remove();
  }
}
