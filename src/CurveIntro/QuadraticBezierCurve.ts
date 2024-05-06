import { drawPolygon, drawPolygonLine } from '../nurbs/drawFunctions.ts';

export class QuadraticBezierCurve {
  p0: number[];
  p1: number[];
  p2: number[];

  constructor(p0: number[], p1: number[], p2: number[]) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
  }

  evaluate(t: number): number[] {
    const q0 = this.linearInterpolation(this.p0, this.p1, t);
    const q1 = this.linearInterpolation(this.p1, this.p2, t);
    return this.linearInterpolation(q0, q1, t);
  }

  linearInterpolation(p0: number[], p1: number[], t: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < p0.length; i++) {
      result[i] = (1 - t) * p0[i] + t * p1[i];
    }
    return result;
  }
}

export function animateQuadraticBezier(ctx: CanvasRenderingContext2D, quadraticBezier: QuadraticBezierCurve) {
  let t = 0;
  const animationSpeed = 0.01;

  function animate() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const points: number[][] = [];
    for (let i = 0; i <= t; i += animationSpeed) {
      const point = quadraticBezier.evaluate(i);
      points.push(point);
    }

    // drawPolygon(ctx, [quadraticBezier.p0], 'red');
    // drawPolygon(ctx, [quadraticBezier.p1], 'red');
    // drawPolygon(ctx, [quadraticBezier.p2], 'red');
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
