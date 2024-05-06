export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const normalizeArray = (arr: number[]) => {
  const max = Math.max(...arr);
  return arr.map((v) => v / max);
};
