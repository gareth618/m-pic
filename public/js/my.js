function onClickBtn(id) {
  document.getElementById(id).classList.toggle('active');
}

function onClick(event) {
  setTimeout(() => event.target.blur(), 900);
}

function onClickSortBtn(id) {
  const list = document.getElementById(id).classList;
  if (list.contains('active')) {
    list.remove('active');
  }
  else {
    for (const other of ['sort-date', 'sort-likes', 'sort-shares']) {
      document.getElementById(other).classList.remove('active');
    }
    list.add('active');
  }
}

function signOut() {
  localStorage.removeItem('M-PIC.user');
  location.href = '/sign-in';
}
