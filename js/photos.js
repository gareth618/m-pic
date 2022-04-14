const prevOnLoad2 = window.onload;
window.onload = () => {
  const columns = [...document.getElementById('photos').children];
  columns.forEach((column, index) => {
    if (index % 2 === 1) {
      column.classList.add('reversed');
    }
    const scroll = () => {
      column.scrollTop++;
      const height = column.children[0].clientHeight;
      if (column.scrollTop % Math.floor(height + height / 7) === 0) {
        column.appendChild(column.children[0].cloneNode());
        column.removeChild(column.children[0]);
      }
      setTimeout(scroll, Math.exp(index + 2));
    };
    scroll();
  });
  if (prevOnLoad2 != null) {
    prevOnLoad2();
  }
};
