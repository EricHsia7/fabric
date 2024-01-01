import { JSDOM } from '../index.ts';
import { width, height, registration, getFabricBoundary } from './index.ts';
import { listFabricColors, colorToHex } from '../tools/color.ts';

export async function getSVGString(color_scheme: string) {
  const color_hex_regex = /(#[A-Fa-f0-9]{6,6}|#[A-Fa-f0-9]{3,3})/gm;
  const color_id_regex = /var\(\-\-(fc\-default\-[a-z]{1,}\-[a-z]{1,}|fc\-[a-f0-9]{8,8}\-[a-f0-9]{4,4}\-[a-f0-9]{4,4}\-[a-f0-9]{4,4}\-[a-f0-9]{12,12})\)/gm;

  var boundary = getFabricBoundary();
  var exportWidth = Math.abs(boundary.x2 - boundary.x1);
  var exportHeight = Math.abs(boundary.y2 - boundary.y1);

  var color_list_obj = {};
  var color_list = await listFabricColors();
  color_list.forEach((element) => {
    color_list_obj[element.id] = element;
  });

  const dom = new JSDOM(`
  <!DOCTYPE html>
  <meta charset="UTF-8" />
  <svg id="vector_fabric" viewbox="${boundary.x1},${boundary.y1},${boundary.x2},${boundary.y2}">
  ${String(document.querySelector('svg#vector_fabric g#pen').innerHTML)}
  </svg>
  `);
  var path = dom.window.document.querySelectorAll('svg#vector_fabric path');
  path.forEach((element) => {
    var tagName = String(element.tagName).toLowerCase();
    if (tagName === 'path') {
      var stroke = String(element.getAttribute('stroke'));
      if (!(stroke.match(color_hex_regex) === null)) {
        continue;
      }
      if (!(stroke.match(color_id_regex) === null)) {
        var m = color_id_regex.exec(stroke);
        var this_color_id = m[2];
        element.setAttribute('stroke', colorToHex(color_list_obj[this_color_id])[color_scheme].hex);
        element.removeAttribute('id');
        element.removeAttribute('z-index');
      }
    }
    if (tagName === 'circle') {
    }
  });
  return String(dom.window.document.querySelector('svg#vector_fabric').innerHTML);
}
