function metrics() {
  return ['name', 'photos', 'followers', 'likes'];
}

const profiles = [];
let filter = 'all';
let sorter = 'name';
let ascend = -1;

function renderProfiles() {
  const container = document.getElementById('profiles');
  container.innerHTML = '';
  for (const profile of profiles) {
    if (profile.score === 0) continue;
    if (filter === 'all' || profile.platform === filter) {
      container.appendChild(profile.node);
    }
  }
}

function sortItems() {
  const name = document.getElementById('search').value.trim();
  for (const profile of profiles) {
    profile.score = name === '' ? -1 : 0;
    profile.score += editDistance(profile.name, name);
  }
  profiles.sort((a, b) => {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return +1;
    if (sorter === 'name') {
      if (a.name < b.name) return +ascend;
      if (a.name > b.name) return -ascend;
      return (b.id - a.id) * ascend;
    }
    const sgn = (a[sorter] - b[sorter]) * ascend;
    return sgn === 0 ? (a.id - b.id) * ascend : sgn;
  });
  renderProfiles();
}

const onloadMyProfiles = window.onload || (() => { });
window.onload = () => {
  const container = document.getElementById('profiles');
  for (const profile of [...container.children]) {
    const clone = profile.cloneNode(true);
    clone.removeAttribute('data-platform');
    clone.removeAttribute('data-username');
    clone.removeAttribute('data-photos');
    clone.removeAttribute('data-followers');
    clone.removeAttribute('data-likes');
    profiles.push({
      platform: profile.getAttribute('data-platform'),
      name: profile.getAttribute('data-username'),
      photos: parseInt(profile.getAttribute('data-photos')),
      followers: parseInt(profile.getAttribute('data-followers')),
      likes: parseInt(profile.getAttribute('data-likes')),
      node: clone,
      score: -1,
      id: profiles.length
    });
  }
  sortItems();
  onloadMyProfiles();
};
