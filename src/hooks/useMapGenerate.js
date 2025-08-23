import React from 'react';
import * as ROT from 'rot-js';
import { random } from 'xoshiro128/random';
import useMap from '@stores/useMap';

function useMapGenerate( ROWS, COLUMNS ) {
  const cells = useMap( (state) => state.cells );
  const buildCells = useMap( (state) => state.buildCells );

  const grid = React.useMemo(() => {
    const tiles = cells;
    if (tiles.length === 0) return tiles;
    // Set seeds
    const seed = 12345;
    ROT.RNG.setSeed(seed);
    random.reset( seed );

    const start = random.int( 1, COLUMNS - 1 );
    const end = random.int( 1, COLUMNS - 1 );

    const data = {};
    
    const em = new ROT.Map.EllerMaze( ROWS, COLUMNS );
    em.create((x, y, value) => {
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
  }, [ cells ]);

  React.useEffect(() => { 
    buildCells(); 
  }, []);

  return grid;
}

export default useMapGenerate;