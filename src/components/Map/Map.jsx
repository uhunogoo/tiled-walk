import React from 'react';

// utils
import { range } from '@lib/utils';

// constants
const materials = [
  "white",
  "black",
  "red"
];

function Map({ rows = null, columns = null, ...delegated }) {
  if (!rows || !columns) return null;

  const tiles = React.useMemo(() => {
    // start and end line
    const line = range( columns ).map( () => 1 );

    // generate map
    const map = range( rows - 2 ).map( () => range( columns ).map( () => 0 ) );

    return [
      line,
      ...map,
      line
    ];
  }, [ rows, columns ]);

  return (
    <group dispose={ null } { ...delegated }>
      {
        tiles.map( ( row, y ) => row.map( ( cell, x ) => (
            <mesh
            key={ `${ x }-${ y }` } 
            scale={[ 0.9, 0.2, 0.9 ]}
            position={[ x + 0.5, -0.1, y + 1 ]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicNodeMaterial color={ materials[ cell ] } />
          </mesh>
        ) ) )
      }
    </group>
  );
}

export default Map;