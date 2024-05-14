import { getCanvas } from './canvas-context.ts';

export const drawGraphPaper = () => {
  const { ctx, width, height } = getCanvas();
  const step = 5;
  const frequency = 10;
  const lineWidth = 0.5;
  const color = '#f0f0f0';
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  for (let i = 0; i < width; i += step) {
    if (i % (step * frequency) === 0) {
      continue;
    }
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
  }
  for (let i = 0; i < height; i += step) {
    if (i % (step * frequency) === 0) {
      continue;
    }
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
  }
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth * 2;
  ctx.beginPath();
  const step2 = step * frequency;
  for (let i = 0; i < width; i += step2) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
  }
  for (let i = 0; i < height; i += step2) {
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
  }
  ctx.stroke();
};
