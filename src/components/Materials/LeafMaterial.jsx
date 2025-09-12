import React from 'react';
import * as TSL from 'three/tsl';
import * as THREE from 'three/webgpu';

function LeafMaterial() {
  const { nodes, uniforms } = React.useMemo(() => {
    const uniforms = {
      colorB: TSL.uniform( TSL.color( 0x00ff00 ) ),
    };

    const colorNode = TSL.Fn(() => {

      const finalColor = uniforms.colorB
      
      return finalColor;
    })();

    return {
      nodes: {
        colorNode: colorNode,
        side: THREE.DoubleSide,
        transparent: true
      },
      uniforms,
    };
  }, [ ]);
  return (
    <meshStandardNodeMaterial { ...nodes } />
  );
}

export default LeafMaterial;