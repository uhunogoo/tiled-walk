import { generateMap, range } from '@lib/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export default create( subscribeWithSelector( ( set ) => {
  return {
    mapSize: { rows: 11, columns: 7, cellSize: 1 },
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
   setPlayerPosition: ( position ) => set( ( state ) => {
    return { playerPosition: position }; 
   }),
   generateMap: () => set( ( state ) => {
    const { rows, columns } = state.mapSize;
    const line = range( columns ).map( () => 1 );
    const cells = generateMap( rows - 2, columns, state.blocksSeed );
    return { tiles: [ line, ...cells, line ] };
   }),
  } 
}) );