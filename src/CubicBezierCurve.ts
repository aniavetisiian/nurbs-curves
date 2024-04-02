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