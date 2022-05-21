async function signIn() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  alert(email + '\n' + password);
  const res = await fetch('http://localhost:3000/api/sign-in', {
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
  const ok = JSON.parse(new TextDecoder().decode((await res.body.getReader().read()).value)).ok;
  console.log(ok);
}
