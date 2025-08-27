import React from 'react';
import Bounds from '@components/Bounds/Bounds';
import { range } from '@lib/utils';

const materials = [
  "white",
  "black",
  "red"
];

const ROWS = 11;
const COLUMNS = 7;

function World() {
  return (
    <>
      <Map 
        rows={ ROWS } 
        columns={ COLUMNS } 
        position={[ -COLUMNS / 2, 0, -ROWS ]}
      />

      {/* floor */}
      <Bounds args={[ COLUMNS * 0.5, 0.1, ROWS * 0.5 ]}  position={[ 0, 0, -ROWS / 2 + 0.5 ]}/>
    </>
  );
}

function Map({ rows = 11, columns = 11, ...delegated }) {
  const tiles = React.useMemo(() => {
    // start and end line
    const line = range( columns ).map( () => 1 );

    // generate map
    const map = range( rows - 2 ).map( () => range( columns ).map( () => 0 ) );
;
    return [
      line,
      ...map,
      line
    ];
  }, []);

  return (
    <group dispose={ null } { ...delegated }>
      {
        tiles.map( ( row, y ) => row.map( ( cell, x ) => (
          <mesh
           key={ `${ x }-${ y }` } 
           scale={[ 0.9, 0.2, 0.9 ]}
           position={[ x + 0.5, 0, y + 1 ]}
         >
           <boxGeometry args={[1, 1, 1]} />
           <meshBasicNodeMaterial color={ materials[ cell ] } />
         </mesh>
        ) ) )
      }
    </group>
  );
}

export default World;