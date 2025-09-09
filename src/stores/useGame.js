import { generateMap, range } from '@lib/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export default create( subscribeWithSelector( ( set ) => {
  return {
    mapParameters: { rows: 11, columns: 7, cellSize: 0.95 },
    tiles: [],
    blocksSeed: 12345,
    phase: 'ready', // ready || playing || trapped || end
    player: null,
    activeTraps: {},
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
      if (state.phase === 'playing' || state.phase === 'end' || state.phase === 'trapped') {
        const newActiveTraps = {};
        const oldActiveTraps = state.activeTraps;
        for (const key in oldActiveTraps) {
          newActiveTraps[key] = false;
        }

        return { phase: 'ready', blocksSeed: Math.random(), activeTraps: newActiveTraps };
      }
      return {}; 
   } ),
   setPlayer: ( player ) => set( ( state ) => {
    if ( state.player ) return {};
    
    return { player }; 
   }),
   setActiveTraps: ( x, z ) => set( ( state ) => {
    const key = `${ x }-${ z }`;
    console.log( state.activeTraps );
    return {activeTraps: { ...state.activeTraps, [key]: true } }; 
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