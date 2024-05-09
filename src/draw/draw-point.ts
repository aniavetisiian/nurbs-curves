import { getCanvasContext } from './canvas-context.ts';

export const drawXPoint = (x: number, y: number, color: string = '#7D3333') => {
  const ctx = getCanvasContext();

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.moveTo(x - 5, y - 5);
  ctx.lineTo(x + 5, y + 5);
  ctx.moveTo(x + 5, y - 5);
  ctx.lineTo(x - 5, y + 5);

  ctx.stroke();
};

export const drawOPoint = (x: number, y: number, color: string = '#7D3333') => {
  const ctx = getCanvasContext();

  // draw a circle
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
};

export const drawControlLinesBetweenPoints = (points: { x: number; y: number }[]) => {
  if (!points.length) {
    return;
  }
  const ctx = getCanvasContext();

  ctx.setLineDash([3, 5]);
  ctx.strokeStyle = '#808080';
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  points.slice(1).forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });

  ctx.stroke();
};

export const drawControlPoints = (points: { x: number; y: number }[]) => {
  points.forEach((point) => {
    drawXPoint(point.x, point.y);
  });

  drawControlLinesBetweenPoints(points);
};
