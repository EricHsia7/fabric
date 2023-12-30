import { tools_variables } from './index.ts';
import { svg_canvas_pen_layer } from '../fabric/index.ts';
export function handleTouchStart_mover(event) {
  var touch = event.touches[0];
  var current = {
    x: touch.clientX - tools_variables.offsetX,
    y: touch.clientY - tools_variables.offsetY
  };
  tools_variables.move_start_x = current.x;
  tools_variables.move_start_y = current.y;
}

export function handleTouchMove_mover(event) {
  var touch = event.touches[0];
  var current = {
    x: touch.clientX - tools_variables.offsetX,
    y: touch.clientY - tools_variables.offsetY
  };
  tools_variables.move_end_x = current.x;
  tools_variables.move_end_y = current.y;
  svg_canvas_pen_layer.setAttribute('transform', `translate($tools_variables.move_offset_x +tools_variables.move_end_x -tools_variables.move_start_x} $tools_variables.move_offset_y +tools_variables.move_end_y -tools_variables.move_start_y})`);
}

export function handleTouchEnd_mover(event) {
  tools_variables.move_offset_x = tools_variables.move_offset_x + tools_variables.move_end_x - tools_variables.move_start_x;
  tools_variables.move_offset_y = tools_variables.move_offset_y + tools_variables.move_end_y - tools_variables.move_start_y;
  svg_canvas_pen_layer.setAttribute('transform', `translate($tools_variables.move_offset_x} $tools_variables.move_offset_y})`);
}
