export function scaleImage(img: HTMLImageElement, width: number, height: number) {
  const imageWidth = img.width;
  const imageHeight = img.height;

  const scale = Math.max(width / imageWidth, height / imageHeight);

  return {
    width: imageWidth * scale,
    height: imageHeight * scale,
  };
}
