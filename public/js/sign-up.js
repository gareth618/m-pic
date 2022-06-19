async function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (email === '') return alert('you must fill in the email');
  if (password === '') return alert('you must fill in the password');
  if (password !== confirmPassword) return alert('passwords do not match');

  const ans = await call('POST', '/sign-up', {
    email,
    password
  });
  ans.error == null
    ? location.href = '/sign-in'
    : alert(ans.error);
}
