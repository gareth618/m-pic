const photos = [];

function renderPhotos() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  for (const photo of photos) {
    gallery.appendChild(photo.node);
  }
}

const onloadMyPhotos = window.onload || (() => { });
window.onload = () => {
  const gallery = document.getElementById('gallery');
  for (const photo of [...gallery.children]) {
    const clone = photo.cloneNode();
    clone.removeAttribute('data-platform');
    clone.removeAttribute('data-tags');
    clone.removeAttribute('data-date');
    clone.removeAttribute('data-likes');
    clone.removeAttribute('data-shares');
    photos.push({
      platform: photo.getAttribute('data-platform'),
      tags: photo.getAttribute('data-tags').split(' '),
      date: parseInt(photo.getAttribute('data-date')),
      likes: parseInt(photo.getAttribute('data-likes')),
      shares: parseInt(photo.getAttribute('data-shares')),
      node: clone
    });
  }
  renderPhotos();
  onloadMyPhotos();
};

function sortImagesByTags(event) {
  if (event.key !== 'Enter') return;
  const tags = document.getElementById('search').value.split(' ');
  for (const photo of photos) {
    photo.score = 0;
    for (const tag of tags) {
      photo.score += photo.tags.includes(tag) ? 1 : 0;
    }
  }
  photos.sort((a, b) => a.score - b.score);
  console.log(photos);
  for (const photo of photos) {
    photo.score = undefined;
  }
  renderPhotos();
}
