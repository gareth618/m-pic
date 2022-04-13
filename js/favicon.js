matcher = window.matchMedia('(prefers-color-scheme: dark)');
matcher.addListener(onUpdate);
onUpdate();

lightIcon = document.querySelector('link#light-icon');
darkIcon = document.querySelector('link#dark-icon');

function onUpdate() {
  if (matcher.matches) {
    lightIcon.remove();
    document.head.append(darkIcon);
  }
  else {
    document.head.append(lightIcon);
    darkIcon.remove();
  }
}
