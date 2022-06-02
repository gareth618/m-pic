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
    alert('passwords don\'t match');
    return;
  }

  const res = await makeRequest('POST', 'sign-up', {
    email,
    password: password1
  });
  res.error != null
    ? alert(res.error)
    : window.location.href = '/sign-in';
}
