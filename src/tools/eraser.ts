import { log_changes } from '../fabric/history.ts';
import { canvas, ctx, scale, registration } from '../fabric/index.ts';
import { tools_variables, setToolMode } from './index.ts';

export function handleTouchStart_eraser(event) {
  tools_variables.eraser_selected_element = {};
}

export function handleTouchMove_eraser(event) {
  var touch = event.touches[0];
  var current = {
    x: touch.clientX - tools_variables.offsetX - tools_variables.move_offset_x,
    y: touch.clientY - tools_variables.offsetY - tools_variables.move_offset_y
  };

  function searchGroup(x, y) {
    var filterd_a = [];
    var result = {};
    for (var r in registration) {
      var g = registration[r];
      if (!g) {
        continue;
      }
      if (g.hidden === true) {
        continue;
      }
      if (g.x1 - 5 - tools_variables.eraser_d <= x && x <= g.x2 + 5 + tools_variables.eraser_d && g.y1 - 5 - tools_variables.eraser_d <= y && y <= g.y2 + 5 + tools_variables.eraser_d) {
        filterd_a.push(g);
      }
    }
    var filterd_a_len = filterd_a.length;
    for (var i = 0; i < filterd_a_len; i++) {
      var w = filterd_a[i];
      var z = w.points.sort(function (a, b) {
        return Math.sqrt(Math.pow(a.x - x, 2) + Math.pow(a.y - y, 2)) - Math.sqrt(Math.pow(b.x - x, 2) + Math.pow(b.y - y, 2));
      });
      if (Math.sqrt(Math.pow(z[0].x - x, 2) + Math.pow(z[0].y - y, 2)) < 10 + tools_variables.eraser_d) {
        result[w.id] = true;
        continue;
      }
    }
    return result;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 1.2 * scale;
  ctx.strokeStyle = tools_variables.eraser_color;

  ctx.beginPath();
  ctx.arc((current.x + tools_variables.offsetX + tools_variables.move_offset_x) * scale, (current.y + tools_variables.offsetY + tools_variables.move_offset_y) * scale, (tools_variables.eraser_d + 5) * scale, 0, 2 * Math.PI);
  ctx.stroke();

  tools_variables.eraser_selected_element = Object.assign(tools_variables.eraser_selected_element, searchGroup(current.x, current.y));
  for (var k in tools_variables.eraser_selected_element) {
    document.querySelector('svg#vector_fabric g#' + k).setAttributeNS(null, 'opacity', '0.25');
  }
}

export function handleTouchEnd_eraser(event) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var hidden_element_identifier = [];
  for (var k in tools_variables.eraser_selected_element) {
    var target = document.querySelector('svg#vector_fabric g#' + k);

    document.querySelector('svg#vector_fabric g#hidden_pen').appendChild(target);
    target.removeAttributeNS(null, 'opacity');
    //target.remove()
    registration[k].hidden = true;
    hidden_element_identifier.push(k);
  }
  log_changes([], hidden_element_identifier);
}
