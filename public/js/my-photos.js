const photos = [];
let filter = 'all';
let sorter = 'date';

function renderPhotos() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  for (const photo of photos) {
    if (photo.score === 0) continue;
    if (filter === 'all' || photo.platform === filter) {
      gallery.appendChild(photo.node);
    }
  }
}

function sortItems(metric) {
  if (metric != null) sorter = sorter === metric ? 'date' : metric;
  const tags = document.getElementById('search').value.split(' ').filter(tag => tag !== '');
  for (const photo of photos) {
    photo.score = tags.length === 0 ? -1 : 0;
    for (const tag of tags) {
      photo.score += photo.tags.includes(tag) ? 1 : 0;
    }
  }
  photos.sort((a, b) => {
    if (a.score > b.score) return -1;
    if (a.score < b.score) return +1;
    if (a[sorter] > b[sorter]) return -1;
    if (a[sorter] < b[sorter]) return +1;
    return a.id - b.id;
  });
  renderPhotos();
}

const onloadMyPhotos = window.onload || (() => { });
window.onload = () => {
  const modal = document.getElementById('modal');
  const image = document.getElementById('image');
  const caption = document.getElementById('caption');
  const span = document.getElementsByClassName('close')[0];
  span.onclick = () => modal.style.display = 'none';

  const gallery = document.getElementById('gallery');
  for (const photo of [...gallery.children]) {
    const clone = photo.cloneNode();
    clone.removeAttribute('data-platform');
    clone.removeAttribute('data-tags');
    clone.removeAttribute('data-date');
    clone.removeAttribute('data-likes');
    clone.removeAttribute('data-shares');
    clone.onclick = () => {
      modal.style.display = 'block';
      image.src = clone.src;
      caption.innerHTML = `${clone.alt} ${clone.src} ${clone.title}`;
    };
    photos.push({
      platform: photo.getAttribute('data-platform'),
      tags: photo.getAttribute('data-tags').split(' '),
      date: parseInt(photo.getAttribute('data-date')),
      likes: parseInt(photo.getAttribute('data-likes')),
      shares: parseInt(photo.getAttribute('data-shares')),
      node: clone,
      score: -1,
      id: photos.length
    });
  }
  renderPhotos();
  onloadMyPhotos();
};

function filterItems(platform) {
  filter = platform;
  sortItems();
}
