var { v4: uuidv4 } = require('uuid');
import { svg_canvas_pen_layer } from './index.ts';
import { pen_width_base } from '../tools/index.ts';

export function newGroupOnSVG() {
  var p = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  var id = 'g-' + uuidv4();
  p.setAttributeNS(null, 'id', id);
  //p.setAttributeNS(null, 'opacity', '0.5');
  svg_canvas_pen_layer.appendChild(p);
  return id;
}

export function drawPathOnSVG(pathData, color, container) {
  var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttributeNS(null, 'd', pathData);
  p.setAttributeNS(null, 'stroke-width', pen_width_base);
  p.setAttributeNS(null, 'stroke', color);
  p.setAttributeNS(null, 'fill', 'none');
  p.setAttributeNS(null, 'stroke-linecap', 'round');
  p.setAttributeNS(null, 'fill-rule', 'nonzero');
  p.setAttributeNS(null, 'id', uuidv4());
  container = document.querySelector('#' + container) || svg_canvas_pen_layer;
  container.appendChild(p);
}

export function drawCircleOnSVG(x, y, r, color, container) {
  var p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  p.setAttributeNS(null, 'cx', x);
  p.setAttributeNS(null, 'cy', y);
  p.setAttributeNS(null, 'r', r);
  p.setAttributeNS(null, 'stroke', 'none');
  p.setAttributeNS(null, 'fill', color);
  p.setAttributeNS(null, 'stroke-linecap', 'round');
  p.setAttributeNS(null, 'fill-rule', 'nonzero');
  p.setAttributeNS(null, 'id', uuidv4());
  container = document.querySelector('#' + container) || svg_canvas_pen_layer;
  container.appendChild(p);
}
