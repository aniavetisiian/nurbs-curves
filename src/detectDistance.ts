export function detectPointsOnCanvas(ctx: CanvasRenderingContext2D, x: number, height: number) {
  const points: { x: number; y: number }[] = [];
  const imageData = ctx.getImageData(x, 0, 1, height);
  const pixels = imageData.data;

  let start = -1;
  let end = -1;
  let y = 0;

  for (let i = 0; i < pixels.length; i += 3) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];

    const isExist = 255 - red + 255 - green + 255 - blue > 0;

    if (isExist) {
      if (start === -1) {
        start = y;
      }
      end = y;
    } else if (start !== -1) {
      points.push({ x, y: (start + end) / 2 });
      start = -1;
      end = -1;
    }
    y++;
  }
  if (start !== -1) {
    points.push({ x, y: (start + end) / 2 });
  }

  return points;
}

export function detectDistance(ctx: CanvasRenderingContext2D, pixelsOfCurve: { x: number; y: number }[]) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  let distance = 0;

  const pointsByX: {
    [x: number]: number;
  } = {};

  for (const point of pixelsOfCurve) {
    if (!pointsByX[point.x]) {
      pointsByX[point.x] = point.y;
    }
  }

  for (let x = 0; x <= width; x++) {
    const y = pointsByX[x];
    const points = detectPointsOnCanvas(ctx, x, height);
    if (y === undefined) {
      if (points.length) {
        distance += height / 100;
      }
      continue;
    }

    const d = Math.max(...points.map((p) => Math.abs(p.y - y))) / 100;
    if (d < height && d > 0) {
      distance += d;
    }
  }
  return distance;
}
