export const integrace = (signal: number[]) =>
  Math.round(signal.reduce((acc, x) => acc + x, 0));
