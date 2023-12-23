import { segmentsToPath, simplifyPath, pathCommandToCoordinates } from '../graph/path.ts';
import { drawPath } from './canvas.ts';
import { touchData, touchData_a, touchData_b, pen_color, tole } from '../tools/index.ts';
import { currentPath } from '../tools/index.ts';
var localforage = require('localforage');

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
  drawPath(ctx, segmentsToPath(touchData, scale), pen_color);
  drawPath(ctx, segmentsToPath(simplifyPath(touchData_a, tole), scale), pen_color);
  drawPath(ctx, segmentsToPath(simplifyPath(touchData_b, tole), scale), pen_color);

  currentPath.c = segmentsToPath(touchData, 1);
  currentPath.a = segmentsToPath(simplifyPath(touchData_a, tole).concat(touchData_a[touchData_a.length - 1]), 1);
  currentPath.b = segmentsToPath(simplifyPath(touchData_b, tole).concat(touchData_b[touchData_b.length - 1]), 1);
}

export function registerElement(coordinates, id) {
  var x = coordinates.map((e) => e.x);
  var y = coordinates.map((e) => e.y);
  registration[id] = {
    x1: Math.min(...x),
    y1: Math.min(...y),
    x2: Math.max(...x),
    y2: Math.max(...y),
    points: coordinates,
    id: id,
    hidden: false
  };
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
          coordinates = coordinates.concat(pathCommandToCoordinates(child.getAttribute('d'), 2));
        }
        registerElement(coordinates, e.getAttribute('id'));
      }
    })
    .catch(function (err) {
      // we got an error
    });
}
