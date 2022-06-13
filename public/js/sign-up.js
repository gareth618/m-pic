async function signUp() {
  const email = document.getElementById('email').value;
  const password1 = document.getElementById('password').value;
  const password2 = document.getElementById('confirm-password').value;

  if (email === '') {
    alert('you must fill in the email');
    return;
  }
  if (password1 === '') {
    alert('you must fill in the password');
    return;
  }
  if (password1 !== password2) {
    alert('passwords do not match');
    return;
  }

  const ans = await call('POST', '/sign-up', {
    email,
    password: password1
  });
  ans.error != null
    ? alert(res.error)
    : window.location.href = '/sign-in';
}
