import { generateMap, range } from '@lib/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export default create( subscribeWithSelector( ( set ) => {
  return {
    mapParameters: { rows: 11, columns: 7, cellSize: 0.95 },
    tiles: [],
    blocksSeed: 12345,
    phase: 'ready',
    player: null,
    playerPosition: null,
    start: () => set( (state) => {
      if (state.phase !== 'ready') return {};
      return { phase: 'playing' } 
    } ),
    end: () => set( (state) => { 
      if (state.phase !== 'playing') return {};
      return { phase: 'end' } 
    } ),
    restart: () => set( (state) => {
      if (state.phase === 'playing' || state.phase === 'end') {
        return { phase: 'ready', blocksSeed: Math.random() };
      }
      return {}; 
   } ),
   setPlayer: ( player ) => set( ( state ) => {
    if ( state.player ) return {};
    
    return { player }; 
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

    // const cells = generateMap( rows - 2, columns, state.blocksSeed );
    // return { tiles: [ ...map ] };
    return { tiles: dummyMap };
   }),
  } 
}) );