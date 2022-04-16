function onClickMe() {
  document.getElementById('menu').classList.toggle('active');
}

function onClick(event) {
  setTimeout(() => event.target.blur(), 900);
}
