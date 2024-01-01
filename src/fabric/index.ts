import { segmentsToPath, simplifyPath, pathCommandToCoordinates } from '../graph/path.ts';
import { tools_variables } from '../tools/index.ts';
import { localforage, FontFaceObserver } from '../index.ts';

export let canvas = document.querySelector('#fabric');
export let ctx = canvas.getContext('2d');
export let svg_canvas = document.querySelector('#vector_fabric');
export let svg_canvas_pen_layer = document.querySelector('#vector_fabric g#pen');
export var scale = Math.log(window.devicePixelRatio) / Math.log(Math.pow(2, 0.4));
export var width = window.innerWidth;
export var height = window.innerHeight;
export var registration: object = {};

export function resizeFabric() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * scale;
  canvas.height = height * scale;
  svg_canvas.setAttributeNS(null, 'width', width + 'px');
  svg_canvas.setAttributeNS(null, 'height', height + 'px');
  svg_canvas.setAttributeNS(null, 'viewbox', `0,0,${width},${height}`);
  canvas.style.background = 'none';
}

export function updatePenPath() {
  tools_variables.currentPath.c = segmentsToPath(tools_variables.touchData_x.main, 1);
  tools_variables.currentPath.a = segmentsToPath(simplifyPath(tools_variables.touchData_x.a, tools_variables.tole).concat(tools_variables.touchData_x.a[tools_variables.touchData_x.a.length - 1]), 1);
  tools_variables.currentPath.b = segmentsToPath(simplifyPath(tools_variables.touchData_x.b, tools_variables.tole).concat(tools_variables.touchData_x.b[tools_variables.touchData_x.b.length - 1]), 1);
}

export function registerElement(coordinates, id, z_index) {
  var x = coordinates.map((e) => e.x);
  var y = coordinates.map((e) => e.y);
  registration[id] = {
    x1: Math.min(...x),
    y1: Math.min(...y),
    x2: Math.max(...x),
    y2: Math.max(...y),
    points: coordinates,
    id: id,
    hidden: false,
    z_index: z_index
  };
  return registration[id];
}

export function getRegistrationQuantity() {
  var quantity = 0;
  for (var o in registration) {
    if (registration.hasOwnProperty(o)) {
      quantity += 1;
    }
  }
  return quantity;
}

export function saveContent() {
  localforage
    .setItem('fabric', String(document.querySelector('svg#vector_fabric g#pen').innerHTML))
    .then(function () {})
    .catch(function (err) {
      // we got an error
    });
}

export function loadContent() {
  localforage
    .getItem('fabric')
    .then(function (value) {
      document.querySelector('svg#vector_fabric g#pen').innerHTML = value;
      var elements = document.querySelectorAll('svg#vector_fabric g#pen g');
      var elements_length = elements.length;
      for (var i = 0; i < elements_length; i++) {
        var e = elements[i];
        var coordinates = [];
        for (var child of e.children) {
          if (child.tagName.toLowerCase() === 'path') {
            coordinates = coordinates.concat(pathCommandToCoordinates(child.getAttribute('d'), 2));
          }
          if (child.tagName.toLowerCase() === 'circle') {
            coordinates = coordinates.concat([{ x: child.getAttribute('cx'), y: child.getAttribute('cy') }]);
          }
        }
        registerElement(coordinates, e.getAttribute('id'), parseInt(e.getAttribute('z-index')));
      }
    })
    .catch(function (err) {
      // we got an error
    });
}

export var lazyCSS = {
  loaded: {
    googleFontsNotoSans: false,
    googleFontsMaterialSymbols: false
  }
};

export function loadCSS(url: string, identity: string) {
  if (!lazyCSS.loaded[identity]) {
    var link = document.createElement('link');
    link.setAttribute('href', url);
    link.setAttribute('rel', 'stylesheet');
    document.head.appendChild(link);
    lazyCSS.loaded[identity] = true;
  }
}

export function loadFont(url: string, fontName: string, identity: string, loadedCallback: Function) {
  loadCSS(url, identity);
  if (typeof loadedCallback === 'function') {
    var font = new FontFaceObserver(fontName);
    font.load().then(function () {
      loadedCallback();
    });
  }
}
