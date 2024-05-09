export class NURBSCurve {
  degree: number;
  controlPoints: number[][];
  weights: number[];
  knots: number[];

  pointsForDrawing: { x: number; y: number }[] = [];

  constructor(degree: number, controlPoints: number[][], weights: number[], knots: number[]) {
    this.degree = degree;
    this.controlPoints = controlPoints;
    this.weights = weights;
    this.knots = knots;
  }

  isValid() {
    const n = this.controlPoints.length;
    const m = this.weights.length;
    const p = this.degree;
    const knotsLength = this.knots.length;

    // if (this.degree < 1) {
    //   throw new Error('The degree of the curve must be at least 1.');
    // }
    // if (this.controlPoints.length < this.degree + 1) {
    //   throw new Error('There must be at least degree + 1 control points.');
    // }
    // if (this.weights.length !== this.controlPoints.length) {
    //   throw new Error('There must be a corresponding weight for each control point.');
    // }
    // if (this.knots.length !== this.controlPoints.length + degree + 1) {
    //   throw new Error('The number of knots must be equal to the number of control points plus the degree plus one.');
    // }

    return n === m && n === p + 1 && knotsLength === n + p + 1;
  }
  private findSpan(u: number): number {
    const n = this.controlPoints.length - 1;
    const p = this.degree;
    const knots = this.knots;

    if (u >= knots[n + 1]) {
      return n;
    }

    if (u <= knots[p]) {
      return p;
    }

    let low = p;
    let high = n + 1;
    let mid = Math.floor((low + high) / 2);

    while (u < knots[mid] || u >= knots[mid + 1]) {
      if (u < knots[mid]) {
        high = mid;
      } else {
        low = mid;
      }
      mid = Math.floor((low + high) / 2);
    }

    return mid;
  }

  private basisFunctions(u: number, span: number): number[] {
    const p = this.degree;
    const knots = this.knots;
    const N: number[] = new Array(p + 1).fill(0);

    N[0] = 1;

    const left: number[] = new Array(p + 1).fill(0);
    const right: number[] = new Array(p + 1).fill(0);

    for (let j = 1; j <= p; j++) {
      left[j] = u - knots[span + 1 - j];
      right[j] = knots[span + j] - u;

      let saved = 0;

      for (let r = 0; r < j; r++) {
        const temp = N[r] / (right[r + 1] + left[j - r]);
        N[r] = saved + right[r + 1] * temp;
        saved = left[j - r] * temp;
      }

      N[j] = saved;
    }

    return N;
  }

  public evaluate(u: number): number[] {
    const span = this.findSpan(u);
    const N = this.basisFunctions(u, span);
    const p = this.degree;
    const controlPoints = this.controlPoints;
    const weights = this.weights;

    const point: number[] = new Array(controlPoints[0].length).fill(0);
    let weightSum = 0;

    for (let i = 0; i <= p; i++) {
      const weight = weights[span - p + i];
      weightSum += N[i] * weight;

      for (let j = 0; j < point.length; j++) {
        point[j] += N[i] * controlPoints[span - p + i][j] * weight;
      }
    }

    for (let i = 0; i < point.length; i++) {
      point[i] /= weightSum;
    }

    return point;
  }

  prepareToDraw(parts: number = 400) {
    const step = 1 / parts;

    try {
      for (let u = 0; u <= 1; u += step) {
        const [x, y] = this.evaluate(u);
        this.pointsForDrawing.push({ x, y });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
