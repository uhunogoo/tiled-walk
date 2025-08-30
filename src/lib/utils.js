export const range = (start, end, step = 1) => {
  let output = [];
  if (typeof end === 'undefined') {
    end = start;
    start = 0;
  }
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

export function worldToGrid(x, z, COLUMNS = 11, ROWS = 11) {
  // world center
  const col = Math.floor(x + COLUMNS / 2); // X → column
  const row = Math.floor(z + ROWS / 2);    // Z → row
  // clamp
  return [
    Math.max(0, Math.min(ROWS - 1, row)),
    Math.max(0, Math.min(COLUMNS - 1, col)),
  ];
}