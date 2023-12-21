function handleTouchStart_moving(event) {
  disableScroll();
  const touch = event.touches[0];
  var current = {
    x: touch.clientX - offsetX,
    y: touch.clientY - offsetY
  };
  move_start_x = current.x;
  move_start_y = current.y;
}

function handleTouchMove_moving(event) {
  const touch = event.touches[0];
  var current = {
    x: touch.clientX - offsetX,
    y: touch.clientY - offsetY
  };
  move_end_x = current.x;
  move_end_y = current.y;
  svg_canvas_pen_layer.setAttribute('transform', `translate(${move_offset_x + move_end_x - move_start_x} ${move_offset_y + move_end_y - move_start_y})`);
}

function handleTouchEnd_moving(event) {
  enableScroll();
  move_offset_x += move_end_x - move_start_x;
  move_offset_y += move_end_y - move_start_y;
  svg_canvas_pen_layer.setAttribute('transform', `translate(${move_offset_x} ${move_offset_y})`);
}