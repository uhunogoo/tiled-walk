import React from 'react';
import * as THREE from 'three/webgpu';

// 3D libraries
import { useFrame } from '@react-three/fiber';

// utils
import { worldToGrid } from '@lib/utils';

// stores
import useGame from '@stores/useGame';

// components
import Bounds from '@components/Bounds/Bounds';

function DynamicMap({ mapParameters, tiles = [], radius = 1, children }) {
  // stores
  const player = useGame( (state) => state.player );
  const trapped = useGame( (state) => state.trapped );
  const setVisitedTiles = useGame( (state) => state.setVisitedTiles );

  const [activeChunks, setActiveChunks] = React.useState(new Set());
  const dummyPosition = React.useMemo(() => new THREE.Vector3(), []);

  function getIntoTrap( x, z, trap) {
    setVisitedTiles( x, z, trap );
    
    if ( trap ) {
      trapped();
    }
  }

  useFrame((state, delta) => {
    if ( !player?.current || !mapParameters || !tiles ) return;
    
    const currentPosition = player.current.translation();
    const [ x, y, z ] = worldToGrid( currentPosition, mapParameters);
    
    if ( y > 0.3 ) return;
    
    if ( dummyPosition.x !== x || dummyPosition.z !== z ) {
      // const currentTile = tiles[z]?.[x] ?? null;
      
      // update active chunks
      const chunks = new Set();
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
          chunks.add(`${x+dx}:${z+dz}`);
        }
      }
      setActiveChunks(chunks);

      // new position
      dummyPosition.set( x, y, z );
    }
  });
    
  return (
    <>
    { tiles.map((row, z) => row.map((cell, x) => {
        const key = `${x}:${z}`;
        if (!activeChunks.has(key)) return null;   // тільки активні

        return (
          <Bounds
            key={key}
            sensor
            position={[ x + 0.5 - mapParameters.columns * 0.5, 0.1, z + 0.5 - mapParameters.rows * 0.5 ]}
            args={[ mapParameters.cellSize * 0.25, 0.1, mapParameters.cellSize * 0.25 ]}
            onIntersectionEnter={ () => getIntoTrap( x, z, cell.trap ) }
            // trap={cell.trap}
            // mapParameters={mapParameters}
          />
        )
      }) )}
    </>
  )
}

export default DynamicMap;