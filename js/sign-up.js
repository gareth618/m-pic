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

  const res = await fetch('http://127.0.0.1:3000/api/sign-up', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password: password1
    })
  });

  const body = await res.body.getReader().read();
  const ans = JSON.parse(new TextDecoder().decode(body.value));
  ans.msg === 'ok'
    ? window.location.href = '/sign-in'
    : alert(ans.msg);
}
