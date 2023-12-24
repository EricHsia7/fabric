import { pen_color_id } from './index.ts';

var { v4: uuidv4 } = require('uuid');
var localforage = require('localforage');

export function setFabricColor(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, time: number, id: string) {
  function c(n) {
    return Math.max(Math.min(255, Math.floor(n)), 0);
  }
  if (typeof r1 === 'number' && typeof g1 === 'number' && typeof b1 === 'number' && typeof r2 === 'number' && typeof g2 === 'number' && typeof b2 === 'number') {
    r1 = c(r1);
    g1 = c(g1);
    b1 = c(b1);
    r2 = c(r2);
    g2 = c(g2);
    b2 = c(b2);
    id = id || 'fc-' + uuidv4();
    var time = time || new Date().getTime();
    var colorObj = {
      id: id,
      light: { type: 'rgb', r: r1, g: g1, b: b1 },
      dark: { type: 'rgb', r: r2, g: g2, b: b2 },
      time: time,
      type: 'FabricColor'
    };
    localforage.setItem(id, JSON.stringify(colorObj));
    return colorObj;
  }
}

export function deleteFabricColor(id: string) {
  localforage.removeItem(id);
}

export function initializeFabricColors() {
  setFabricColor(0, 0, 0, 255, 255, 255, 0, 'fc-default-black-white');
}

export async function listFabricColors(): Promise<any[]> {
  try {
    var keys = await localforage.keys();
    var list: any[] = [];
    keys = keys.filter((k) => String(k).indexOf('fc-') > -1);
    for (const key of keys) {
      var value = await localforage.getItem(key);
      list.push(JSON.parse(String(value)));
    }
    list.sort((a, b) => a.time - b.time);
    return list;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export function setPenColor(id) {
  pen_color_id = `fc-${id}`;
}

export function updateFabricColorStyleTag() {
  var list = listFabricColors();
  var light = [];
  var dark = [];
  list.forEach((color) => {
    light.push(colorToCSS(color, 'light'));
    dark.push(colorToCSS(color, 'dark'));
  });
  document.querySelector('head style#fabric_color').innerHTML = `:root {${light.join('')}}@media (prefers-color-scheme: dark) {${dark.join('')}}`;
}

export function colorToHex(color: any): string {
  function componentToHex(c: number): string {
    var hex = c.toString(16);
    return String(hex.length == 1 ? '0' + hex : hex).toUpperCase();
  }
  return {
    light: { type: 'hex', hex: `#${componentToHex(color.light.r)}${componentToHex(color.light.g)}${componentToHex(color.light.b)}` },
    dark: { type: 'hex', hex: `#${componentToHex(color.dark.r)}${componentToHex(color.dark.g)}${componentToHex(color.dark.b)}` }
  };
}

export function colorToCSS(color: any): string {
  var hex = colorToHex(color);
  return {
    declaration: {
      light: `--${color.id}: ${hex.light.hex};`,
      dark: `--${color.id}: ${hex.dark.hex};`
    },
    application: `var(--${color.id})`
  };
}

export function openColorPlate() {
  listFabricColors().then(function (list) {
    var html = [];
    list.forEach((colorObj) => {
      var hex = colorToHex(colorObj);
      html.push(`<div class="fabric_color"><div class="fabric_color_light" style="--plate-color:${hex.light.hex}"></div><div class="fabric_color_dark" style="--plate-color:${hex.dark.hex}"></div></div>`);
    });
  });
}
