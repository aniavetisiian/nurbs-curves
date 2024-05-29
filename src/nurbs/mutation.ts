export const cloneGen = (gen: { x: number; y: number }[]) => {
  return gen.map((p: any) => ({ ...p }));
};
export const mutate = (gen: { x: number; y: number }[], s = 1) => {
  for (let i = 0; i < gen.length; i++) {
    const r = Math.random();
    if (r < 0.1) {
      const key = Math.random() > 0.5 ? 'x' : 'y';
      gen[i][key] += (Math.random() * 10 - 5) * s;
    }
  }
};
