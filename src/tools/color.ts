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
    return {
      light: { type: 'hex', hex: rgbToHex(this.light.r, this.light.g, this.light.b) },
      dark: { type: 'hex', hex: rgbToHex(this.dark.r, this.dark.g, this.dark.b) },
      id: this.id
    };
  }
  toCSSVariable() {
    var hex = this.toHEX();
    return {
      type: 'css',
      css: {
        light: { declaration: `--fc-${this.id}: ${hex.light.hex};`, application: `var(--fc-${this.id})` },
        dark: { declaration: `--fc-${this.id}: ${hex.dark.hex};`, application: `var(--fc-${this.id})` }
      },
      id: this.id
    };
  }
  save(lf) {
    var key = `fc-${this.id}`;
    var obj = {
      type: this.type,
      id: this.id,
      light: this.light,
      dark: this.dark
    };
    fabric_color_list[key] = obj;
    if (lf) {
      localforage.setItem(key, JSON.stringify(obj));
    }
  }
  setColor(r1, g1, b1, r2, g2, b2) {
    this.light = { type: 'rgb', r: r1, g: g1, b: b1 };
    this.dark = { type: 'rgb', r: r2, g: g2, b: b2 };
  }
  setID(id) {
    this.id = id;
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
          var fc = new FabricColor(0, 0, 0);
          fc.setColor(obj.light.r, obj.light.g, obj.light.b, obj.dark.r, obj.dark.g, obj.dark.b);
          fc.setID(obj.id);
          fc.save(false);
        });
      });
    })
    .catch(function (err) {});
}
