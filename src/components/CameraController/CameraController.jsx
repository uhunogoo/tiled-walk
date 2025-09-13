import React from 'react';
import * as THREE from 'three';

// 3D libraries
import { useFrame, useThree } from '@react-three/fiber';
import useGame from '@stores/useGame';
import { CameraControls } from '@react-three/drei';
import { useControls } from 'leva';

function CameraController() {
  const { cameraDisnace, target } = useControls( 'Camera', { 
    cameraDisnace: { value: { x: 0, y: 3.5, z: 3 }, step: 0.1 },
    target: { value: { x: 0, y: 0.25, z: -1 }, step: 0.1 }
  } );
  const camera = useThree( (state) => state.camera );

  // stores
  const player = useGame( (state) => state.player );
  
  // camera
  const ref = React.useRef( null );
  const cameraPosition = React.useMemo(() => new THREE.Vector3(), []);
  const cameraTarget = React.useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if ( !player?.current ) return;

    // control camera position
    const playerPosition = player.current.translation();
    cameraPosition.copy( playerPosition );
    cameraPosition.y += cameraDisnace.y;
    cameraPosition.z += cameraDisnace.z;
    
    cameraTarget.copy(playerPosition);
    cameraTarget.y += target.y;
    cameraTarget.z += target.z;
    
    ref.current.setLookAt( 
      ...cameraPosition,
      ...cameraTarget, 
      true 
    );
  });
  
  return (
    <CameraControls 
      ref={ ref } 
      camera={ camera }
      makeDefault={ true }
      smoothTime={ 0.1 }
      enabled={ false}
    />
  )
}

export default CameraController;