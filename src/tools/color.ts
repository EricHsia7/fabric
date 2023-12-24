import { pen_color_id } from './index.ts';

var { v4: uuidv4 } = require('uuid');
export var fabric_color_list: Record<string, any> = {};
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
  localforage.keys();
  if (fabric_color_list.hasOwnProperty(id)) {
    delete fabric_color_list[id];
  }
}

export function initializeFabricColors() {
  function constructColor(r1, g1, b1, r2, g2, b2, id, time) {
    var fc = new FabricColor(r1, g1, b1);
    fc.setColor(r1, g1, b1, r2, g2, b2);
    fc.setID(id);
    fc.setTime(time);
    fc.save(false);
  }
  constructColor(0, 0, 0, 255, 255, 255, 'default-black-white', 0);
}

export async function listFabricColors(): Promise<any[]> {
  try {
    const keys = await localforage.keys();
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
  return `#${componentToHex(color.r)}${componentToHex(color.g)}${componentToHex(color.b)}`;
}

export function colorToCSS(color: any, scheme: string): string {
  const selectedColor = color[scheme];
  const hex = colorToHex(selectedColor);
  return `--${color.id}: ${hex};`;
}
