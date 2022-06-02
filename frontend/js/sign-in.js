async function signIn() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email === '') {
    alert('you must fill in the email');
    return;
  }
  if (password === '') {
    alert('you must fill in the password');
    return;
  }

  const res = await makeRequest('PUT', 'sign-in', {
    email,
    password
  });
  if (res.error != null) {
    alert(res.error);
  }
  else {
    localStorage.setItem('M-PIC.user', res.user);
    window.location.href = '/my-photos';
  }
}
