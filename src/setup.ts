// import curve01 from "/curves/curve_01.png";
import curve02 from "/curves/curve_02.png";
import { drawGen, drawNURBSCurve, drawCurveByPoints } from "./drawFunctions";
// import { NURBSCurve } from "./NURBSCurve";
// import { scaleImage } from "./imageUtils.ts";
import { mutate, cloneGen, } from "./mutation.ts";
import {detectDistance, detectPointsOnCanvas} from "./detectDistance.ts";
// const imageCache: { [key: string]: HTMLImageElement } = {};
const pixelsOfCurve: { x: number, y: number }[] = [];
import {nurbsCurve} from "./NURBSCurve";

type Point = {
    x: number;
    y: number;
};

export type Points = Point[];

let gen: Points = [
    {x: 0, y: 0},
    {x: 10, y: 100},
    {x: 20, y: 0},
    {x: 30, y: 100},
    {x: 40, y: 0},
    {x: 50, y: 100},
    {x: 60, y: 0},
    {x: 70, y: 100},
    {x: 80, y: 0},
    {x: 90, y: 100},
];

const detectBlackPixels = (ctx: CanvasRenderingContext2D, width: number, height: number): {
    x: number,
    y: number
}[] => {
    const points: { x: number, y: number }[] = [];
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
    }
}

export function setup() {
    // let counter = 0
    // const setCounter = (count: number) => {
    //   counter = count
    //   element.innerHTML = `count is ${counter}`
    // }
    // element.addEventListener('click', () => setCounter(counter + 1))
    // setCounter(0)

    const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!
    // ctx.imageSmoothingEnabled = false;

    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    let distancePrev = Number.MAX_SAFE_INTEGER;
    let fast = 10;

    const drawCanvas = () => {
        requestAnimationFrame(drawCanvas);
        ctx.clearRect(0, 0, width, height);

        // fill white
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, width, height)

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


        drawCurveByPoints(ctx, pixelsOfCurve, 1);
        drawNURBSCurve(ctx, nurbsCurve);
    };
    drawCanvas();
    loadImageAsCurve(curve02);
}



// const sin = (x: number, k: number, a = 1) => {
//     return a * Math.sin(x / k) * 100
// };

// const fn1 = (x: number, t1: number, t2: number, t3: number) => {
//     return (sin(x + t1, 40, 1.2) + sin(x + t2, 20, 1.4) + sin(x + t3, 30, 1.6) / 3) + height / 4
// };

// const fn2 = (x: number, t1: number, t2: number, t3: number) => {
//     return (sin(x + t3, 30, 1.6) / 3) + (height / 4) * 3
// };

// let t1 = 0;
// let t2 = 0;
// let t3 = 0;

// const drawFn = (fn: any) => {
//     ctx.strokeStyle = 'black'
//     ctx.beginPath();
//     let p = {x: -1, y: fn(-1)};
//     for (let x = 1; x <= width; x++) {
//         let y = fn(x, t1, t2, t3);
//         drawLine(p, {x, y});
//         p = {x, y};
//     }
//     // Draw the Path
//     ctx.stroke();
// }

// const drawControlLine = () => {
//     ctx.strokeStyle = 'red';
//     ctx.beginPath();
//         drawLine({
//             x: width/2,
//             y: 0,
//         }, {
//             x: width/2,
//             y: height,
//         });
//
//     // Draw the Path
//     ctx.stroke();
// }

// function getPixelColor(x, y) {
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//
//     const index = (y * imageData.width + x) * 4;
//
//     const red = imageData.data[index];
//     const green = imageData.data[index + 1];
//     const blue = imageData.data[index + 2];
//     const alpha = imageData.data[index + 3];
//
//     return "rgba(" + red + ", " + green + ", " + blue + ", " + (alpha / 255) + ")";
// }
