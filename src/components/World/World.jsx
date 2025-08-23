import React, { use } from 'react';
import { range } from '@lib/utils';
import Bounds from '@components/Bounds/Bounds';
import Tiles from '@components/Tiles/Tiles';
import useMapGenerate from '@hooks/useMapGenerate';
import useMap from '@stores/useMap';


const ROWS = 7;
const COLUMNS = 7;

const materials = [
  "white",
  "black",
  "red"
];

function World() {
  return (
    <>
      <mesh
        scale={[ COLUMNS , 0.1, 4 ]}
        position={[ 0, 0, 0]}
      >
        <boxGeometry />
        <meshBasicNodeMaterial color="green" />
      </mesh>
      
      <Map 
        rows={ ROWS } 
        columns={ COLUMNS } 
        position={[ -COLUMNS / 2, 0, -2 ]}
      />

      <mesh
        scale={[ COLUMNS , 0.1, 4 ]}
        position={[ 0, 0, -4 - ROWS ]}
      >
        <boxGeometry />
        <meshBasicNodeMaterial color="green" />
      </mesh>

      {/* floor */}
      <Bounds args={[ COLUMNS * 0.5, 0.05, ( 4 + ROWS * 0.5 ) ]} position={[ 0, 0, -ROWS / 2 - 2 ]} />
    </>
  );
}

function Map({ rows = 11, columns = 11, ...delegated }) {
  const mapTiles = useMapGenerate( rows, columns );
  
  // stores
  const map = useMap( (state) => state.map );
  const chunkSize = useMap( (state) => state.chunkSize );
  const nearby = useMap( (state) => state.nearby );
  const buildMap = useMap( (state) => state.buildMap );
  const buildNearby = useMap( (state) => state.buildNearby );

  React.useEffect(() => { 
    buildMap( chunkSize ); 
  }, [ mapTiles, chunkSize ]);

  console.log( map )
  return (
    <group dispose={ null } { ...delegated }>
      { [...map.entries()].map(([chunkKey, cells]) => (
        // console.log( chunkKey, cells )
       cells.map( (cell, index) => (
         <mesh
           key={ `${ chunkKey }-${ cell.x }-${ cell.y }` } 
           scale={[ 0.9, 0.1, 0.9 ]}
           position={[ cell.x + 0.5, 0, (cell.y + 0.5) - rows ]}
         >
           <boxGeometry args={[1, 1, 1]} />
           <meshBasicNodeMaterial color={ materials[ cell.value ] } />
         </mesh>
       )) 
      )) }
    </group>
  );
}

export default World;