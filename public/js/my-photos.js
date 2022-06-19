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
    const data = photos.slice(-1)[0];
    clone.onclick = () => {
      modal.style.display = 'block';
      image.src = clone.src;
      caption.innerHTML = `
        date: ${new Date(data.date).toLocaleString()}<br>
        platform: ${data.platform}<br>
        tags: ${data.tags}<br>
        ${data.likes} likes<br>
        ${data.shares} shares
      `;
    };
  }
  renderPhotos();
  onloadMyPhotos();
};

function filterItems(platform) {
  filter = platform;
  sortItems();
}

const img = document.getElementById('image');
const resetAll = document.getElementById('resetAll');

const effects = ['brightness', 'contrast', 'blur', 'opacity', 'grayscale', 'saturate', 'sepia', 'hue', 'invert'];
const effectsInit = {
  'brightness': 100,
  'contrast': 100,
  'saturate': 100,
  'grayscale': 0,
  'invert': 0,
  'hue': 0,
  'blur': 0,
  'opacity': 100,
  'sepia': 0,
  'dropshadow': 0
}
const effectsValues = {
  'brightness': 100,
  'contrast': 100,
  'saturate': 100,
  'grayscale': 0,
  'invert': 0,
  'hue': 0,
  'blur': 0,
  'opacity': 100,
  'sepia': 0,
  'dropshadow': 0
};

function updateFilters() {
  img.style.filter =
    'brightness(' + effectsValues.brightness + '%) ' +
    'contrast(' + effectsValues.contrast + '%) ' +
    'blur(' + effectsValues.blur + 'px) ' +
    'opacity(' + effectsValues.opacity + '%) ' +
    'grayscale(' + effectsValues.grayscale + '%) ' +
    'saturate(' + effectsValues.saturate + '%) ' +
    'sepia(' + effectsValues.sepia + '%) ' +
    'hue-rotate(' + effectsValues.hue + 'deg) ' +
    'invert(' + effectsValues.invert + '%)';
}

for (const effect of effects) {
  const slider = document.getElementById(effect);
  const value = document.getElementById(`${effect}Value`);
  slider.addEventListener('input', () => {
    value.innerHTML = slider.value;
    effectsValues[`${effect}`] = slider.value;
    updateFilters();
  });
}

resetAll.addEventListener('click', () => {
  for (const effect of effects) {
    effectsValues[`${effect}`] = effectsInit[`${effect}`];
    document.getElementById(effect).value = effectsInit[`${effect}`];
  }
  updateFilters();
});
