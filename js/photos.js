const onloadPhotosJS = window.onload || (() => { });
window.onload = () => {
  const columns = [...document.getElementById('photos').children];
  columns.forEach((column, index) => {
    column.scrollTop = 240;
    let offset = 0;
    const scroll = () => {
      offset = (offset + 1) % 240;
      for (const image of column.children) {
        image.style.transform = `translateY(${offset * (index % 2 === 1 ? +1 : -1)}px)`;
      }
      if (offset === 0) {
        if (index % 2 === 0) {
          const child = column.children[0];
          column.append(child.cloneNode());
          column.removeChild(child);
        }
        else {
          const child = column.children[column.children.length - 1];
          column.removeChild(child);
          column.prepend(child.cloneNode());
        }
      }
      setTimeout(scroll, Math.exp(index * .9 + 1));
    };
    scroll();
  });
  onloadPhotosJS();
};
