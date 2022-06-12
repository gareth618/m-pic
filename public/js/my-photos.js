const onloadMyPhotosJS = window.onload || (() => { });
window.onload = () => {
  const gallery = document.getElementById('gallery');
  let html = '';
  const count = parseInt(gallery.getAttribute('data-count'));
  for (let i = 1; i <= count; i++) {
    html += `
      <picture>
        <source srcset="/public/images/avif/${i}.avif" type="image/avif">
        <source srcset="/public/images/webp/${i}.webp" type="image/webp">
        <img src="/public/images/jpg/${i}.jpg" alt="photo ${i}">
      </picture>
    `;
  }
  gallery.innerHTML = html;
  onloadMyPhotosJS();
};
