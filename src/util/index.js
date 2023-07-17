let count = 0;

function preload(assets) {
  let preloaded = [];
  for (let i = 0; i < assets.length; i++) {
    preloaded[i] = new Image();
    preloaded[i].src = assets[i];
  }
}

function debounce(func, delay) {
  let timeout;

  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
}

function updateUpperBound() {
  window.upperBound = window.innerWidth - 100;
  count++;
}


const debouncedUpdateUpperBound = debounce(updateUpperBound, 100);

export { preload, debouncedUpdateUpperBound, debounce };