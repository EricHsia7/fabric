var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

var canvas = document.querySelector('#fabric');
var ctx = canvas.getContext('2d');
var svg_canvas = document.querySelector('#vector_fabric');
var svg_canvas_pen_layer = document.querySelector('#vector_fabric g#pen');
var scale = Math.log(window.devicePixelRatio) / Math.log(Math.pow(2, 0.4));
var w_width = window.innerWidth;
var w_height = window.innerHeight;
var width = window.innerWidth;
var height = window.innerHeight;
var offsetX = 0;
var offsetY = 0;

var touchData = [];
var touchData_a = [];
var touchData_b = [];
var start_timestamp = 0;
var pen_width_base = 4;
var force_weight = 0;
var speed_weight = -0.7;
var pen_color = '#000';
var currentPath = { a: '', b: '', c: '' };
var mode = 0;
var registration = {};
var eraser_selected_element = {};
var eraser_hidden_element = {};
var change_history = [];
var history_offset = 0;
var moving = false;
var move_start_x = 0;
var move_start_y = 0;
var move_end_x = 0;
var move_end_y = 0;
var move_offset_x = 0;
var move_offset_y = 0;
var tole = Math.min(Math.log(pen_width_base) / Math.log(Math.pow(10, 0.88)), 0.7);
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
