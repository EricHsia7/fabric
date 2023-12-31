import { listFabricColors, colorToHex } from './color.ts';
import { uuidv4 } from '../index.ts';

function fc_animation(index, time, delay, m, selector, initial, quantity, index_offset, nth) {
  if (m === 0) {
    var fc_opacity = 0;
    var fc_scale = 0.66;
    var fc_direction = 'normal';
  }
  if (m === 1) {
    var fc_opacity = 1;
    var fc_scale = 1;
    var fc_direction = 'reverse';
  }
  return `.tools_container .${selector} button${nth ? `:nth-child(${quantity - index + 1 + index_offset})` : ''}{transform:scale(${fc_scale});opacity:${fc_opacity};animation-duration: ${time}ms;animation-name: scale;animation-timing-function: ease-out;animation-fill-mode: forwards;animation-delay: ${initial + (index - 1) * delay}ms;animation-direction: ${fc_direction};}`;
}

function fc_s1(m, selector) {
  if (m === 1) {
    var fc_opacity = 0;
    var fc_scale = 0.66;
  }
  if (m === 0) {
    var fc_opacity = 1;
    var fc_scale = 1;
  }
  return `.tools_container .${selector} button {transform:scale(${fc_scale});opacity: ${fc_opacity};}`;
}

function fc_getHTML(colorObj) {
  var hex = colorToHex(colorObj);
  return `<button id="pl-${uuidv4()}" color-id="${colorObj.id}" onclick="setPenColor('${colorObj.id}')"><div class="fabric_color"><div class="fabric_color_c"><div class="fabric_color_light" style="--fc-color:${hex.light.hex}"></div><div class="fabric_color_dark" style="--fc-color:${hex.dark.hex}"></div></div></div></button>`;
}

async function loadColorPlate() {
  try {
    var list = await listFabricColors();
    var html = [];
    list.forEach(function (item) {
      html.push(fc_getHTML(item));
    });
    document.querySelector('.fabric_color_plate').innerHTML = html.join('');
    return '';
  } catch (e) {
    return e;
  }
}

export function openColorPlate() {
  loadColorPlate().then(function () {
    var fcp = document.querySelector('.fabric_color_plate');
    fcp.style.display = 'block';
    var fcpc = document.querySelector('.fabric_color_plate_close');
    fcpc.style.display = 'grid';
    const quantity = 6;
    const time = 180;
    const delay = 45;
    const index_offset = Math.floor(document.querySelector('.fabric_color_plate').scrollLeft / 50) || 0;
    var css = [];
    for (var i = quantity; i > 0; i--) {
      css.push(fc_animation(i, time, delay, 1, 'tools_button', 0, quantity, 0, true));
      css.push(fc_animation(i, time, delay, 0, 'fabric_color_plate', (delay * quantity + time) / 2, quantity, index_offset, true));
    }
    css.push(fc_animation(6, time, delay, 0, 'fabric_color_plate_close', 0, quantity, 0, false));
    document.querySelector('#fabric-color-plate-animation').innerHTML = css.join('');
    document.querySelectorAll('.fabric_color_plate button')[index_offset].addEventListener(
      'animationend',
      function () {
        document.querySelector('#fabric-color-plate-animation').innerHTML = fc_s1(1, 'tools_button') + fc_s1(0, 'fabric_color_plate') /* + fc_s1(0, 'fabric_color_plate_close')*/;
      },
      { once: true }
    );
  });
}

export function closeColorPlate() {
  const quantity = 6;
  const time = 180;
  const delay = 45;
  const index_offset = Math.floor(document.querySelector('.fabric_color_plate').scrollLeft / 50) || 0;

  var css = [];
  for (var i = quantity; i > 0; i--) {
    css.push(fc_animation(i, time, delay, 0, 'tools_button', (delay * quantity + time) / 2, quantity, 0, true));
    css.push(fc_animation(i, time, delay, 1, 'fabric_color_plate', 0, quantity, index_offset, true));
  }
  css.push(fc_animation(6, time, delay, 1, 'fabric_color_plate_close', 0, quantity, 0, false));
  document.querySelector('#fabric-color-plate-animation').innerHTML = css.join('');
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
