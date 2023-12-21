import { change_history, history_offset, registration, log_changes, replayHistory } from './fabric/history.ts';
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };


resizeFabric();
var tocuh_point_identity = 0;
var eraser_d = 10;
var eraser_color = '#888';

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
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

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}
// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

function gid(n) {
  var genidchars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  var genid = '';
  for (var i = 0; i < 32; i++) {
    var genrandomNumber = Math.floor(Math.random() * genidchars.length);
    genid += genidchars.substring(genrandomNumber, genrandomNumber + 1);
  }
  if (!(n === undefined)) {
    n = n.replaceAll('-', '_');
    return n + '_' + genid;
  }
  return 'id_' + genid;
}

function getFn(x0, y0, x1, y1) {
  var a = x1 - x0;
  var b = y1 - y0;
  var m = b / a;
  var k = (b * x1 - a * y1) / (-1 * a);
  return function (x) {
    return x * m + k;
    //Math.min(Math.max(x * m + k, Math.min(y0, y1)), Math.max(y0, y1));
  };
}

canvas.addEventListener(
  'touchstart',
  function (event) {
    if (mode === 0) {
      handleTouchStart_pen(event);
    }
    if (mode === 1) {
      handleTouchStart_eraser(event);
    }
    if (mode === 2) {
      moving = true;
      handleTouchStart_moving(event);
    }
  },
  false
);
canvas.addEventListener(
  'touchmove',
  function (event) {
    if (mode === 0) {
      handleTouchMove_pen(event);
    }
    if (mode === 1) {
      handleTouchMove_eraser(event);
    }
    if (mode === 2 && moving) {
      handleTouchMove_moving(event);
    }
  },
  false
);
canvas.addEventListener(
  'touchend',
  function (event) {
    if (mode === 0) {
      handleTouchEnd_pen(event);
    }
    if (mode === 1) {
      handleTouchEnd_eraser(event);
    }
    if (mode === 2 && moving) {
      handleTouchEnd_moving(event);
      moving = false;
    }
    //console.log(String(document.querySelector('svg#vector_fabric g#pen').innerHTML).length * 2/1024 + 'kb')
    saveContent();
  },
  false
);

window.addEventListener('resize', function () {
  resizeFabric();
});
ripple.addTo('.tools_container button', '#fff', 370);

loadContent();
