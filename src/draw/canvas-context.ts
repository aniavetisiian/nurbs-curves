export const getCanvas = () => {
  const canvas = document.getElementById('canvas')! as HTMLCanvasElement;
  const ctx = canvas?.getContext('2d')!;
  const width = canvas?.width;
  const height = canvas?.height;

  return { canvas, ctx, width, height };
};

export const getCanvasContext = () => {
  const { ctx } = getCanvas();
  return ctx;
};

export const getCanvasDimensions = () => {
  const { width, height } = getCanvas();
  return { width, height };
};
