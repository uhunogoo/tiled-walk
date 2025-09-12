import React from 'react';

// stores
import useGame from '@stores/useGame';

// components
import Tile from '@components/Tile/Tile';
import Field from '@components/Field/Field';
import Bounds from '@components/Bounds/Bounds';
import DinamicMap from '@components/DynamicMap/DynamicMap';
import BushInstance from '@components/Bush/Bush';


function World() {
  // store
  const tiles = useGame( (state) => state.tiles );
  const generateMap = useGame( (state) => state.generateMap );
  const mapParameters = useGame( (state) => state.mapParameters );
  const end = useGame( (state) => state.end );
  
  React.useEffect(() => {
    generateMap();
  }, []);

  return (
    <>
      <mesh scale={[ mapParameters.columns, 1, 2 ]} position={[ 0, -0.5, 0]} receiveShadow >
        <boxGeometry args={[ 1, 1, 1 ]} />
        <meshStandardNodeMaterial />
      </mesh>

      <BushInstance 
        count={ mapParameters.rows + 4 } 
        columns={ 2 } 
        columnStep={ mapParameters.columns } 
        position={[ - mapParameters.columns * 0.5 - 0.5, 0.25, 1 - 0.5 ]} 
      />

      <group dispose={ null } position={[ 0, 0.001, -mapParameters.rows * 0.5 - 1 ]}>
        <DinamicMap tiles={ tiles } mapParameters={ mapParameters }/>
        
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

      {/* FINISH */}
      <mesh scale={[ mapParameters.columns, 1, 2 ]} receiveShadow position={[ 0, -0.5, - 2 - mapParameters.rows ]}>
        <boxGeometry args={[ 1, 1, 1 ]} />
        <meshStandardNodeMaterial />
      </mesh>
      <Bounds 
        sensor 
        args={[ mapParameters.columns * 0.5, 1, 0.1 ]} 
        position={[ 0, 1, - 1 - 0.5 - mapParameters.rows  ]}
        onIntersectionEnter={ end }
      />

      {/* FLOOR */}
      <Bounds args={[ mapParameters.columns * 0.5, 0.1, mapParameters.rows * 0.5 + 2 ]} position={[ 0, -0.1, -mapParameters.rows * 0.5 - 1 ]}/>
    </>
  );
}

export default World;