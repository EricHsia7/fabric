import { scale } from './index.ts';
import { tools_variables } from '../tools/index.ts';

export function drawPath(ctx, pathData, color) {
  var path = new Path2D(pathData);
  ctx.lineCap = 'round';
  ctx.lineWidth = tools_variables.pen_width_base * scale;
  ctx.strokeStyle = color; // Red color
  ctx.stroke(path); // Use fill() for filling the path instead of stroke()
  ctx.closePath();
}
