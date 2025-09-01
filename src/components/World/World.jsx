import React from 'react';
import * as TSL from 'three/tsl';

import useGame from '@stores/useGame';
import Map from '@components/Map/Map';
import MapBounds from '@components/Map/MapBounds';

const ROWS = 11;
const COLUMNS = 7;

function World() {
  const { rows, columns } = useGame((state) => state.mapSize);
  const newRows = rows || ROWS;
  const newColumns = columns || COLUMNS;

  return (
    <>
      <Map 
        rows={ newRows } 
        columns={ newColumns } 
        position={[ -newColumns / 2, 0, -newRows ]}
      />

      {/* Grid */}
      <Grid rows={ newRows } columns={ newColumns } />

      {/* floor and walls */}
      <MapBounds rows={ newRows } columns={ newColumns } />
    </>
  );
}

function Grid({ rows = null, columns = null }) {
  if (!rows || !columns) return null;
  const { nodes, uniforms } = React.useMemo(() => {
    const uniforms = {
      sizes: TSL.uniform( TSL.vec2( columns, rows ) ),
      colorA: TSL.uniform( TSL.color( 0xe1bf92 ) ),
      colorB: TSL.uniform( TSL.color( 0xf6d7b0 ) ),
    };

    const colorNode = TSL.Fn(() => {
      const uv = TSL.uv();
      const thickness = 0.49;
      const grid = TSL.fract( uv.mul( uniforms.sizes ) );
      
      const strength = TSL.step( thickness, TSL.max( TSL.abs( grid.x.sub( 0.5) ), TSL.abs( grid.y.sub( 0.5) ) ));
      const color = uniforms.colorA;

      const finalColor = TSL.vec4( color, strength );
      
      return finalColor;
    })();

    return {
      nodes: {
        colorNode: colorNode,
        shadow: true,
        transparent: true
      },
      uniforms,
    };
  }, [ rows, columns ]);

  return (
    <>
      <mesh rotation-x={ -Math.PI / 2 } position-z={ -rows * 0.5 }>
        <planeGeometry args={[ columns, rows, 1, 1 ]} />
        <meshBasicNodeMaterial { ...nodes } />
      </mesh>
    </>
  );
}

export default World;