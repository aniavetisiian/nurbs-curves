import {drawPolygon} from "./drawFunctions.ts";
export class Curve {
    controlPoints: number[][];

    constructor(controlPoints: number[][]) {
        this.controlPoints = controlPoints;
    }

    evaluate(t: number): number[] {
        const points = this.controlPoints.map(p => [...p]); // Clone control points
        const n = points.length;
        for (let k = 1; k < n; k++) {
            for (let i = 0; i < n - k; i++) {
                for (let j = 0; j < points[i].length; j++) {
                    points[i][j] = (1 - t) * points[i][j] + t * points[i + 1][j];
                }
            }
        }
        return points[0];
    }
}


export function animateCurve(ctx: CanvasRenderingContext2D, bezierCurve: Curve) {
    let t = 0;
    const animationSpeed = 0.01;

    function animate() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const points: number[][] = [];
        for (let i = 0; i <= t; i += animationSpeed) {
            const point = bezierCurve.evaluate(i);
            points.push(point);
        }
        bezierCurve.controlPoints.forEach(point => {
            drawPolygon(ctx, [point], 'red');
        });

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
