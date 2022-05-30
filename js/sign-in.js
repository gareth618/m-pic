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

  const res = await fetch('http://127.0.0.1:3000/api/sign-in', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const body = await res.body.getReader().read();
  const ans = JSON.parse(new TextDecoder().decode(body.value));
  ans.message === 'ok'
    ? window.location.href = '/my-photos'
    : alert(ans.message);
}
