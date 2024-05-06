import { Point2D } from './types.ts';

export const drawLine = (ctx: CanvasRenderingContext2D, point1: any, point2: any) => {
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
};

export const drawPoint = (ctx: CanvasRenderingContext2D, point: Point2D) => {
  // const radius = 20;
  ctx.fillRect(point.x, point.y, 1, 1);
  // ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'blue';
  ctx.fill();
};

export const drawCurveByPoints = (
  ctx: CanvasRenderingContext2D,
  pixelsOfCurve: { x: number; y: number }[],
  scale: number = 1,
  move = { x: 0, y: 0 },
) => {
  if (!pixelsOfCurve.length) {
    return;
  }
  ctx.beginPath();
  let p = {
    x: pixelsOfCurve[0].x * scale + move.x,
    y: pixelsOfCurve[0].y * scale + move.y,
  };
  for (let i = 1; i < pixelsOfCurve.length; i++) {
    const p2 = {
      x: pixelsOfCurve[i].x * scale + move.x,
      y: pixelsOfCurve[i].y * scale + move.y,
    };
    drawLine(ctx, p, p2);
    p = p2;
  }
  ctx.stroke();
};

// export const drawGen = (ctx: CanvasRenderingContext2D, gen: any) => {
//   drawCurveByPoints(ctx, gen, 1);
// };

export const drawPolygon = (ctx: CanvasRenderingContext2D, points: number[][], color: string) => {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.stroke();
};

export const drawPolygonLine = (ctx: CanvasRenderingContext2D, p0: number[], p1: number[], color: string) => {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(p0[0], p0[1]);
  ctx.lineTo(p1[0], p1[1]);
  ctx.stroke();
};
