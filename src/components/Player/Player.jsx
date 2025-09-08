import React from 'react';

// 3D libraries
import { RigidBody } from '@react-three/rapier';
import useGame from '@stores/useGame';
import PlayerController from '@components/PlayerController/PlayerController';


function Player() {
  const playerRef = React.useRef();
  
  // stores
  const setPlayer = useGame( (state) => state.setPlayer );

  React.useEffect(() => {
    // set player
    setPlayer( playerRef );
  }, []);

  return (
    <PlayerController>
      <RigidBody 
        ref={ playerRef} 
        name="player"
        canSleep={ false } 
        colliders="ball" 
        mass={200}
        restitution={0.2} 
        friction={1} 
        linearDamping={0.5}
        angularDamping={0.5}
        position={[ 0, 1, -0.5 ]}
      >
        
        <mesh castShadow>
          <icosahedronGeometry args={[ 0.3, 1 ]} />
          <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>

      </RigidBody>
    </PlayerController>
  )
}

export default Player;