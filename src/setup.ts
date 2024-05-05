// import curve01 from "/curves/curve_01.png";
// import { CubicBezierCurve, animateCubicBezier } from './CurveIntro/CubicBezierCurve.ts';
// import { QuadraticBezierCurve, animateQuadraticBezier } from './CurveIntro/QuadraticBezierCurve.ts';
// import { Curve, animateCurve } from './CurveIntro/curve.ts';
// import { NURBSCurve } from "./NURBSCurve";
// import { scaleImage } from "./imageUtils.ts";
// import { cloneGen, mutate } from './mutation.ts';
// import curve02 from '/curves/curve_02.png';
import { nurbsCurve, nurbsCurve2 } from './NURBSCurve';
import { detectClosestColorToBlack, detectPointsOnCanvas } from './detectFunctions.ts';
import { drawNURBSCurve } from './drawFunctions';
import { findParameterForPoint, findPrevAndNext } from "./evaluateNURBS.ts";



type Point = {
  x: number;
  y: number;
};

// export let closestPoint: any;
// console.log(closestPoint);
export type Points = Point[];


// const imageCache: { [key: string]: HTMLImageElement } = {};
// const pixelsOfCurve: { x: number; y: number }[] = [];

// let gen: Points = [
//   { x: 0, y: 0 },
//   { x: 10, y: 100 },
//   { x: 20, y: 0 },
//   { x: 30, y: 100 },
//   { x: 40, y: 0 },
//   { x: 50, y: 100 },
//   { x: 60, y: 0 },
//   { x: 70, y: 100 },
//   { x: 80, y: 0 },
//   { x: 90, y: 100 },
// ];

const detectBlackPixels = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const points: { x: number; y: number }[] = [];
  const intersectionPoints: { x: number; y: number; color: number[] }[] = [];

  for (let x = 0; x < width; x++) {
    const { points: pts, intersectionPoints: interPts } = detectPointsOnCanvas(ctx, x, height);
    points.push(...pts);
    intersectionPoints.push(...interPts);
  }
  return { points, intersectionPoints };
};

// function loadImageAsCurve(url: string) {
//   const img = new Image();
//   img.src = url;
//   img.onload = () => {
//     const canvas = document.createElement('canvas');
//     // window.document.body.appendChild(canvas);
//     // const {width, height} = scaleImage(img, 200, 200);
//     const width = img.width;
//     const height = img.height;
//     canvas.width = width;
//     canvas.height = height;
//     const ctx = canvas.getContext('2d')!;
//     ctx.drawImage(img, 0, 0, width, height);
//     const { points: curveCoordinates } = detectBlackPixels(ctx, img.width, img.height);
//     pixelsOfCurve.push(...curveCoordinates);
//   };
// }

export function setup() {
  const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  // ctx.imageSmoothingEnabled = false;

  // const p0 = [50, 100];
  // const p1 = [100, 50];
  // const p2 = [200, 150];
  // const p3 = [250, 100];
  //
  // const controlPoints = [
  //   [50, 100],
  //   [100, 50],
  //   [200, 150],
  //   [250, 100],
  //   [300, 50],
  // ];
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);
  // let distancePrev = Number.MAX_SAFE_INTEGER;
  // let fast = 10;

  const drawCanvas = () => {
    requestAnimationFrame(drawCanvas);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);


    // const mGen = cloneGen(gen);
    // mutate(mGen, fast);
    //
    // drawGen(ctx, mGen);
    //
    // const distance = detectDistance(ctx, pixelsOfCurve);
    // ctx.fillStyle = 'black';
    // ctx.font = '30px Arial';
    // ctx.fillText(`Distance: ${Math.floor(distance)} : ${fast}`, width - 320, height - 40);
    //
    // if (distance < distancePrev) {
    //   distancePrev = distance;
    //   if (distance > 1_0) {
    //     fast = 1;
    //   }
    //   if (distance > 5_0) {
    //     fast = 3;
    //   }
    //   if (distance > 10_0) {
    //     fast = 5;
    //   }
    //   if (distance > 100_0) {
    //     fast = 8;
    //   }
    //   if (distance > 500_0) {
    //     fast = 10;
    //   }
    //   gen = mGen;
    // }

    // //Curve for 3 control points
    // const quadraticBezier = new QuadraticBezierCurve(p0, p1, p3);
    // animateQuadraticBezier(ctx, quadraticBezier);

    // //Curve for 4 control points
    // const cubicBezier = new CubicBezierCurve(p0, p1, p2, p3);
    //animateCubicBezier(ctx, cubicBezier);

    // //Curve for n control points
    // const curve = new Curve(controlPoints);
    // animateCurve(ctx, curve);

    // drawCurveByPoints(ctx, pixelsOfCurve, 1);
    drawNURBSCurve(ctx, nurbsCurve);
    drawNURBSCurve(ctx, nurbsCurve2);
  };
  drawCanvas();

  // loadImageAsCurve(curve02);

  (window as any)._dd = () => {
    const { intersectionPoints} = detectBlackPixels(ctx, width, height);
    const approxIntersectionPoint = detectClosestColorToBlack(intersectionPoints);

    const tForCurve1 = findParameterForPoint(nurbsCurve, approxIntersectionPoint);
    console.log('t for curve1 = ', tForCurve1);
    if (tForCurve1 !== null) {
      const PrevAndNext = findPrevAndNext(tForCurve1);
      console.log(PrevAndNext, 'PrevAndNext of tForCurve1');
    }

    const tForCurve2 = findParameterForPoint(nurbsCurve2, approxIntersectionPoint);
    console.log('t for curve2 = ', tForCurve2);
    if (tForCurve2 !== null) {
      const PrevAndNext = findPrevAndNext(tForCurve2);
      console.log(PrevAndNext, 'PrevAndNext of tForCurve2');
    }
    return approxIntersectionPoint;
  };
}
