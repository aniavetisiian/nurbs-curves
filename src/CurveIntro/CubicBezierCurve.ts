import {drawPolygon, drawPolygonLine} from "../drawFunctions.ts";

export class CubicBezierCurve {
    p0: number[];
    p1: number[];
    p2: number[];
    p3: number[];

    constructor(p0: number[], p1: number[], p2: number[], p3: number[]) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    evaluate(t: number): number[] {
        const q0 = this.linearInterpolation(this.p0, this.p1, t);
        const q1 = this.linearInterpolation(this.p1, this.p2, t);
        const q2 = this.linearInterpolation(this.p2, this.p3, t);
        const r0 = this.linearInterpolation(q0, q1, t);
        const r1 = this.linearInterpolation(q1, q2, t);
        return this.linearInterpolation(r0, r1, t);
    }

    linearInterpolation(p0: number[], p1: number[], t: number): number[] {
        const result: number[] = [];
        for (let i = 0; i < p0.length; i++) {
            result[i] = (1 - t) * p0[i] + t * p1[i];
        }
        return result;
    }
}

export
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
        // drawPolygon(ctx, [cubicBezier.p0], 'red');
        // drawPolygon(ctx, [cubicBezier.p1], 'red');
        // drawPolygon(ctx, [cubicBezier.p2], 'red');
        // drawPolygon(ctx, [cubicBezier.p3], 'red');

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