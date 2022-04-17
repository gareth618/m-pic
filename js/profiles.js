const onloadProfilesJS = window.onload || (() => { });
window.onload = () => {
  const random = max => Math.floor(Math.random() * max);
  const icons = ['fa-facebook', 'fa-instagram', 'fa-reddit-alien', 'fa-twitter', 'fa-unsplash'];
  const users = ['gareth618', 'lizzzu', 'juve45', 'denis2111', 'bunul20', 'b9i', 'bo$$u', 'mikeIMT', 'oracolul'];
  const count = random(25) + 25;
  let html = '';
  for (let i = 0; i < count; i++) {
    const icon = icons[random(icons.length)];
    const user = users[random(users.length)];
    const photos = random(1000);
    const followers = random(1000);
    const shares = random(1000);
    html += `
      <div>
        <i class="fa-brands ${icon}"></i>
        <h3>${user}</h3>
        <div class="status">
          <div>
            <i class="fa-solid fa-image"></i>
            <p>${photos}</p>
          </div>
          <div>
            <i class="fa-solid fa-user-large"></i>
            <p>${followers}</p>
          </div>
          <div>
            <i class="fa-solid fa-heart"></i>
            <p>${shares}</p>
          </div>
        </div>
        <div class="buttons">
          <button class="view">view</button>
          <button class="delete">delete</button>
        </div>
      </div>
    `;
  };
  document.getElementById('profiles').innerHTML = html;
  onloadProfilesJS();
};
