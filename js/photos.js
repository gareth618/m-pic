const onloadPhotosJS = window.onload || (() => { });
window.onload = () => {
  const columns = [...document.getElementById('photos').children];
  columns.forEach((column, index) => {
    if (index % 2 === 1) {
      column.classList.add('reversed');
    }
    const scroll = () => {
      column.scrollTop++;
      if (column.scrollTop % 240 === 0) {
        column.appendChild(column.children[0].cloneNode());
        column.removeChild(column.children[0]);
      }
      setTimeout(scroll, Math.exp(index * .9 + 1));
    };
    scroll();
  });
  onloadPhotosJS();
};
