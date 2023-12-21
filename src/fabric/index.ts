
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

function updatePenPath() {
  drawPath(ctx, segmentsToPath(touchData, scale), pen_color);
  drawPath(ctx, segmentsToPath(simplifyPath(touchData_a, tole), scale), pen_color);
  drawPath(ctx, segmentsToPath(simplifyPath(touchData_b, tole), scale), pen_color);

  currentPath.c = segmentsToPath(touchData, 1);
  currentPath.a = segmentsToPath(simplifyPath(touchData_a, tole).concat(touchData_a[touchData_a.length - 1]), 1);
  currentPath.b = segmentsToPath(simplifyPath(touchData_b, tole).concat(touchData_b[touchData_b.length - 1]), 1);
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

function saveContent() {
  localforage
    .setItem('fabric', String(document.querySelector('svg#vector_fabric g#pen').innerHTML))
    .then(function () {})
    .catch(function (err) {
      // we got an error
    });
}

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