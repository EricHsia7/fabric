export function getCoordinateOnCircleBorder(centerX, centerY, radius, radian) {
  var xe = 1;
  var ye = 1;
  var x = parseFloat((centerX + Math.cos(radian) * radius).toFixed(10));
  var y = parseFloat((centerY + Math.sin(radian) * radius).toFixed(10));
  var degree = radian * (180 / Math.PI);
  return { x, y, radian, degree, radius };
}
