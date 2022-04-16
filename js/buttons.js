function onClickBtn(id) {
  document.getElementById(id).classList.toggle('active');
}

function onClick(event) {
  setTimeout(() => event.target.blur(), 900);
}
