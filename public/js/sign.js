const onloadSign = window.onload || (() => { });
window.onload = () => {
  const columns = [...document.getElementById('photos').children];
  columns.forEach((column, index) => {
    column.scrollTop = 480;
    let offset = 0;
    const scroll = () => {
      offset = (offset + 1) % 240;
      for (const child of column.children) {
        const transform = `translateY(${offset * (index % 2 === 1 ? +1 : -1)}px)`;
        child.tagName === 'DIV'
          ? child.style.transform = transform
          : child.children[2].style.transform = transform;
      }
      if (offset === 0) {
        if (index % 2 === 0) {
          const child = column.children[0];
          column.append(child.cloneNode(true));
          column.removeChild(child);
        }
        else {
          const child = column.children[column.children.length - 1];
          column.removeChild(child);
          column.prepend(child.cloneNode(true));
        }
      }
      setTimeout(scroll, (index + 1) * 6);
    };
    scroll();
  });
  onloadSign();
};

let checked = false;

function toggleChecked(event) {
  const checkbox = document.getElementById('checkbox').classList;
  if (checked) {
    checkbox.remove('fa-square-check');
    checkbox.add('fa-square-xmark');
    checked = false;
  }
  else {
    checkbox.remove('fa-square-xmark');
    checkbox.add('fa-square-check');
    checked = true;
  }
  checkbox.add('fa-shake');
  setTimeout(() => {
    checkbox.remove('fa-shake');
  }, 500);
  event?.preventDefault();
}
