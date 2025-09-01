import React from 'react';

// 3D libraries
import { RigidBody } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';

// stores
import useGame from '@stores/useGame';

// hooks
import useCameraFollowPlayer from '@hooks/useCameraFollowPlayer';

// components
import PlayerMove from '@components/Player/PlayerMove';


function Player() {
  const playerRef = React.useRef();
  const [ subscribeKeys, getKeys ] = useKeyboardControls();

  // stores
  const start = useGame( (state) => state.start );
  const setPlayer = useGame( (state) => state.setPlayer );

  // set player
  React.useEffect(() => {
    setPlayer( playerRef );
  }, []);

  // start
  React.useEffect(() => {
    const unsubscribeAny = subscribeKeys(() => {
      start();
    });

    return () => unsubscribeAny();
  }, [ subscribeKeys ]);

  // player and camera move
  useCameraFollowPlayer( playerRef );
  
  return (
    <PlayerMove objectToMove={ playerRef }>
      <RigidBody
        ref={ playerRef }
        name="player"
        canSleep={ false } 
        colliders="ball" 
        mass={0.1}
        restitution={0.2} 
        friction={1} 
        linearDamping={0.5}
        angularDamping={0.5}
        position={[ 0, 1, 0 ]}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[ 0.3, 1 ]} />
          <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>
      </RigidBody>
    </PlayerMove>
  )
}

export default Player;