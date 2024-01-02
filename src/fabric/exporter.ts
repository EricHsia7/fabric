import { JSDOM } from '../index.ts';
import { width, height, registration, getFabricBoundary } from './index.ts';
import { listFabricColors, colorToHex } from '../tools/color.ts';

export async function getSVGString(color_scheme: string) {
  try {
    const color_hex_regex = /(#[A-Fa-f0-9]{6,6}|#[A-Fa-f0-9]{3,3})/gm;
    const color_id_regex = /var\(\-\-(fc\-[a-f0-9]{8,8}\-[a-f0-9]{4,4}\-[a-f0-9]{4,4}\-[a-f0-9]{4,4}\-[a-f0-9]{12,12}|fc\-default\-[a-z\-]{1,})\)/gm;

    var boundary = getFabricBoundary();
    var exportWidth = Math.abs(boundary.x2 - boundary.x1) + 100;
    var exportHeight = Math.abs(boundary.y2 - boundary.y1) + 100;

    var color_list_obj = {};
    var color_list = await listFabricColors();
    color_list.forEach((element) => {
      color_list_obj[element.id || 'u'] = element;
    });

    var string = String(document.querySelector('svg#vector_fabric g#pen').innerHTML);
    string = string.replaceAll(color_id_regex, function (match) {
      var this_color_id = String(match).substring(6, String(match).length - 1);
      console.log(this_color_id);
      return colorToHex(color_list_obj[this_color_id])[color_scheme].hex;
    });
var background_color = "#FFFFFF"
if(color_scheme === "dark"){
background_color = "#111111"
}

    return `<svg xmlns="http://www.w3.org/2000/svg" viewbox="${boundary.x1 - 50},${boundary.y1 - 50},${boundary.x2 + 50},${boundary.y2 + 50}" width="${exportWidth}" height="${exportHeight}"><rect width="${exportWidth}" height="${exportHeight}" fill="${background_color}"/>${string}</svg>`;
  } catch (e) {
    return e;
  }
}

function downloadBlob(blob: Blob, name) {
  const file = new File([blob], name, { type: blob.type });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({
      files: [file]
    });
  } else {
    var u = window.URL || window.webkitURL;
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.download = `${name}`;
    a.href = u.createObjectURL(blob);
    a.click();
    a.remove();
  }
}

export async function saveAsSvg(color_scheme: string) {
  /*
  var serializer = new XMLSerializer();
  var svgString = serializer.serializeToString(document.querySelector('svg#canvas'));
  */
  try {
    var svgString = await getSVGString(color_scheme);
    var blob = new Blob([svgString], { type: 'image/svg+xml' });
    downloadBlob(blob, 'fabric.svg');
    return 'successful';
  } catch (e) {
    return e;
  }
}
