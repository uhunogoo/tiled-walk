import React from 'react';

// utils
import { range } from '@lib/utils';
import useGame from '@stores/useGame';

// constants
const materials = [
  "white",
  "black",
  "red",
  "green"
];

function Map({ rows = null, columns = null, radius = 1, ...delegated }) {
  if (!rows || !columns) return null;
  const playerPosition = useGame( (state) => state.playerPosition );
  const tiles = useGame( (state) => state.tiles );
  const generateMap = useGame( (state) => state.generateMap );

  React.useEffect(() => {
    generateMap();
  }, []);
  React.useEffect(() => {
    console.log( playerPosition );
  }, [ playerPosition ]);

  

  return (
    <group dispose={ null } { ...delegated }>
      { playerPosition && 
        tiles.map( ( row, y ) => row.map( ( cell, x ) => 
          <mesh
            key={ `${ x }-${ y }` } 
            scale={[ 0.9, 0.2, 0.9 ]}
            position={[ x + 0.5, -0.1, y + 0.5 ]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicNodeMaterial color={ materials[ cell ] } />
          </mesh>
        ) ) 
      }
      {/* { playerPosition && 
        tiles.map( ( row, y ) => {
          const playerY = playerPosition.z;
          const playerX = playerPosition.x;
          if ( y < playerY - radius || y > playerY + radius ) return null;
          return (
            row.map( ( cell, x ) =>{
              if ( x < playerX - radius || x > playerX + radius ) return null;
              const isActive = y === playerY && x === playerX;
              return (
                <mesh
                  key={ `${ x }-${ y }` } 
                  scale={[ 0.9, 0.2, 0.9 ]}
                  position={[ x + 0.5, -0.1, y + 0.5 ]}
                >
                  <boxGeometry args={[1, 1, 1]} />
                  <meshBasicNodeMaterial color={ isActive ? "red" : materials[ cell ] } />
                </mesh>
              )
            })
          ) 
        })
      } */}
    </group>
  );
}

export default Map;