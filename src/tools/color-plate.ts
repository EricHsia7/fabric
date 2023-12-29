import { listFabricColors, colorToHex } from './color.ts';
var { v4: uuidv4 } = require('uuid');

export function fc_animation(index, time, delay, m, selector, initial, quantity, df) {
  if (m === 0) {
    var opacity = 0;
    var scale = 0.66;
    var direction = 'normal';
  }
  if (m === 1) {
    var opacity = 1;
    var scale = 1;
    var direction = 'reverse';
  }
  return `.tools_container .${selector} button:nth-child(${quantity - index + 1}){transform:scale(${scale});opacity:${opacity};animation-duration: ${time}ms;animation-name: scale;animation-timing-function: ease-out;animation-fill-mode: forwards;animation-delay: ${initial + (index - 1) * delay}ms;animation-direction: ${direction};}`;
}

export function fc_s1(index, m, selector, quantity, df) {
  if (m === 1) {
    var opacity = 0;
    var scale = 0.66;
    var direction = 'normal';
  }
  if (m === 0) {
    var opacity = 1;
    var scale = 1;
    var direction = 'reverse';
  }
  return `.tools_container .${selector} button:nth-child(${quantity - index + 1}){transform:scale(${scale});opacity: ${opacity};}`;
}

export function loadColorPlate() {
  function getHTML(colorObj) {
    var hex = colorToHex(colorObj);
    return `<button id="${colorObj.id}"><div class="fabric_color"><div class="fabric_color_c"><div class="fabric_color_light" style="--fc-color:${hex.light.hex}"></div><div class="fabric_color_dark" style="--fc-color:${hex.dark.hex}"></div></div></div></button>`;
  }
  var html = [];
  for (var i = 0; i < 7; i++) {
    html.push(getHTML({ id: 'skeleton-screen-' + uuidv4(), light: { type: 'rgb', r: 242, g: 242, b: 242 }, dark: { type: 'rgb', r: 46, g: 46, b: 46 } }));
  }
  document.querySelector('.fabric_color_plate').innerHTML = html.join('');
  /*
  listFabricColors().then(function (list) {
    html = [];
    list.forEach(function (item) {
      html.push(getHTML(item));
    });
    document.querySelector('.fabric_color_plate').innerHTML = html.join('');
  });
  */
}

export function openColorPlate() {
  var quantity = 6;
  var time = 180;
  var delay = 45;

  loadColorPlate();

  var css = [];
  for (var i = quantity; i > 0; i--) {
    css.push(fc_animation(i, time, delay, 1, 'tools_button', 0, quantity, ''));
  }
  document.querySelector('#fabric-color-plate-animation').innerHTML = css.join('');

  var fcp = document.querySelector('.fabric_color_plate');
  fcp.style.display = 'block';

  css = [];
  for (var i = quantity; i > 0; i--) {
    css.push(fc_animation(i, time, delay, 0, 'fabric_color_plate', (delay * quantity + time) / 2, quantity));
  }
  document.querySelector('#fabric-color-plate-animation').innerHTML += css.join('');
  css = [];
  for (var i = quantity; i > 0; i--) {
    css.push(fc_animation(i, time, delay, 0, 'fabric_color_plate_close', 0, quantity, ''));
  }
  document.querySelector('#fabric-color-plate-animation').innerHTML += css.join('');
  var fcpc = document.querySelector('.fabric_color_plate_close');
  fcpc.style.display = 'grid';

  document.querySelectorAll('.fabric_color_plate button')[0].addEventListener(
    'animationend',
    function () {
      css = [];
      for (var i = quantity; i > 0; i--) {
        css.push(fc_s1(i, 1, 'tools_button', quantity, ''));
      }
      document.querySelector('#fabric-color-plate-animation').innerHTML = css.join('');

      css = [];
      for (var i = quantity; i > 0; i--) {
        css.push(fc_s1(i, 0, 'fabric_color_plate', quantity, '.fabric_color'));
      }
      document.querySelector('#fabric-color-plate-animation').innerHTML += css.join('');
    },
    { once: true }
  );
}

export function closeColorPlate() {
  var quantity = 6;
  var time = 180;
  var delay = 45;

  var css = [];
  for (var i = quantity; i > 0; i--) {
    css.push(fc_animation(i, time, delay, 0, 'tools_button', (delay * quantity + time) / 2, quantity, ''));
  }
  document.querySelector('#fabric-color-plate-animation').innerHTML = css.join('');
  css = [];
  for (var i = quantity; i > 0; i--) {
    css.push(fc_animation(i, time, delay, 1, 'fabric_color_plate', 0, quantity, '.fabric_color'));
  }
  document.querySelector('#fabric-color-plate-animation').innerHTML += css.join('');
  document.querySelector('#fabric-color-plate-animation').innerHTML += fc_animation(1, time, delay, 1, 'fabric_color_plate_close', 0, 1, '');
  document.querySelectorAll('.tools_button button')[0].addEventListener(
    'animationend',
    function () {
      var fcp = document.querySelector('.fabric_color_plate');
      fcp.style.display = 'none';
      var fcpc = document.querySelector('.fabric_color_plate_close');
      fcpc.style.display = 'none';
      document.querySelector('#fabric-color-plate-animation').innerHTML = '';
    },
    { once: true }
  );
}
