import { NURBSCurve } from '../nurbs/NURBSCurve.ts';
import { getCanvasContext } from './canvas-context.ts';

type Point = {
  x: number;
  y: number;
};

export const drawLine = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  point1: Point,
  point2: Point,
) => {
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
};

export const drawCurveByPoints = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  points: { x: number; y: number }[],
  scale: number = 1,
  move = { x: 0, y: 0 },
  byPart = false,
) => {
  if (!points.length) {
    return;
  }
  !byPart && ctx.beginPath();
  let p = {
    x: points[0].x * scale + move.x,
    y: points[0].y * scale + move.y,
  };
  for (let i = 1; i < points.length; i++) {
    const p2 = {
      x: points[i].x * scale + move.x,
      y: points[i].y * scale + move.y,
    };
    byPart && ctx.beginPath();
    drawLine(ctx, p, p2);
    byPart && ctx.stroke();
    p = p2;
  }
  !byPart && ctx.stroke();
};

export const drawCurve = (curve: NURBSCurve, color: string = '#FFD000') => {
  if (!curve.pointsForDrawing.length) {
    return;
  }

  const ctx = getCanvasContext();

  ctx.setLineDash([]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  drawCurveByPoints(ctx, curve.pointsForDrawing, 1);
};
