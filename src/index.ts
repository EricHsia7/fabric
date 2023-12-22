import { change_history, history_offset, registration, log_changes, replayHistory } from './fabric/history.ts';
import { canvas, ctx, svg_canvas, svg_canvas_pen_layer, scale, width, height } from './fabric/index.ts';
import { drawPath } from './fabric/canvas.ts';
import { newGroupOnSVG, drawPathOnSVG } from './fabric/svg.ts';

import { getCoordinateOnCircleBorder } from './graph/coordinate.ts';
import { segmentsToPath, distanceToSegment, simplifyPath, pathCommandToCoordinates } from './graph/path.ts';

import { moving, move_start_x, move_start_y, move_end_x, move_end_y, move_offset_x, move_offset_y, offsetX, offsetY, touchData, touchData_a, touchData_b, start_timestamp, tocuh_point_identity, pen_width_base, force_weight, speed_weight, pen_color, tole, currentPath, eraser_selected_element, eraser_hidden_element, eraser_d } from './tools/index.ts';

window.fabric_initialize = function () {
  canvas.addEventListener(
    'touchstart',
    function (event) {
      if (mode === 0) {
        handleTouchStart_pen(event);
      }
      if (mode === 1) {
        handleTouchStart_eraser(event);
      }
      if (mode === 2) {
        moving = true;
        handleTouchStart_moving(event);
      }
    },
    false
  );

  canvas.addEventListener(
    'touchmove',
    function (event) {
      if (mode === 0) {
        handleTouchMove_pen(event);
      }
      if (mode === 1) {
        handleTouchMove_eraser(event);
      }
      if (mode === 2 && moving) {
        handleTouchMove_moving(event);
      }
    },
    false
  );

  canvas.addEventListener(
    'touchend',
    function (event) {
      if (mode === 0) {
        handleTouchEnd_pen(event);
      }
      if (mode === 1) {
        handleTouchEnd_eraser(event);
      }
      if (mode === 2 && moving) {
        handleTouchEnd_moving(event);
        moving = false;
      }
      //console.log(String(document.querySelector('svg#vector_fabric g#pen').innerHTML).length * 2/1024 + 'kb')
      saveContent();
    },
    false
  );

  window.addEventListener('resize', function () {
    resizeFabric();
  });

  ripple.addTo('.tools_container button', '#fff', 370);
  resizeFabric();
  loadContent();
};

export default window.fabric_initialize;
