import { useTexture } from '@react-three/drei';
import React from 'react';
import * as TSL from 'three/tsl';
import * as THREE from 'three/webgpu';

function LeafMaterial() {
  const texture = useTexture('/leafs.jpg');
  const perlin = useTexture('/perlin-noise.png');
  const { nodes, uniforms } = React.useMemo(() => {
    const uniforms = {
      texture: texture,
      perlin: perlin,
      colorB: TSL.uniform( TSL.color( 0x00ff00 ) ),
    };

    const colorNode = TSL.Fn(() => {
      const uv = TSL.uv();
      const color = TSL.texture( uniforms.texture, uv );
      const finalColor = TSL.mix( color, uniforms.colorB, color );
      
      return TSL.vec4( finalColor.rgb, color.r );
    })();

    const positionNode = TSL.Fn(() => {
      const perlinUV = TSL.positionWorld.xz.mul( 0.2 ).add( TSL.time.mul( 0.1 ) );
      const perlinColor = TSL.texture( uniforms.perlin, perlinUV ).sub( 0.5 ).mul( TSL.positionWorld.y );
      const finalPosition = TSL.positionLocal.add( TSL.vec3( perlinColor.r, 0, perlinColor.r ) );

      return finalPosition;
    })();

    return {
      nodes: {
        colorNode: colorNode,
        positionNode: positionNode,
        side: THREE.DoubleSide,
        transparent: true
      },
      uniforms,
    };
  }, [ texture, perlin ]);
  return (
    <meshStandardNodeMaterial { ...nodes } />
  );
}

export default LeafMaterial;