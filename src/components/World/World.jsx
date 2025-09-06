import React from 'react';
import * as THREE from 'three/webgpu';

// stores
import useGame from '@stores/useGame';

// components
import Bounds from '@components/Bounds/Bounds';
import Tile from '@components/Tile/Tile';
import usePlayerToGrid from '@hooks/usePlayerToGrid';
import Field from '@components/Field/Field';
import { useFrame } from '@react-three/fiber';
import { worldToGrid } from '@lib/utils';
// import { range } from '@lib/utils';


function World() {
  // store
  const tiles = useGame( (state) => state.tiles );
  const player = useGame( (state) => state.player );
  const generateMap = useGame( (state) => state.generateMap );
  const mapParameters = useGame( (state) => state.mapParameters );
  
  React.useEffect(() => {
    generateMap();
  }, []);

  return (
    <>

      <mesh scale={[ mapParameters.columns, 1, 2 ]} position={[ 0, -0.5, 0]}>
        <boxGeometry args={[ 1, 1, 1 ]} />
        <meshNormalMaterial />
      </mesh>

      <group dispose={ null } position={[ 0, 0.001, -mapParameters.rows * 0.5 - 1 ]}>
        <PlayerOnMap player={ player } tiles={ tiles } mapParameters={ mapParameters }/>
        
        <Field height={ mapParameters.rows } width={ mapParameters.columns }/>

        { tiles.map( ( row, y ) => row.map( ( cell, x ) => 
          <Tile key={ `${ x }-${ y }` } 
            position={[ x + 0.5 - mapParameters.columns * 0.5, -0.08, y + 0.5 - mapParameters.rows * 0.5 ]} 
            scale={[ mapParameters.cellSize, 0.2, mapParameters.cellSize ]} 
            value={ cell.trap }
          />
        ) ) }
      </group>

      <mesh scale={[ mapParameters.columns, 1, 2 ]} position={[ 0, -0.5, - 2 - mapParameters.rows ]}>
        <boxGeometry args={[ 1, 1, 1 ]} />
        <meshNormalMaterial />
      </mesh>

      <Bounds args={[ mapParameters.columns * 0.5, 0.1, mapParameters.rows * 0.5 + 2 ]} position={[ 0, -0.1, -mapParameters.rows * 0.5 - 1 ]}/>
    </>
  );
}

function PlayerOnMap({ player, mapParameters, tiles = [], radius = 1, children }) {
  const restart = useGame( (state) => state.restart );
  const position = React.useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if ( !player?.current || !mapParameters || !tiles ) return;
    
    const currentPosition = player.current.translation();
    const [ x, y, z ] = worldToGrid( currentPosition, mapParameters);
    
    if ( position.x !== x || position.z !== z ) {
      position.set( x, y, z );
      
      const currentTile = tiles[position.z]?.[position.x] ?? null;
      
      if (currentTile?.trap) restart();
    }
  });
    
  return (
    <>
      { children }
      {/* { !!tiles.length && (
        coordinates.map( ( position, y ) =>
          <Tile key={ `${ position.x }-${ position.z }` } 
            position={[ position.x + 0.5, -0.1, position.z + 0.5 ]} 
            scale={[ mapParameters.cellSize, 0.2, mapParameters.cellSize ]} 
            value={ tiles[ position.z ][ position.x ] }
          />
        ) 
      ) } */}
    </>
  )
}

export default World;