import React from 'react';
import * as TSL from 'three/tsl';


function Field({ height = null, width = null }) {
  if (!height || !width) return null;
  
  const { nodes, uniforms } = React.useMemo(() => {
    const uniforms = {
      sizes: TSL.uniform( TSL.vec2( width, height ) ),
      colorA: TSL.uniform( TSL.color( 0x000000 ) ),
      colorB: TSL.uniform( TSL.color( 0x00ff00 ) ),
    };

    const colorNode = TSL.Fn(() => {
      const uv = TSL.uv();
      const thickness = 0.49;
      const grid = TSL.fract( uv.mul( uniforms.sizes ) );
      
      const strength = TSL.step( thickness, TSL.max( TSL.abs( grid.x.sub( 0.5) ), TSL.abs( grid.y.sub( 0.5) ) ));
      const color = uniforms.colorB;
      const color2 = uniforms.colorA;

      const finalColor = TSL.mix( color, color2, strength );
      
      return finalColor;
    })();

    return {
      nodes: {
        colorNode: colorNode,
        // shadow: true,
        transparent: true
      },
      uniforms,
    };
  }, [ height, width ]);

  return (
    <>
      <mesh rotation-x={ - Math.PI * 0.5 } receiveShadow >
        <planeGeometry args={[ width, height, 1, 1 ]} />
        <meshStandardNodeMaterial { ...nodes } />
      </mesh>
    </>
  );
}

export default Field;