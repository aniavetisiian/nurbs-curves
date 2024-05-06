export function detectPointsOnCanvas(ctx: CanvasRenderingContext2D, x: number, height: number) {
  const points: { x: number; y: number }[] = [];
  const intersectionPoints: { x: number; y: number; color: number[] }[] = [];
  const imageData = ctx.getImageData(x, 0, 1, height);
  const pixels = imageData.data;

  let start = -1;
  let end = -1;
  let y = 0;

  for (let i = 0; i < pixels.length; i += 3) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];
    const alpha = pixels[i + 3];

    const isExist = 255 - red + 255 - green + 255 - blue > 0;
    const shade = red + green + blue;
    if (shade < 384) {
      console.log(red, green, blue, alpha, 'point', x, y);
      intersectionPoints.push({ x: x, y: y, color: [red, green, blue, alpha] });
    }
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

  return { points, intersectionPoints };
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
    const { points } = detectPointsOnCanvas(ctx, x, height);
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

export function detectClosestColorToBlack(intersections: { x: number; y: number; color: number[] }[]) {
  const black = [0, 0, 0];
  let minDistance = Infinity;
  let closestPoint = { x: 0, y: 0 };
  for (const intersection of intersections) {
    const color = intersection.color;

    const distance = Math.sqrt(
      Math.pow(color[0] - black[0], 2) + Math.pow(color[1] - black[1], 2) + Math.pow(color[2] - black[2], 2),
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestPoint.x = intersection.x;
      closestPoint.y = intersection.y;
    }
  }

  return closestPoint;
}
