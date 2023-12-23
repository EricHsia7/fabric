import { pen_color } from './index.ts';

var { v4: uuidv4 } = require('uuid');
export var fabric_color_list = {};
var localforage = require('localforage');

export class FabricColor {
  constructor(r, g, b) {
    if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
      r = Math.max(Math.min(255, Math.floor(r)), 0);
      g = Math.max(Math.min(255, Math.floor(g)), 0);
      b = Math.max(Math.min(255, Math.floor(b)), 0);
      this.light = { type: 'rgb', r: r, g: g, b: b };
      this.dark = { type: 'rgb', r: r, g: g, b: b };
      this.id = uuidv4();
      this.time = new Date().getTime();
      this.type = 'FabricColor';
    }
  }
  toHEX() {
    function componentToHex(c) {
      var hex = c.toString(16);
      return String(hex.length == 1 ? '0' + hex : hex).toUpperCase();
    }
    function rgbToHex(r, g, b) {
      return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    var color_scheme = 'light';
    var mf = function () {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
    color_scheme = mf();
    return {
      type: 'hex',
      light: { type: 'hex', hex: rgbToHex(this.light.r, this.light.g, this.light.b) },
      dark: { type: 'hex', hex: rgbToHex(this.dark.r, this.dark.g, this.dark.b) },
      current: { type: 'hex', hex: rgbToHex(this[color_scheme].r, this[color_scheme].g, this[color_scheme].b) },
      color_scheme: mf,
      id: this.id
    };
  }
  toCSS() {
    var hex = this.toHEX();
    return {
      type: 'css',
      light: { declaration: `--fc-${this.id}: ${hex.light.hex};` },
      dark: { declaration: `--fc-${this.id}: ${hex.dark.hex};` },
      application: `var(--fc-${this.id})`,
      id: this.id
    };
  }
  save(lf) {
    var key = `fc-${this.id}`;
    var obj = {
      type: this.type,
      id: this.id,
      light: this.light,
      dark: this.dark,
      time: this.time
    };
    if (lf) {
      localforage.setItem(key, JSON.stringify(obj));
    }
    obj.obj = this;
    obj.toHEX = this.toHEX();
    obj.toCSS = this.toCSS();
    fabric_color_list[key] = obj;
  }
  setColor(r1, g1, b1, r2, g2, b2) {
    this.light = { type: 'rgb', r: r1, g: g1, b: b1 };
    this.dark = { type: 'rgb', r: r2, g: g2, b: b2 };
  }
  setID(id) {
    this.id = id;
  }
  setTime(time) {
    this.time = time;
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

export function loadFabricColors() {
  localforage
    .keys()
    .then(function (keys) {
      keys = keys.filter((k) => (String(k).indexOf('fc-') > -1 ? true : false));
      keys.forEach((element) => {
        localforage.getItem(element).then(function (value) {
          var obj = JSON.parse(String(value));
          var fc = new FabricColor(0, 0, 0);
          fc.setColor(obj.light.r, obj.light.g, obj.light.b, obj.dark.r, obj.dark.g, obj.dark.b);
          fc.setID(obj.id);
          fc.setTime(obj.time);
          fc.save(false);
        });
      });
    })
    .catch(function (err) {});
}

export function listFabricColors(): [] {
  var list = [];
  for (var g in fabric_color_list) {
    list.push(fabric_color_list[g]);
  }
  list.sort(function (a, b) {
    return a.time - b.time;
  });
  return list;
}

export function setPenColor(id) {
  pen_color = fabric_color_list[`fc-${id}`];
}

export function updateFabricColorStyleTag() {
  var list = listFabricColors();
  var light = [];
  var dark = [];
  list.forEach((g) => {
    light.push(g.obj.toCSS().light.declaration);
    dark.push(g.obj.toCSS().dark.declaration);
  });
  document.querySelector('head style#fabric_color').innerHTML = `:root {${light.join('')}}@media (prefers-color-scheme: dark) {${dark.join('')}}`;
}
