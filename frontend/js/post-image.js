async function postImage() {
  const res = await makeRequest('POST', 'post-image', {
    'profiles-ids': [1, 2, 3],
    'tags': ['snail', 'flower'],
    'text': 'Hello World! I am a beautiful snail on a beautiful flower :)'
  });
  setTimeout(() => {
    alert(`added image with id ${res.id} with\ntext: ${res.text}\ntags: ${res.tags}`);
  }, 1000);
}
