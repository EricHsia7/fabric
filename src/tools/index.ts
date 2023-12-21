export function setToolMode(m) {
  mode = m;
  function getSelector(m) {
    return document.querySelector(`.tools_container button[m="${m}"] span`);
  }
  for (var i = 0; i < 3; i++) {
    getSelector(i).classList.remove('filled');
  }
  getSelector(m).classList.add('filled');
}
