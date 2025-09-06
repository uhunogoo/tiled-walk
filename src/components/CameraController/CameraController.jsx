import React from 'react';
import * as THREE from 'three';

// 3D libraries
import { useFrame, useThree } from '@react-three/fiber';
import useGame from '@stores/useGame';
import { CameraControls } from '@react-three/drei';

function CameraController() {
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
    cameraPosition.y += 3.5;
    cameraPosition.z += 2.25;
    
    cameraTarget.copy(playerPosition);
    cameraTarget.y += 0.25;
    
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