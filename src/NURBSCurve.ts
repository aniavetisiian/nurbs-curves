export class NURBSCurve {
  degree: number;
  controlPoints: number[][];
  weights: number[];
  knots: number[];

  constructor(degree: number, controlPoints: number[][], weights: number[], knots: number[]) {
    this.degree = degree;
    this.controlPoints = controlPoints;
    this.weights = weights;
    this.knots = knots;
  }

  evaluate(t: number): number[] {
    const span = this.findSpan(t);
    const basisFunctions = this.computeBasisFunctions(span, t);

    const point = [0, 0, 0];
    // const n = this.degree;
    const p = this.controlPoints;

    for (let i = 0; i <= this.degree; i++) {
      for (let j = 0; j <= this.degree; j++) {
        const b = basisFunctions[i] * basisFunctions[j];
        const temp = [p[span - this.degree + i][0], p[span - this.degree + i][1], p[span - this.degree + i][2]];
        point[0] += temp[0] * this.weights[span - this.degree + i] * b;
        point[1] += temp[1] * this.weights[span - this.degree + i] * b;
        point[2] += temp[2] * this.weights[span - this.degree + i] * b;
      }
    }

    return point;
  }

  findSpan(t: number): number {
    const n = this.controlPoints.length - 1;
    const p = this.degree;
    const m = n + p + 1;

    if (t >= this.knots[m]) {
      return n;
    }

    let low = p;
    let high = m;
    let mid = Math.floor((low + high) / 2);

    while (t < this.knots[mid] || t >= this.knots[mid + 1]) {
      if (t < this.knots[mid]) {
        high = mid;
      } else {
        low = mid;
      }
      mid = Math.floor((low + high) / 2);
    }

    return mid;
  }

  computeBasisFunctions(span: number, t: number): number[] {
    const p = this.degree;

    const basisFunctions = new Array(p + 1).fill(0);
    const left = new Array(p + 1).fill(0);
    const right = new Array(p + 1).fill(0);

    basisFunctions[0] = 1.0;

    for (let j = 1; j <= p; j++) {
      left[j] = t - this.knots[span + 1 - j];
      right[j] = this.knots[span + j] - t;
      let saved = 0.0;
      for (let r = 0; r < j; r++) {
        const tmp = basisFunctions[r] / (right[r + 1] + left[j - r]);
        basisFunctions[r] = saved + right[r + 1] * tmp;
        saved = left[j - r] * tmp;
      }
      basisFunctions[j] = saved;
    }

    return basisFunctions;
  }
}

const degree = 4;
const controlPoints = [
  [400, 200, 0],
  [300, 200, 100],
  [200, 0, 200],
  [0, 200, 0],
  [500, -100, 0],
  [500, 200, 0],
  [100, -100, 700],
  [200, 0, 0],
];
const weights = [1, 1, 1, 1, 1, 1, 1, 1];
const knots = [0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7];

const degree2 = 4;
const controlPoints2 = [
  [500, 300, 0],
  [300, 200, 100],
  [200, -100, 200],
  [0, 200, 0],
  [500, -100, 0],
  [500, 200, 0],
  [100, -100, 700],
  [200, 0, 0],
];
const knots2 = [0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7];

export const nurbsCurve2 = new NURBSCurve(degree2, controlPoints2, weights, knots2);

export const nurbsCurve = new NURBSCurve(degree, controlPoints, weights, knots);
