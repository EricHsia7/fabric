import { disableScroll, enableScroll } from '../scroll/index.ts';
import { getCoordinateOnCircleBorder } from '../graph/coordinate.ts';
import { pathCommandToCoordinates } from '../graph/path.ts';
import { newGroupOnSVG, drawPathOnSVG } from '../fabric/svg.ts';
import { log_changes } from '../fabric/history.ts';
import { registerElement, updatePenPath } from '../fabric/index.ts';
import { mode, mover, move_start_x, move_start_y, move_end_x, move_end_y, move_offset_x, move_offset_y, offsetX, offsetY, touchData, touchData_a, touchData_b, start_timestamp, tocuh_point_identity, pen_width_base, force_weight, speed_weight, pen_color, tole, currentPath, eraser_selected_element, eraser_hidden_element, eraser_d, eraser_color, setToolMode } from './index.ts';

export function handleTouchStart_pen(event) {
  disableScroll();

  const touch = event.touches[0];
  touchData = []; // Clear previous touch data
  touchData_a = [];
  touchData_b = [];
  touch_point_identity = touch.identifier;

  if (touch.force) {
    force_weight = 0.5;
    speed_weight = -0.2;
  } else {
    force_weight = 0.1;
    speed_weight = 0.2;
  }
  //ctx.clearRect(0, 0, window.innerWidth * scale, window.innerHeight * scale);

  touchData.push({
    x: touch.clientX - offsetX,
    y: touch.clientY - offsetY,
    force: touch.force || 0, // Get force (if available, otherwise default to 0)
    time_stamp: new Date().getTime(),
    angle: 0
    // Get timestamp
  });

  touchData_a.push({
    x: touch.clientX - offsetX,
    y: touch.clientY - offsetY
  });
  touchData_b.push({
    x: touch.clientX - offsetX,
    y: touch.clientY - offsetY
  });
  var current = touchData[touchData.length - 1];
  ctx.beginPath();

  // Draw a circle
  ctx.arc(current.x * scale, current.y * scale, pen_width_base * 0.5 * scale, 0, 2 * Math.PI);
  ctx.fillStyle = pen_color;
  // Fill the circle with color
  ctx.fill();
  // Finish drawing
  ctx.closePath();
}

//export function to handle touch move event
export function handleTouchMove_pen(event) {
  var touches = [];
  for (var t in event.touches) {
    if (event.touches.hasOwnProperty(t) && typeof event.touches[t] === 'object') {
      touches.push(event.touches[t]);
    }
  }

  const touch = touches.filter((p) => p.identifier === touch_point_identity)[0];
  if (touch) {
    var current = touchData[touchData.length - 1] || {
      x: touch.clientX - offsetX,
      y: touch.clientY - offsetY,
      force: touch.force || 0, // Get force (if available, otherwise default to 0)
      time_stamp: new Date().getTime(),
      angle: 0
    };
    var prev = touchData[touchData.length - 2] || current;
    var x1 = prev.x;
    var y1 = prev.y;
    var x2 = current.x;
    var y2 = current.y;
    var angleRadians;
    if (x2 - x1 === 0) {
      // Handle vertical line (x-coordinates are the same)
      if (y2 > y1) {
        angleRadians = Math.PI / 2; // 90 degrees or π/2 radians
      } else if (y2 < y1) {
        angleRadians = -Math.PI / 2;
        //angleRadians = Math.PI*(3/2);
        // -90 degrees or -π/2 radians
      } else {
        angleRadians = 0; // Points are the same (angle is 0 radians)
      }
    } else {
      // Non-vertical line
      angleRadians = Math.atan2(y2 - y1, x2 - x1);
    }

    touchData.push({
      x: touch.clientX - offsetX,
      y: touch.clientY - offsetY,
      force: touch.force || 0, // Get force (if available, otherwise default to 0)
      time_stamp: new Date().getTime(),
      angle: angleRadians
    });

    var speed = Math.sqrt(Math.pow(current.x - prev.x, 2) + Math.pow(current.y - prev.y, 2)) / (current.time_stamp - prev.time_stamp);
    var radius = Math.min(Math.max(pen_width_base * Math.pow(current.force, 0.4) * (force_weight / (force_weight + speed_weight)) * 0.5 + pen_width_base * Math.max(0.3, Math.log(speed) / Math.log(1.8)) * (speed_weight / (force_weight + speed_weight)) * 0.5, 0), pen_width_base * 0.7) || 0;
    var c1 = getCoordinateOnCircleBorder(touch.clientX - offsetX, touch.clientY - offsetY, radius, angleRadians - Math.PI / 2);
    var c2 = getCoordinateOnCircleBorder(touch.clientX - offsetX, touch.clientY - offsetY, radius, angleRadians + Math.PI / 2);

    touchData_a.push({
      x: c1.x,
      y: c1.y
    });
    touchData_b.push({
      x: c2.x,
      y: c2.y
    });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePenPath();
  }
}

//export function to handle touch end event
export function handleTouchEnd_pen(event) {
  enableScroll();
  var touches = [];
  for (var t in event.changedTouches) {
    if (event.changedTouches.hasOwnProperty(t) && typeof event.changedTouches[t] === 'object') {
      touches.push(event.changedTouches[t]);
    }
  }

  const touch = touches.filter((p) => p.identifier === touch_point_identity)[0];
  if (touch) {
    if (touchData.length >= 2) {
      var prev = touchData[touchData.length - 1];
      touchData.push({
        x: touch.clientX - offsetX,
        y: touch.clientY - offsetY,
        force: touch.force || 0, // Get force (if available, otherwise default to 0)
        time_stamp: new Date().getTime(),
        angle: touchData[touchData.length - 1].angle
      });

      touchData_a.push({
        x: touch.clientX - offsetX,
        y: touch.clientY - offsetY
      });
      touchData_b.push({
        x: touch.clientX - offsetX,
        y: touch.clientY - offsetY
      });

      touchData = touchData.map((g) => Object.assign(g, { x: g.x - move_offset_x, y: g.y - move_offset_y }));

      touchData_a = touchData_a.map((g) => Object.assign(g, { x: g.x - move_offset_x, y: g.y - move_offset_y }));

      touchData_b = touchData_b.map((g) => Object.assign(g, { x: g.x - move_offset_x, y: g.y - move_offset_y }));

      /*
    touchData_a.push({
      x: prev.x,
      y: prev.y
    });
    touchData_b.push({
      x: prev.x,
      y: prev.y
    });
    */
    }
    updatePenPath();
    var group = newGroupOnSVG();

    drawPathOnSVG(currentPath.a, pen_color, group);
    drawPathOnSVG(currentPath.b, pen_color, group);
    drawPathOnSVG(currentPath.c, pen_color, group);

    var ca = pathCommandToCoordinates(currentPath.a, 3);
    var cb = pathCommandToCoordinates(currentPath.b, 3);
    var cc = pathCommandToCoordinates(currentPath.c, 3);

    registerElement(ca.concat(cb).concat(cc), group);
    log_changes([group], []);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
