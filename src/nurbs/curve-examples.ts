const curveExample1 = {
  name: 'Shape 1',
  degree: 2,
  controlPoints: [
    { x: 1, y: 0, w: Math.SQRT2 / 2 },
    { x: 1, y: 1, w: 1 },
    { x: 0, y: 1, w: Math.SQRT2 / 2 },
    { x: -1, y: 1, w: 1 },
    { x: -1, y: 0, w: Math.SQRT2 / 2 },
    { x: -1, y: -1, w: 1 },
    { x: 0, y: -1, w: Math.SQRT2 / 2 },
    { x: 1, y: -1, w: 1 },
    { x: 1, y: 0, w: Math.SQRT2 / 2 },
  ].map(({ x, y, w }) => ({ x: 400 + x * 200, y: 400 + y * 200, w })),
  knots: [0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4],
};

const curveExample2 = {
  name: 'Օրինակ 2',
  degree: 1,
  controlPoints: [
    { x: 400, y: 200, w: 2 },
    { x: 300, y: 200, w: 2 },
    { x: 200, y: 0, w: 2 },
    { x: 0, y: 200, w: 2 },
    { x: 500, y: 100, w: 2 },
    { x: 500, y: 200, w: 2 },
    { x: 100, y: 100, w: 2 },
    { x: 200, y: 0, w: 2 },
  ],
  knots: [0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7],
};

export default {
  curve1: [curveExample1, curveExample2],
  curve2: [curveExample1, curveExample2],
};
