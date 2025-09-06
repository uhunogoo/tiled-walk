import React from 'react';
import * as THREE from 'three';

// import { worldToGrid } from '@lib/utils';
import { useFrame } from '@react-three/fiber';

const vec3 = new THREE.Vector3();

function usePlayerToGrid( player, mapSize, tiles = [] ) {
  const [ positionOnGrid, setPositionOnGrid ] = React.useState( null );

  useFrame((state, delta) => {
    if ( !player?.current || !mapSize || !tiles ) return;
    
    const currentPosition = player.current.translation();
    const [ x, y, z ] = worldToGrid( currentPosition, mapSize);
    // console.log( z )
    if ( !positionOnGrid ) { 
      setPositionOnGrid( () => vec3.set( x, y, z ) )
    } else if ( positionOnGrid.x !== x || positionOnGrid.z !== z ) {
      const vecCopy = vec3.clone();
      setPositionOnGrid( () => vecCopy.set( x, y, z ) );
    }
  });

  return null;
}

function worldToGrid( position, map ) {
  if ( !position || !map ) return [0, 0, 0];
  const { rows, columns, cellSize } = map;

  const onGridX = Math.floor( position.x + columns * 0.5 );
  const onGridZ = Math.round( position.z + ( rows - cellSize * 0.5 + 1) );

  // const snapX = Math.max( 0, Math.min(columns - 1, onGridX) );
  // const snapZ = Math.max( 0, Math.min(rows - 1, onGridZ) );
  
  return [ onGridX, position.y, onGridZ ];
}


export default usePlayerToGrid;