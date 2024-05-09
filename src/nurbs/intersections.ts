import { drawCurveByPoints } from '../draw/draw-curve.ts';
import { NURBSCurve } from './NURBSCurve.ts';

type Point = {
  x: number;
  y: number;
};

export type IntersectionData = {
  width: number;
  height: number;
  intersectionPoints: Point[];
  selfIntersections: {
    [name: string]: {
      detectedPointsCount: number;
      intersectionPoints: Point[];
      selfIntersectionsDetectionTime: number;
      selfIntersectionCurveDrawingTime: number;
    };
  };
  times: {
    drawAllCurveTime: number;
    intersectionsDetectionTime: number;
  };
};

const curves: { [name: string]: NURBSCurve } = {};

export const setCurve = (name: string, curve: NURBSCurve) => {
  curves[name] = curve;
};

const detectWidthAndHeight = () => {
  const points = Object.values(curves)
    .filter((curve) => !!curve)
    .map((curve) => curve.controlPoints)
    .flat();
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i];
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
  }
  const width = maxX - minX;
  const height = maxY - minY;

  return { width, height };
};

const findMeans = (points: Point[], maxDistance: number) => {
  const clusters: { mean: Point; points: Point[] }[] = [];

  const addPoint = (point: Point) => {
    if (clusters.length === 0) {
      clusters.push({
        mean: point,
        points: [point],
      });
      return;
    }
    let isAdded = false;
    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      cluster.points.forEach((p) => {
        if (isAdded) {
          return;
        }
        if (Math.abs(p.x - point.x) < maxDistance && Math.abs(p.y - point.y) < maxDistance) {
          cluster.points.push(point);
          isAdded = true;
        }
      });
      if (isAdded) {
        break;
      }
    }
    if (!isAdded) {
      clusters.push({
        mean: point,
        points: [point],
      });
    }
  };

  clusters.forEach((cluster) => {
    let x = 0;
    let y = 0;
    cluster.points.forEach((point) => {
      x += point.x;
      y += point.y;
    });
    cluster.mean = {
      x: x / cluster.points.length,
      y: y / cluster.points.length,
    };
  });

  for (let i = 0; i < points.length; i++) {
    addPoint(points[i]);
  }

  return clusters.map((cluster) => cluster.mean);
};

export const detectPoints = (ctx: OffscreenCanvasRenderingContext2D, width: number, height: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const points: Point[] = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      // const red = imageData.data[i];
      // const green = imageData.data[i + 1];
      // const blue = imageData.data[i + 2];
      const alpha = imageData.data[i + 3];
      if (alpha > 256 / 2) {
        points.push({ x, y });
      }
    }
  }

  return {
    pointCounts: points.length,
    clusteredPoints: findMeans(points, 4),
  };
};

export const detectIntersections = () => {
  const { width, height } = detectWidthAndHeight();
  const offscreen = new OffscreenCanvas(width, height);
  const ctx = offscreen.getContext('2d')!;

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;

  let t;

  t = performance.now();
  Object.values(curves).forEach((curve) => {
    if (!curve) return;
    drawCurveByPoints(ctx, curve.pointsForDrawing, 1);
  });
  const drawAllCurveTime = performance.now() - t;

  t = performance.now();
  const intersectionPoints = detectPoints(ctx, width, height);
  const intersectionsDetectionTime = performance.now() - t;

  // detect self intersections
  const selfIntersections: IntersectionData['selfIntersections'] = {};

  Object.entries(curves).forEach(([name, curve]) => {
    if (!curve) return;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.clearRect(0, 0, width, height);

    t = performance.now();
    drawCurveByPoints(ctx, curve.pointsForDrawing, 1, { x: 0, y: 0 }, true);
    const selfIntersectionCurveDrawingTime = performance.now() - t;

    t = performance.now();
    const selfIntersectionPoints = detectPoints(ctx, width, height);
    const selfIntersectionsDetectionTime = performance.now() - t;

    selfIntersections[name] = {
      detectedPointsCount: selfIntersectionPoints.pointCounts,
      intersectionPoints: selfIntersectionPoints.clusteredPoints,
      selfIntersectionsDetectionTime,
      selfIntersectionCurveDrawingTime,
    };
  });

  return {
    width,
    height,
    detectedPointsCount: intersectionPoints.pointCounts,
    intersectionPoints: intersectionPoints.clusteredPoints,
    selfIntersections,
    times: {
      drawAllCurveTime,
      intersectionsDetectionTime,
    },
  };
};
