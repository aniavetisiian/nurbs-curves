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
