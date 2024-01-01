import { JSDOM } from '../index.ts';
import { width, height, registration, getFabricBoundary } from './index.ts';
import { listFabricColors, colorToHex } from '../tools/color.ts';

export async function getSVGString(color_scheme: string) {
  try {
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

    var string = String(document.querySelector('svg#vector_fabric g#pen').innerHTML);
    string = string.replaceAll(color_id_regex, function (match) {
      var m = color_id_regex.exec(match);
      var this_color_id = m[2];
      return colorToHex(color_list_obj[this_color_id])[color_scheme].hex;
    });
    return string;
  } catch (e) {
    return e;
  }
}
