import { range } from '@lib/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export default create( subscribeWithSelector( ( set, get ) => {
  return {
    cells: [],
    chunkSize: 7,
    map: new Map(),
    nearby: [],
    buildCells: () => set( (state) => {
      const cells = range( state.chunkSize ).map( () => range( state.chunkSize ).map( () => 0 ) ); 
      return { cells: cells }; 
    }),
    buildMap: ( chunkSize ) => set( (state) => {
      const currentCells = state.cells;
      const chunks = new Map();

      currentCells.forEach( ( row, y ) => {
        row.forEach( (cell, x) => {
          const cx = Math.floor( x / chunkSize );
          const cy = Math.floor( y / chunkSize );
          const key = `${cx},${cy}`;
  
          if (!chunks.has(key)) chunks.set(key, []);
          chunks.get(key).push({ x, y, value: cell });
        } )
      });

      return { map:  chunks };
    } ),
    buildNearby:() => set( (state) => {
      const cx = Math.floor(state.x / state.chunkSize);
      const cy = Math.floor(state.y / state.chunkSize);

      const result = [];
      const chunks = get().map;

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const key = `${cx+dx},${cy+dy}`;
          if (chunks.has(key)) {
            result.push(...chunks.get( key ));
          }
        }
      }
      return { nearby: result };
    } )
  }
}) );
