import { getCoordinateOnCircleBorder } from '../graph/coordinate.ts';
import { segmentsToPath, simplifyPath, pathCommandToCoordinates } from '../graph/path.ts';
import { newGroupOnSVG, drawPathOnSVG, drawCircleOnSVG } from '../fabric/svg.ts';
import { log_changes } from '../fabric/history.ts';
import { registerElement, updatePenPath, canvas, ctx, scale } from '../fabric/index.ts';
import { tools_variables, setToolMode, getColorScheme } from './index.ts';
import { drawPath } from '../fabric/canvas.ts';
import { colorToHex, colorToCSS } from './color.ts';

export function handleTouchStart_pen(event) {
  var colorObj = tools_variables.fabric_colors_cache.filter((j) => (j.id === tools_variables.pen_color_id ? true : false))[0]
  tools_variables.pen_color = colorToHex(colorObj)[getColorScheme()].hex;
  var touch = event.touches[0];
  tools_variables.touchData_x.main = [];
  tools_variables.touchData_x.a = [];
  tools_variables.touchData_x.b = [];
  tools_variables.touch_point_identifier = touch.identifier * 1;

  if (touch.force) {
    tools_variables.force_weight = 0.5;
    tools_variables.speed_weight = -0.2;
  } else {
    tools_variables.force_weight = 0.1;
    tools_variables.speed_weight = 0.2;
  }
  //ctx.clearRect(0, 0, window.innerWidth * scale, window.innerHeight * scale);

  tools_variables.touchData_x.main.push({
    x: touch.clientX - tools_variables.offsetX,
    y: touch.clientY - tools_variables.offsetY,
    force: touch.force || 0, // Get force (if available, otherwise default to 0)
    time_stamp: new Date().getTime(),
    angle: 0
    // Get timestamp
  });

  tools_variables.touchData_x.a.push({
    x: touch.clientX - tools_variables.offsetX,
    y: touch.clientY - tools_variables.offsetY
  });
  tools_variables.touchData_x.b.push({
    x: touch.clientX - tools_variables.offsetX,
    y: touch.clientY - tools_variables.offsetY
  });
  var current = tools_variables.touchData_x.main[tools_variables.touchData_x.main.length - 1];
  ctx.beginPath();

  // Draw a circle
  ctx.arc(current.x * scale, current.y * scale, tools_variables.pen_width_base * 0.5 * scale, 0, 2 * Math.PI);
  ctx.fillStyle = tools_variables.pen_color;
  ctx.fill();
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

  var touch = touches.filter((p) => p.identifier === tools_variables.touch_point_identifier)[0];
  if (touch) {
    var current = tools_variables.touchData_x.main[tools_variables.touchData_x.main.length - 1] || {
      x: touch.clientX - tools_variables.offsetX,
      y: touch.clientY - tools_variables.offsetY,
      force: touch.force || 0, // Get force (if available, otherwise default to 0)
      time_stamp: new Date().getTime(),
      angle: 0
    };
    var prev = tools_variables.touchData_x.main[tools_variables.touchData_x.main.length - 2] || current;
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

    tools_variables.touchData_x.main.push({
      x: touch.clientX - tools_variables.offsetX,
      y: touch.clientY - tools_variables.offsetY,
      force: touch.force || 0, // Get force (if available, otherwise default to 0)
      time_stamp: new Date().getTime(),
      angle: angleRadians
    });

    var speed = Math.sqrt(Math.pow(current.x - prev.x, 2) + Math.pow(current.y - prev.y, 2)) / (current.time_stamp - prev.time_stamp);
    var radius = Math.min(Math.max(tools_variables.pen_width_base * Math.pow(current.force, 0.4) * (tools_variables.force_weight / (tools_variables.force_weight + tools_variables.speed_weight)) * 0.5 + tools_variables.pen_width_base * Math.max(0.3, Math.log(speed) / Math.log(1.8)) * (tools_variables.speed_weight / (tools_variables.force_weight + tools_variables.speed_weight)) * 0.5, 0), tools_variables.pen_width_base * 0.7) || 0;
    var c1 = getCoordinateOnCircleBorder(touch.clientX - tools_variables.offsetX, touch.clientY - tools_variables.offsetY, radius, angleRadians - Math.PI / 2);
    var c2 = getCoordinateOnCircleBorder(touch.clientX - tools_variables.offsetX, touch.clientY - tools_variables.offsetY, radius, angleRadians + Math.PI / 2);

    tools_variables.touchData_x.a.push({
      x: c1.x,
      y: c1.y
    });
    tools_variables.touchData_x.b.push({
      x: c2.x,
      y: c2.y
    });
    if (tools_variables.touchData_x.main.length >= 2) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPath(ctx, segmentsToPath(tools_variables.touchData_x.main, scale), tools_variables.pen_color);
      drawPath(ctx, segmentsToPath(simplifyPath(tools_variables.touchData_x.a, tools_variables.tole), scale), tools_variables.pen_color);
      drawPath(ctx, segmentsToPath(simplifyPath(tools_variables.touchData_x.b, tools_variables.tole), scale), tools_variables.pen_color);
    }
    updatePenPath();
  }
}

export function handleTouchEnd_pen(event) {
  var colorObj = tools_variables.fabric_colors_cache.filter((j) => (j.id === tools_variables.pen_color_id ? true : false))[0]
  var touches = [];
  for (var t in event.changedTouches) {
    if (event.changedTouches.hasOwnProperty(t) && typeof event.changedTouches[t] === 'object') {
      touches.push(event.changedTouches[t]);
    }
  }

  var touch = touches.filter((p) => p.identifier === tools_variables.touch_point_identifier)[0];
  if (touch) {
    if (tools_variables.touchData_x.main.length >= 2) {
      var prev = tools_variables.touchData_x.main[tools_variables.touchData_x.main.length - 1];
      tools_variables.touchData_x.main.push({
        x: touch.clientX - tools_variables.offsetX,
        y: touch.clientY - tools_variables.offsetY,
        force: touch.force || 0, // Get force (if available, otherwise default to 0)
        time_stamp: new Date().getTime(),
        angle: tools_variables.touchData_x.main[tools_variables.touchData_x.main.length - 1].angle
      });

      tools_variables.touchData_x.a.push({
        x: touch.clientX - tools_variables.offsetX,
        y: touch.clientY - tools_variables.offsetY
      });

      tools_variables.touchData_x.b.push({
        x: touch.clientX - tools_variables.offsetX,
        y: touch.clientY - tools_variables.offsetY
      });

      tools_variables.touchData_x.main = tools_variables.touchData_x.main.map((g) => Object.assign(g, { x: g.x - tools_variables.move_offset_x, y: g.y - tools_variables.move_offset_y }));
      tools_variables.touchData_x.a = tools_variables.touchData_x.a.map((g) => Object.assign(g, { x: g.x - tools_variables.move_offset_x, y: g.y - tools_variables.move_offset_y }));
      tools_variables.touchData_x.b = tools_variables.touchData_x.b.map((g) => Object.assign(g, { x: g.x - tools_variables.move_offset_x, y: g.y - tools_variables.move_offset_y }));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPath(ctx, segmentsToPath(tools_variables.touchData_x.main, scale), tools_variables.pen_color);
      drawPath(ctx, segmentsToPath(simplifyPath(tools_variables.touchData_x.a, tools_variables.tole), scale), tools_variables.pen_color);
      drawPath(ctx, segmentsToPath(simplifyPath(tools_variables.touchData_x.b, tools_variables.tole), scale), tools_variables.pen_color);

      updatePenPath();
      var group = newGroupOnSVG();

      var application_css = colorToCSS(colorObj).application;
      drawPathOnSVG(tools_variables.currentPath.a, application_css, group);
      drawPathOnSVG(tools_variables.currentPath.b, application_css, group);
      drawPathOnSVG(tools_variables.currentPath.c, application_css, group);

      var ca = pathCommandToCoordinates(tools_variables.currentPath.a, 3);
      var cb = pathCommandToCoordinates(tools_variables.currentPath.b, 3);
      var cc = pathCommandToCoordinates(tools_variables.currentPath.c, 3);

      registerElement(ca.concat(cb).concat(cc), group);
      log_changes([group], []);
    } else {
      var point = tools_variables.touchData_x.main[tools_variables.touchData_x.main.length - 1];
      var group = newGroupOnSVG();
      drawCircleOnSVG(point.x, point.y, tools_variables.pen_width_base * 0.5, tools_variables.pen_color, group);
      registerElement([point], group);
      log_changes([group], []);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
