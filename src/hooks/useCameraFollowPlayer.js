import * as THREE from 'three';
import * as React from 'react';

// 3D libraries
import { useFrame } from '@react-three/fiber';

function useCameraFollowPlayer( player ) {
  if ( !player ) return;
  
  // camera
  const cameraTarget = React.useMemo(() => new THREE.Vector3(), []);
  const cameraPosition = React.useMemo(() => new THREE.Vector3(), []);
  const smoothedCameraTarget = React.useMemo(() => new THREE.Vector3(), []);
  const smoothedCameraPosition = React.useMemo(() => new THREE.Vector3(10, 10, 10), []);

  useFrame((state, delta) => {
    if ( !player.current ) return;
    
    // control camera position
    const playerPosition = player.current.translation();
    cameraPosition.copy(playerPosition);
    cameraPosition.y += 4;
    // cameraPosition.y += 0.65;
    cameraPosition.z += 2.25;

    // control camera target
    cameraTarget.copy(playerPosition);
    cameraTarget.y += 0.25;

    // lerp
    smoothedCameraPosition.lerp(cameraPosition, 5 * delta );
    smoothedCameraTarget.lerp( cameraTarget, 5 * delta );

    // apply
    state.camera.position.copy( smoothedCameraPosition );
    state.camera.lookAt( smoothedCameraTarget );
  });

  return null;
}

export default useCameraFollowPlayer;