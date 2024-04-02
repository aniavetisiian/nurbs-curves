// import curve01 from "/curves/curve_01.png";
import { nurbsCurve } from './NURBSCurve';
import { detectDistance, detectPointsOnCanvas } from './detectDistance.ts';
import { drawCurveByPoints, drawGen, drawNURBSCurve , drawPolygon, drawPolygonLine} from './drawFunctions';
// import { NURBSCurve } from "./NURBSCurve";
// import { scaleImage } from "./imageUtils.ts";
import { cloneGen, mutate } from './mutation.ts';
import {QuadraticBezierCurve} from "./QuadraticBezierCurve.ts";
import curve02 from '/curves/curve_02.png';
import {CubicBezierCurve} from "./CubicBezierCurve.ts";
import {Curve, animateCurve} from "./curve.ts";
// const imageCache: { [key: string]: HTMLImageElement } = {};
const pixelsOfCurve: { x: number; y: number }[] = [];

type Point = {
  x: number;
  y: number;
};

export type Points = Point[];

let gen: Points = [
  { x: 0, y: 0 },
  { x: 10, y: 100 },
  { x: 20, y: 0 },
  { x: 30, y: 100 },
  { x: 40, y: 0 },
  { x: 50, y: 100 },
  { x: 60, y: 0 },
  { x: 70, y: 100 },
  { x: 80, y: 0 },
  { x: 90, y: 100 },
];

function animateQuadraticBezier(ctx: CanvasRenderingContext2D, quadraticBezier: QuadraticBezierCurve) {
  let t = 0;
  const animationSpeed = 0.01;

  function animate() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const points: number[][] = [];
    for (let i = 0; i <= t; i += animationSpeed) {
      const point = quadraticBezier.evaluate(i);
      points.push(point);
    }

    drawPolygon(ctx, [quadraticBezier.p0], 'red');
    drawPolygon(ctx, [quadraticBezier.p1], 'red');
    drawPolygon(ctx, [quadraticBezier.p2], 'red');
    drawPolygonLine(ctx, quadraticBezier.p0, quadraticBezier.p1, 'gray');
    drawPolygonLine(ctx, quadraticBezier.p1, quadraticBezier.p2, 'gray');

    if (points.length > 1) {
      drawPolygon(ctx, points, 'blue');
    }
    t += animationSpeed;
    if (t <= 1) {
      requestAnimationFrame(animate);
    }
  }
  animate();
}

function animateCubicBezier(ctx: CanvasRenderingContext2D, cubicBezier: CubicBezierCurve) {
  let t = 0;
  const animationSpeed = 0.01;

  function animate() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const points: number[][] = [];
    for (let i = 0; i <= t; i += animationSpeed) {
      const point = cubicBezier.evaluate(i);
      points.push(point);
    }

    // Draw control points
    drawPolygon(ctx, [cubicBezier.p0], 'red');
    drawPolygon(ctx, [cubicBezier.p1], 'red');
    drawPolygon(ctx, [cubicBezier.p2], 'red');
    drawPolygon(ctx, [cubicBezier.p3], 'red');

    // Draw linear interpolation lines
    drawPolygonLine(ctx, cubicBezier.p0, cubicBezier.p1, 'gray');
    drawPolygonLine(ctx, cubicBezier.p1, cubicBezier.p2, 'gray');
    drawPolygonLine(ctx, cubicBezier.p2, cubicBezier.p3, 'gray');

    if (points.length > 1) {
      drawPolygon(ctx, points, 'blue');
    }

    t += animationSpeed;
    if (t <= 1) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}


const detectBlackPixels = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): {
  x: number;
  y: number;
}[] => {
  const points: { x: number; y: number }[] = [];
  for (let x = 0; x < width; x++) {
    points.push(...detectPointsOnCanvas(ctx, x, height));
  }
  return points;
};

function loadImageAsCurve(url: string) {
  const img = new Image();
  img.src = url;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    // window.document.body.appendChild(canvas);
    // const {width, height} = scaleImage(img, 200, 200);
    const width = img.width;
    const height = img.height;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, width, height);
    const curveCoordinates = detectBlackPixels(ctx, img.width, img.height);
    pixelsOfCurve.push(...curveCoordinates);
  };
}

export function setup() {
  const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  // ctx.imageSmoothingEnabled = false;

  const p0 = [50, 100];
  const p1 = [100, 50];
  const p2 = [200, 150];
  const p3 = [250, 100];
  const controlPoints = [
    [50, 100],
    [100, 50],
    [200, 150],
    [250, 100],
    [300, 50]
  ];
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);
  let distancePrev = Number.MAX_SAFE_INTEGER;
  let fast = 10;

  const drawCanvas = () => {
    requestAnimationFrame(drawCanvas);
    ctx.clearRect(0, 0, width, height);

    // fill white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    const mGen = cloneGen(gen);
    mutate(mGen, fast);

    drawGen(ctx, mGen);

    const distance = detectDistance(ctx, pixelsOfCurve);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText(`Distance: ${Math.floor(distance)} : ${fast}`, width - 320, height - 40);

    if (distance < distancePrev) {
      distancePrev = distance;
      if (distance > 1_0) {
        fast = 1;
      }
      if (distance > 5_0) {
        fast = 3;
      }
      if (distance > 10_0) {
        fast = 5;
      }
      if (distance > 100_0) {
        fast = 8;
      }
      if (distance > 500_0) {
        fast = 10;
      }
      gen = mGen;
    }

    //Curve for 3 control points
    const quadraticBezier = new QuadraticBezierCurve(p0, p1, p3);
    animateQuadraticBezier(ctx, quadraticBezier);

    //Curve for 4 control points
    const cubicBezier = new CubicBezierCurve(p0, p1, p2, p3);
    animateCubicBezier(ctx, cubicBezier);

    //Curve for n control points
    const curve = new Curve(controlPoints);
    animateCurve(ctx, curve);

    drawCurveByPoints(ctx, pixelsOfCurve, 1);
    drawNURBSCurve(ctx, nurbsCurve);
  };
  drawCanvas();
  loadImageAsCurve(curve02);
}

