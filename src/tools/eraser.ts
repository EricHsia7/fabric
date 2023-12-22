import { registration, log_changes } from '../fabric/history.ts';
import { ctx } from '../fabric/index.ts';
import { disableScroll, enableScroll } from '../scroll/index.ts';
import { mode, mover, move_start_x, move_start_y, move_end_x, move_end_y, move_offset_x, move_offset_y, offsetX, offsetY, touchData, touchData_a, touchData_b, start_timestamp, touch_point_identifier, pen_width_base, force_weight, speed_weight, pen_color, tole, currentPath, eraser_selected_element, eraser_hidden_element, eraser_d, eraser_color, setToolMode } from './index.ts';

export function handleTouchStart_eraser(event) {
  disableScroll();
  eraser_selected_element = {};
}

export function handleTouchMove_eraser(event) {
  const touch = event.touches[0];
  var current = {
    x: touch.clientX - offsetX - move_offset_x,
    y: touch.clientY - offsetY - move_offset_y
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
      if (g.x1 - 5 - eraser_d <= x && x <= g.x2 + 5 + eraser_d && g.y1 - 5 - eraser_d <= y && y <= g.y2 + 5 + eraser_d) {
        filterd_a.push(g);
      }
    }
    var filterd_a_len = filterd_a.length;
    for (var i = 0; i < filterd_a_len; i++) {
      var w = filterd_a[i];
      var z = w.points.sort(function (a, b) {
        return Math.sqrt(Math.pow(a.x - x, 2) + Math.pow(a.y - y, 2)) - Math.sqrt(Math.pow(b.x - x, 2) + Math.pow(b.y - y, 2));
      });
      if (Math.sqrt(Math.pow(z[0].x - x, 2) + Math.pow(z[0].y - y, 2)) < 10 + eraser_d) {
        result[w.id] = true;
        continue;
      }
    }
    return result;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 1.2 * scale;
  ctx.strokeStyle = eraser_color;

  ctx.beginPath();
  ctx.arc((current.x + offsetX + move_offset_x) * scale, (current.y + offsetY + move_offset_y) * scale, (eraser_d + 5) * scale, 0, 2 * Math.PI);
  ctx.stroke();

  eraser_selected_element = Object.assign(eraser_selected_element, searchGroup(current.x, current.y));
  for (var k in eraser_selected_element) {
    document.querySelector('svg#vector_fabric g#' + k).setAttributeNS(null, 'opacity', '0.25');
  }
}

export function handleTouchEnd_eraser(event) {
  enableScroll();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var hidden_element_identifier = [];
  for (var k in eraser_selected_element) {
    var target = document.querySelector('svg#vector_fabric g#' + k);

    document.querySelector('svg#vector_fabric g#hidden_pen').appendChild(target);
    target.removeAttributeNS(null, 'opacity');
    //target.remove()
    registration[k].hidden = true;
    hidden_element_identifier.push(k);
  }
  log_changes([], hidden_element_identifier);
}
