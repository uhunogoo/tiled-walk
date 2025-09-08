import React from 'react';
import * as THREE from 'three/webgpu';

// stores
import useGame from '@stores/useGame';

// components
import Bounds from '@components/Bounds/Bounds';
import Tile from '@components/Tile/Tile';
import Field from '@components/Field/Field';
import { useFrame } from '@react-three/fiber';
import { worldToGrid } from '@lib/utils';


function World() {
  // store
  const tiles = useGame( (state) => state.tiles );
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
        <PlayerOnMap tiles={ tiles } mapParameters={ mapParameters }/>
        
        <Field height={ mapParameters.rows } width={ mapParameters.columns }/>

        { tiles.map( ( row, y ) => row.map( ( cell, x ) => 
          <Tile 
            key={ `${ x }-${ y }` }
            params={[ x, y ]}
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

function PlayerOnMap({ mapParameters, tiles = [], radius = 1, children }) {
  // stores
  const player = useGame( (state) => state.player );
  // const restart = useGame( (state) => state.restart );
  const setActiveTraps = useGame( (state) => state.setActiveTraps );

  const [activeChunks, setActiveChunks] = React.useState(new Set());
  const dummyPosition = React.useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if ( !player?.current || !mapParameters || !tiles ) return;
    
    const currentPosition = player.current.translation();
    const [ x, y, z ] = worldToGrid( currentPosition, mapParameters);
    
    if ( y > 0.3 ) return;
    
    if ( dummyPosition.x !== x || dummyPosition.z !== z ) {
      const currentTile = tiles[z]?.[x] ?? null;
      
      // new position
      dummyPosition.set( x, y, z );
      
      // restart becouse of trap
      if (currentTile?.trap) {
        setActiveTraps( x, z );
        // restart();
      }
    }
  });
    
  return (
    <>
      { children }
    </>
  )
}

function Sensor({ ...delegated }) {
  return (
    <Bounds sensor {...delegated} />
  );
}

export default World;