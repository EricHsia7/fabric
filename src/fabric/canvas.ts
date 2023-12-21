export function drawPath(ctx, pathData, color) {
  const path = new Path2D(pathData);
  ctx.lineCap = 'round';
  ctx.lineWidth = pen_width_base * scale;
  ctx.strokeStyle = color; // Red color
  ctx.stroke(path); // Use fill() for filling the path instead of stroke()
  ctx.closePath();
}