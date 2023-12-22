export let keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
export const supportsPassive = false;
export const wheelOpt = supportsPassive ? { passive: false } : false;
export const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

export function preventDefault(e) {
  e.preventDefault();
}

export function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

export function checkPassive() {
  try {
    window.addEventListener(
      'test',
      null,
      Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassive = true;
        }
      })
    );
  } catch (e) {}
  wheelOpt = supportsPassive ? { passive: false } : false;
}

export function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

export function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}
