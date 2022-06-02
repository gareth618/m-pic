const onloadGalleryJS = window.onload || (() => { });
window.onload = () => {
  const gallery = document.getElementById('gallery');
  let html = '';
  const count = parseInt(gallery.getAttribute('data-count'));
  for (let i = 1; i <= count; i++) {
    html += `
      <picture>
        <source srcset="../assets/photos/avif/${i}.avif" type="image/avif">
        <source srcset="../assets/photos/webp/${i}.webp" type="image/webp">
        <img src="../assets/photos/jpg/${i}.jpg" alt="photo ${i}">
      </picture>
    `;
  }
  gallery.innerHTML = html;
  onloadGalleryJS();
};
