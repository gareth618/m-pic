async function makeRequest(method, path, body) {
  const user = localStorage.getItem('M-PIC.user');
  const res = await fetch(`http://127.0.0.1:3000/api/${path}`, {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(user == null ? { } : { 'Authorisation': user })
    },
    body: JSON.stringify(body)
  });
  return await res.json();
}
