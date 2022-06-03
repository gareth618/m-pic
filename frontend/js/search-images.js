async function searchImages() {
  const input = document.getElementById('search').value;
  const [profiles, tags] = input.split(' | ');
  const res = await makeRequest('PUT', 'search-images', {
    'profiles-ids': profiles.split(' ').map(token => parseInt(token)),
    'tags': tags.split(' ')
  });
  console.log(res);
}
