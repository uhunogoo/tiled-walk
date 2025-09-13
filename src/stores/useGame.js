import { generateMap, range } from '@lib/utils';
import { random } from 'xoshiro128/random';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export default create( subscribeWithSelector( ( set ) => {
  return {
    mapParameters: { rows: 11, columns: 7, cellSize: 0.95 },
    tiles: [],
    blocksSeed: 12345,
    phase: 'ready', // ready || playing || trapped || end
    player: null,
    visitedTiles: {},
    start: () => set( (state) => {
      if (state.phase !== 'ready') return {};
      return { phase: 'playing' } 
    } ),
    end: () => set( (state) => { 
      if (state.phase !== 'playing') return {};
      return { phase: 'end' } 
    } ),
    trapped: () => set( (state) => {
      if (state.phase !== 'playing') return {};
      return { phase: 'trapped' }
    }),
    restart: () => set( (state) => {
      if (state.phase === 'playing' || state.phase === 'trapped') {
        const newActiveTraps = {};
        const oldActiveTraps = state.visitedTiles;
        for (const key in oldActiveTraps) {
          newActiveTraps[key] = { trap: false, visited: true };
        }

        return { phase: 'ready', visitedTiles: newActiveTraps };
      }
      if ( state.phase === 'end') {
        return { phase: 'ready', visitedTiles: {} };
      }
      return {}; 
   } ),
   setPlayer: ( player ) => set( ( state ) => {
    if ( state.player ) return {};
    
    return { player }; 
   }),
   setVisitedTiles: ( x, z, trap ) => set( ( state ) => {
    const key = `${ x }-${ z }`;
    
    const newTile = {
      trap: trap,
      visited: true,
    };
    return {visitedTiles: { ...state.visitedTiles, [key]: newTile } }; 
  }),
   generateMap: () => set( ( state ) => {
    const { rows, columns } = state.mapParameters;
    const dummyMap = range( rows ).map( () => 
      range( columns ).map( () => ({
        visited: false,
        walkable: false,
        trap: true
      }) ) 
    );

    generateMap( rows, columns, state.blocksSeed, dummyMap );

    return { tiles: dummyMap, blocksSeed: random.int( 1, 99999 ) };
   }),
  } 
}) );