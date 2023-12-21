var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener(
    'test',
    null,
    Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassive = true;
      }
    })
  );
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}
// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

function gid(n) {
  var genidchars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  var genid = '';
  for (var i = 0; i < 32; i++) {
    var genrandomNumber = Math.floor(Math.random() * genidchars.length);
    genid += genidchars.substring(genrandomNumber, genrandomNumber + 1);
  }
  if (!(n === undefined)) {
    n = n.replaceAll('-', '_');
    return n + '_' + genid;
  }
  return 'id_' + genid;
}

function getFn(x0, y0, x1, y1) {
  var a = x1 - x0;
  var b = y1 - y0;
  var m = b / a;
  var k = (b * x1 - a * y1) / (-1 * a);
  return function (x) {
    return x * m + k;
    //Math.min(Math.max(x * m + k, Math.min(y0, y1)), Math.max(y0, y1));
  };
}
function segmentsToPath(segments, scale) {
  if (segments.length < 1) {
    return '';
  }
  var pathCommand = `M${segments[0].x * scale},${segments[0].y * scale}`;
  for (var i = 1; i < segments.length - 1; i++) {
    var c = segments[i];
    var n = segments[i + 1] || c;

    pathCommand += `Q${c.x * scale},${c.y * scale},${(c.x * scale + n.x * scale) / 2},${(c.y * scale + n.y * scale) / 2}`;
  }
  return pathCommand;
}

function distanceToSegment(point, start, end) {
  var dx = end.x - start.x;
  var dy = end.y - start.y;
  var d = dx * dx + dy * dy;
  var t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / d;

  if (t < 0) {
    dx = point.x - start.x;
    dy = point.y - start.y;
  } else if (t > 1) {
    dx = point.x - end.x;
    dy = point.y - end.y;
  } else {
    var closestPoint = { x: start.x + t * dx, y: start.y + t * dy };
    dx = point.x - closestPoint.x;
    dy = point.y - closestPoint.y;
  }

  return Math.sqrt(dx * dx + dy * dy);
}

function simplifyPath(points, tolerance) {
  if (points.length < 3) {
    return points;
  }

  var dmax = 0;
  var index = 0;

  // Find the point with the maximum distance
  for (var i = 1; i < points.length - 1; i++) {
    var d = distanceToSegment(points[i], points[0], points[points.length - 1]);
    if (d > dmax) {
      index = i;
      dmax = d;
    }
  }

  // If max distance is greater than tolerance, split the curve
  if (dmax > tolerance) {
    var leftPoints = points.slice(0, index + 1);
    var rightPoints = points.slice(index);
    var simplifiedLeft = simplifyPath(leftPoints, tolerance);
    var simplifiedRight = simplifyPath(rightPoints, tolerance);
    return simplifiedLeft.slice(0, simplifiedLeft.length - 1).concat(simplifiedRight);
  } else {
    return [points[0], points[points.length - 1]];
  }
}

function pathCommandToCoordinates(str, precision) {
  var points = [];
  const regex = /((m|M)\s{0,1}([0-9\.\-]*)(\s|\,)([0-9\.\-]*)|(l|L)\s{0,1}([0-9\.\-]*)(\s|\,)([0-9\.\-]*)|(h|H)\s{0,1}([0-9\.\-]*)|(v|V)\s{0,1}([0-9\.\-]*)|(c|C)\s{0,1}([0-9\.\-]*)(\s|\,)([0-9\.\-]*)[\,\s]{1,2}([0-9\.\-]*)(\s|\,)([0-9\.\-]*)[\,\s]{1,2}([0-9\.\-]*)(\s|\,)([0-9\.\-]*)|(s|S)\s{0,1}([0-9\.\-]*)(\s|\,)([0-9\.\-]*)[\,\s]{1,2}([0-9\.\-]*)(\s|\,)([0-9\.\-]*)|(q|Q)\s{0,1}([0-9\.\-]*)(\s|\,)([0-9\.\-]*)[\,\s]{1,2}([0-9\.\-]*)(\s|\,)([0-9\.\-]*)|(t|T)\s{0,1}([0-9\.\-]*)(\s|\,)([0-9\.\-]*)|(Z|z))/gm;
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (match === 'M') {
        var x = parseFloat(m[groupIndex + 1]);
        var y = parseFloat(m[groupIndex + 3]);
        points.push({ x, y });
      }
      if (match === 'L') {
        var x = parseFloat(m[groupIndex + 1]);
        var y = parseFloat(m[groupIndex + 3]);
        var p = points[points.length - 1] || { x: null, y: null };
        var pX = p.x;
        var pY = p.y;
        if (pX === null || pY === null) {
          points.push({ x, y });
        } else {
          var distance = Math.sqrt(Math.pow(x - pX, 2) + Math.pow(y - pY, 2));
          for (var h = 0; h < distance / precision; h++) {
            var a = pX + (x - pX) * (h / (distance / precision));
            var b = pY + (y - pY) * (h / (distance / precision));
            points.push({ x: a, y: b });
          }
        }
      }
      if (match === 'H') {
        var x = m[groupIndex + 1];
        var y = 0;
        var p = points[points.length - 1] || { x: null, y: null };
        var pX = p.x;
        var pY = p.y;
        if (pX === null || pY === null) {
          points.push({ x, y });
        } else {
          var distance = Math.abs(x - pX);
          for (var h = 0; h < distance / precision; h++) {
            var a = pX + (x - pX) * (h / (distance / precision));
            points.push({ x: a, y: pY });
          }
        }
      }
      if (match === 'V') {
        var x = 0;
        var y = m[groupIndex + 1];
        var p = points[points.length - 1] || { x: null, y: null };
        var pX = p.x;
        var pY = p.y;
        if (pX === null || pY === null) {
          points.push({ x, y });
        } else {
          var distance = Math.abs(y - pY);
          for (var h = 0; h < distance / precision; h++) {
            var a = pY + (y - pY) * (h / (distance / precision));
            points.push({ x: pX, y: a });
          }
        }
      }
      if (match === 'C') {
        var x1 = m[groupIndex + 1];
        var y1 = m[groupIndex + 3];
        var x2 = m[groupIndex + 4];
        var y2 = m[groupIndex + 6];
        var x = m[groupIndex + 7];
        var y = m[groupIndex + 9];
        var p = points[points.length - 1] || { x: null, y: null };
        var pX = p.x;
        var pY = p.y;
        if (pX === null || pY === null) {
          points.push({ x, y });
        } else {
          var distance = Math.sqrt(Math.pow(x - pX, 2) + Math.pow(y - pY, 2));
          for (var h = 0; h < distance / precision; h++) {
            var t = Math.min(Math.max(h / (distance / precision), 0), 1);
            var a = Math.pow(1 - t, 3) * pX + 3 * Math.pow(1 - t, 2) * t * x1 + 3 * (1 - t) * Math.pow(t, 2) * x2 + Math.pow(t, 3) * x;
            var b = Math.pow(1 - t, 3) * pY + 3 * Math.pow(1 - t, 2) * t * y1 + 3 * (1 - t) * Math.pow(t, 2) * y2 + Math.pow(t, 3) * y;

            points.push({ x: a, y: b });
          }
        }
      }
      if (match === 'S') {
        var x2 = m[groupIndex + 1];
        var y2 = m[groupIndex + 3];
        var x = m[groupIndex + 4];
        var y = m[groupIndex + 6];
        var p = points[points.length - 1] || { x: null, y: null };
        var pX = p.x;
        var pY = p.y;

        if (pX === null || pY === null) {
          points.push({ x, y });
        } else {
          var distance = Math.sqrt(Math.pow(x - pX, 2) + Math.pow(y - pY, 2));
          for (var h = 0; h < distance / precision; h++) {
            var t = Math.min(Math.max(h / (distance / precision), 0), 1);
            var a = Math.pow(1 - t, 3) * pX + 3 * Math.pow(1 - t, 2) * t * (2 * pX - x2) + 3 * (1 - t) * Math.pow(t, 2) * x2 + Math.pow(t, 3) * x;
            var b = Math.pow(1 - t, 3) * pY + 3 * Math.pow(1 - t, 2) * t * (2 * pY - y2) + 3 * (1 - t) * Math.pow(t, 2) * y2 + Math.pow(t, 3) * y;
            points.push({ x: a, y: b });
          }
        }
      }
      if (match === 'Q') {
        var x1 = parseFloat(m[groupIndex + 1]);
        var y1 = parseFloat(m[groupIndex + 3]);
        var x = parseFloat(m[groupIndex + 4]);
        var y = parseFloat(m[groupIndex + 6]);
        var p = points[points.length - 1] || { x: null, y: null };
        var pX = p.x;
        var pY = p.y;
        if (pX === null || pY === null) {
          points.push({ x, y });
        } else {
          var distance = Math.sqrt(Math.pow(x - pX, 2) + Math.pow(y - pY, 2));
          for (var h = 0; h < distance / precision; h++) {
            var t = Math.min(Math.max(h / (distance / precision), 0), 1);
            var a = Math.pow(1 - t, 2) * pX + 2 * (1 - t) * t * x1 + Math.pow(t, 2) * x;
            var b = Math.pow(1 - t, 2) * pY + 2 * (1 - t) * t * y1 + Math.pow(t, 2) * y;
            points.push({ x: a, y: b });
          }
        }
      }
      if (match === 'T') {
        var x = m[groupIndex + 1];
        var y = m[groupIndex + 3];
      }
      if (!(match === undefined)) {
        // console.log(`Found match, group ${groupIndex}: ${match}`);
      }
    });
  }
  return points;
}

var canvas = document.querySelector('#fabric');
var ctx = canvas.getContext('2d');
var svg_canvas = document.querySelector('#vector_fabric');
var svg_canvas_pen_layer = document.querySelector('#vector_fabric g#pen');
var scale = Math.log(window.devicePixelRatio) / Math.log(Math.pow(2, 0.4));
var w_width = window.innerWidth;
var w_height = window.innerHeight;
var width = window.innerWidth;
var height = window.innerHeight;
var offsetX = 0;
var offsetY = 0;

var touchData = [];
var touchData_a = [];
var touchData_b = [];
var start_timestamp = 0;
var pen_width_base = 4;
var force_weight = 0;
var speed_weight = -0.7;
var pen_color = '#fff';
var currentPath = { a: '', b: '', c: '' };
var mode = 0;
var registration = {};
var eraser_selected_element = {};
var eraser_hidden_element = {};
var change_history = [];
var history_offset = 0;
var moving = false;
var move_start_x = 0;
var move_start_y = 0;
var move_end_x = 0;
var move_end_y = 0;
var move_offset_x = 0;
var move_offset_y = 0;
var tole = Math.min(Math.log(pen_width_base) / Math.log(Math.pow(10, 0.88)), 0.7);
resizeFabric();
var tocuh_point_identity = 0;
var eraser_d = 10;
var eraser_color = '#888';
// Add event listeners for touch events

function log_changes(addition, deletion) {
  if (!(addition.length === 0 && deletion.length === 0)) {
    change_history.push({
      addition: addition,
      deletion: deletion
    });
    history_offset = 0;
  }
}

function registerElement(coordinates, id) {
  var x = coordinates.map((e) => e.x);
  var y = coordinates.map((e) => e.y);
  registration[id] = {
    x1: Math.min(...x),
    y1: Math.min(...y),
    x2: Math.max(...x),
    y2: Math.max(...y),
    points: coordinates,
    id: id,
    hidden: false
  };
}

function resizeFabric() {
  w_width = window.innerWidth;
  w_height = window.innerHeight;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * scale;
  canvas.height = height * scale;
  svg_canvas.setAttributeNS(null, 'width', width + 'px');
  svg_canvas.setAttributeNS(null, 'height', height + 'px');
  svg_canvas.setAttributeNS(null, 'viewbox', `0,0,${width},${height}`);
  canvas.style.background = 'none';
}
function newGroupOnSVG() {
  var p = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  var id = 'g-' + uuid.v4();
  p.setAttributeNS(null, 'id', id);
  //p.setAttributeNS(null, 'opacity', '0.5');
  svg_canvas_pen_layer.appendChild(p);
  return id;
}
function drawPath(ctx, pathData, color) {
  const path = new Path2D(pathData);
  ctx.lineCap = 'round';
  ctx.lineWidth = pen_width_base * scale;
  ctx.strokeStyle = color; // Red color
  ctx.stroke(path); // Use fill() for filling the path instead of stroke()
  ctx.closePath();
}
function drawPathOnSVG(pathData, color, container) {
  var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttributeNS(null, 'd', pathData);
  p.setAttributeNS(null, 'stroke-width', pen_width_base);
  p.setAttributeNS(null, 'stroke', color);
  p.setAttributeNS(null, 'fill', 'none');
  p.setAttributeNS(null, 'stroke-linecap', 'round');
  p.setAttributeNS(null, 'fill-rule', 'nonzero');
  p.setAttributeNS(null, 'id', uuid.v4());
  container = document.querySelector('#' + container) || svg_canvas_pen_layer;
  container.appendChild(p);
}
function getCoordinateOnCircleBorder(centerX, centerY, radius, radian) {
  var xe = 1;
  var ye = 1;

  var x = parseFloat((centerX + Math.cos(radian) * radius).toFixed(10));
  var y = parseFloat((centerY + Math.sin(radian) * radius).toFixed(10));

  var degree = radian * (180 / Math.PI);
  return { x, y, radian, degree, radius };
}
// Function to handle touch start event

function updatePenPath() {
  drawPath(ctx, segmentsToPath(touchData, scale), pen_color);
  drawPath(ctx, segmentsToPath(simplifyPath(touchData_a, tole), scale), pen_color);
  //.concat([touchData[touchData.length-1]])
  drawPath(ctx, segmentsToPath(simplifyPath(touchData_b, tole), scale), pen_color);

  currentPath.c = segmentsToPath(touchData, 1);
  currentPath.a = segmentsToPath(simplifyPath(touchData_a, tole).concat(touchData_a[touchData_a.length - 1]), 1);
  currentPath.b = segmentsToPath(simplifyPath(touchData_b, tole).concat(touchData_b[touchData_b.length - 1]), 1);
}

function handleTouchStart_pen(event) {
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

function handleTouchMove_pen(event) {
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

function handleTouchEnd_pen(event) {
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


function handleTouchStart_eraser(event) {
  disableScroll();
  eraser_selected_element = {};
}
function handleTouchMove_eraser(event) {
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
function handleTouchEnd_eraser(event) {
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

function saveContent() {
  localforage
    .setItem('fabric', String(document.querySelector('svg#vector_fabric g#pen').innerHTML))
    .then(function () {})
    .catch(function (err) {
      // we got an error
    });
}

function setToolMode(m) {
  mode = m;
  function getSelector(m) {
    return document.querySelector(`.tools_container button[m="${m}"] span`);
  }
  for (var i = 0; i < 3; i++) {
    getSelector(i).classList.remove('filled');
  }
  getSelector(m).classList.add('filled');
}

function replayHistory(mode) {
  if (mode === 'redo') {
    history_offset += 1;
  }
  var index = change_history.length - 1 + history_offset;
  if (index > change_history.length - 1 || index < 0) {
    if (mode === 'redo') {
      history_offset -= 1;
    }
    return '';
  }
  var prev = change_history[index] || { addition: [], deletion: [] };
  var prev_addition = prev.addition;
  var prev_deletion = prev.deletion;
  var prev_addition_len = prev_addition.length;
  var prev_deletion_len = prev_deletion.length;
  var hidden_element_identifier = [];
  var displayed_element_identifier = [];
  for (var i = 0; i < prev_addition_len; i++) {
    var k = prev_addition[i];

    var target = document.querySelector('svg#vector_fabric g#' + k);
    document.querySelector('svg#vector_fabric g#hidden_pen').appendChild(target);
    target.removeAttributeNS(null, 'opacity');
    hidden_element_identifier.push(k);
    registration[k].hidden = true;
  }
  for (var i = 0; i < prev_deletion_len; i++) {
    var k = prev_deletion[i];
    var target = document.querySelector('svg#vector_fabric g#' + k);
    document.querySelector('svg#vector_fabric g#pen').appendChild(target);

    displayed_element_identifier.push(k);
    registration[k].hidden = false;
  }
  change_history.splice(index, 1, { addition: displayed_element_identifier, deletion: hidden_element_identifier });
  if (mode === 'undo') {
    history_offset -= 1;
  }
  saveContent();
}

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

function loadContent() {
  localforage
    .getItem('fabric')
    .then(function (value) {
      document.querySelector('svg#vector_fabric g#pen').innerHTML = value;
      var elements = document.querySelectorAll('svg#vector_fabric g#pen g');
      var elements_length = elements.length;
      for (var i = 0; i < elements_length; i++) {
        var e = elements[i];
        var coordinates = [];
        for (const child of e.children) {
          coordinates = coordinates.concat(pathCommandToCoordinates(child.getAttribute('d'), 2));
        }
        registerElement(coordinates, e.getAttribute('id'));
      }
    })
    .catch(function (err) {
      // we got an error
    });
}
loadContent();