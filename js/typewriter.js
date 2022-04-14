const prevOnLoad1 = window.onload;
window.onload = () => {
  for (const el of document.getElementsByClassName('typewrite-words')) {
    const states = [];
    for (const word of el.getAttribute('data-words').split(', ')) {
      let delta = 500;
      for (let i = 1; i <= word.length; i++) {
        states.push([word.substring(0, i), delta]);
        delta /= 1.25;
      }
      states.push([word, 3000]);
      for (let i = word.length; i >= 1; i--) {
        states.push([word.substring(0, i), 100]);
      }
      states.push(['', 500]);
    }

    let index = 0;
    const write = () => {
      const [text, delta] = states[index];
      el.innerText = text;
      index = (index + 1) % states.length;
      setTimeout(write, delta);
    };
    write();
  }
  
  for (const el of document.getElementsByClassName('typewrite-word')) {
    const word = el.getAttribute('data-word');
    el.innerHTML = `<span></span><span>${word}</span>`;
  }
  prevOnLoad1();
};

let wrote = false;

window.onscroll = () => {
  if (!wrote && document.getElementById('description').getBoundingClientRect().top < 0) {
    let delay = 500;
    for (const el of document.getElementsByClassName('typewrite-word')) {
      const word = el.getAttribute('data-word');
      for (let i = 1; i <= word.length; i++) {
        setTimeout(() => {
          el.innerHTML
            = `<span>${word.substring(0, i)}</span>`
            + `<span>${word.substring(i)}</span>`;
        }, delay);
        delay += 100;
      }
      delay += 500;
    }
    wrote = true;
  }
};
