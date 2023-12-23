import { pen_color_id } from './index.ts';

var { v4: uuidv4 } = require('uuid');
export var fabric_color_list: Record<string, any> = {};
var localforage = require('localforage');

export function createFabricColor(r: number, g: number, b: number) {
  if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
    r = Math.max(Math.min(255, Math.floor(r)), 0);
    g = Math.max(Math.min(255, Math.floor(g)), 0);
    b = Math.max(Math.min(255, Math.floor(b)), 0);
    var id = 'fc-' + uuidv4();
    var time = new Date().getTime();
    var colorObj = {
      id: id,
      light: { type: 'rgb', r: r, g: g, b: b },
      dark: { type: 'rgb', r: r, g: g, b: b },
      time: time,
      type: 'FabricColor'
    };
    fabric_color_list[id] = colorObj;
    return id;
  }
}

export function updateFabricColor(id: string, r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
  if (fabric_color_list[id]) {
    fabric_color_list[id].light = { type: 'rgb', r: r1, g: g1, b: b1 };
    fabric_color_list[id].dark = { type: 'rgb', r: r2, g: g2, b: b2 };
  }
}

export function deleteFabricColor(id: string) {
  if (fabric_color_list[id]) {
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

export function setFabricColorTime(id: string, time: number) {
  if (fabric_color_list[id]) {
    fabric_color_list[id].time = time;
  }
}

export function loadFabricColors() {
  localforage
    .keys()
    .then(function (keys) {
      keys = keys.filter((k) => (String(k).indexOf('fc-') > -1 ? true : false));
      keys.forEach((element) => {
        localforage.getItem(element).then(function (value) {
          var obj = JSON.parse(String(value));
          fabric_color_list[obj.id] = obj;
        });
      });
    })
    .catch(function (err) {});
}

export function listFabricColors(): any[] {
  var list = [];
  for (var key in fabric_color_list) {
    list.push(fabric_color_list[key]);
  }
  list.sort(function (a, b) {
    return a.time - b.time;
  });
  return list;
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
