import * as ROT from 'rot-js';
import { random } from 'xoshiro128/random';

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

export function generateMap(ROWS, COLUMNS, seed ) {
  if (!ROWS || !COLUMNS) return [];
  
  const tiles = range( ROWS ).map( () => range( COLUMNS ).map( () => 0 ) );
  
  // Set seeds
  const newSeed = seed || 12345;
  ROT.RNG.setSeed( newSeed );
  random.reset( newSeed );

  const start = random.int( 1, COLUMNS - 1 );
  const end = random.int( 1, COLUMNS - 1 );

  const data = {};
  
  const em = new ROT.Map.EllerMaze( COLUMNS, ROWS );
  em.create( (x, y, value) => {
    if ( (y === 1 && x === end) || (y === ROWS - 2 && x === start) ) {
      value = 0;
    }
    if ( (y === 0 && x === end) || (y === ROWS - 1 && x === start) ) {
      tiles[y][x] = 2;
    }
    data[`${x}-${y}`] = value;
  });

  /* input callback informs about map structure */
  const passableCallback = (x, y) => {
    return (data[`${x}-${y}`] === 0);
  }

  const astar = new ROT.Path.AStar( end, 1, passableCallback, { topology: 4 } );

  astar.compute( start, ROWS - 2, ( x, y ) => {
    tiles[y][x] = 2;
  });

  return tiles;
}