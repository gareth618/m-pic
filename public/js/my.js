function toggleActiveOn(id) {
  document.getElementById(id).classList.toggle('active');
}

function signOut() {
  document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT';
  location.href = '/sign-in';
}

function filterItemsBy(platform) {
  setTimeout(() => {
    document.getElementById(`filter-by-${platform}`).blur();
  }, 900);
  filter = platform;
  sortItems();
}

function sortItemsBy(metric) {
  setTimeout(() => {
    document.getElementById(`sort-by-${metric}`).blur();
  }, 500);
  for (const metric of metrics()) {
    document.getElementById(`sort-by-${metric}`).classList.remove('asc');
    document.getElementById(`sort-by-${metric}`).classList.remove('des');
  }
  if (metric === sorter) {
    ascend *= -1;
    document.getElementById(`sort-by-${metric}`).classList.add(ascend === -1 ? 'des' : 'asc');
  }
  else {
    ascend = -1;
    sorter = metric;
    document.getElementById(`sort-by-${metric}`).classList.add('des');
  }
  sortItems();
}

function editDistance(a, b) {
  const m = a.length; a = '*' + a.toLowerCase();
  const n = b.length; b = '*' + b.toLowerCase();
  const dp = [];
  for (let i = 0; i <= m; i++) {
    dp.push([]);
    for (let j = 0; j <= n; j++) {
      dp[i].push(1e9);
    }
  }
  dp[0][0] = 0;
  for (let i = 1; i <= m; i++) dp[i][0] = i;
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i] === b[j]
        ? dp[i - 1][j - 1]
        : Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
    }
  }
  const cost = dp[a.length - 1][b.length - 1];
  const maxCost = Math.max(a.length, b.length);
  if (cost > Math.sqrt(maxCost)) return 0;
  return cost === 0 ? 10 * a.length : maxCost - cost;
}
