import React from 'react';
// import * as THREE from 'three/webgpu';

// import { useHelper } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

function Environment() {
  const directionalLight = React.useRef( null );

  // useHelper( directionalLight, THREE.DirectionalLightHelper, 1 );

  useFrame(( state, delta ) => {
    directionalLight.current.position.z = state.camera.position.z + 1 - 4;
    directionalLight.current.target.position.z = state.camera.position.z - 6;
    directionalLight.current.target.updateMatrixWorld();
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        ref={ directionalLight } 
        intensity={2.5} 
        position={[ 5, 5, 5 ]}
        castShadow 
        shadow-mapSize={[ 2048, 2048 ]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  )
}

export default Environment;