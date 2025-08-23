import React from 'react';
import * as THREE from 'three';

// 3D libraries
import { RigidBody, useRapier } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import useGame from '@stores/useGame';


function Player() {
  const playerRef = React.useRef();
  const [ subscribeKeys, getKeys ] = useKeyboardControls();
  const { rapier, world } = useRapier();

  // stores
  const start = useGame( (state) => state.start );
  const end = useGame( (state) => state.end );
  const restart = useGame( (state) => state.restart );
  const blocksCount = useGame( (state) => state.blocksCount );
  const setPlayer = useGame( (state) => state.setPlayer );

  // camera
  const smoothedCameraPosition = React.useMemo(() => new THREE.Vector3(10, 10, 10), []);
  const smoothedCameraTarget = React.useMemo(() => new THREE.Vector3(), []);

  // set player
  React.useEffect(() => {
    setPlayer( playerRef );
  }, []);

  // jump
  function jump() {
    const origin = playerRef.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if (hit.timeOfImpact < 0.15) {
      playerRef.current.applyImpulse({ x: 0, y: 0.5, z: 0 }); 
    }
  }

  function reset() {
    playerRef.current.setTranslation({ x: 0, y: 1, z: 0 });
    playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
  }

  React.useEffect(() => {
    const selectorFunction = ( state ) => state.jump;
    const listenerFunction = ( value ) => {
      if ( !value ) return;
      
      jump();
    }

    const unsubscribeReset = useGame.subscribe( 
      (state) => state.phase,
      (phase) => {
        if ( phase === 'ready' ) reset();
      }
    );

    const unsubscribeJump = subscribeKeys(
      selectorFunction,
      listenerFunction
    );

    const unsubscribeAny = subscribeKeys(() => {
      start();
    });

    return () => {
      unsubscribeJump();
      unsubscribeAny();
      unsubscribeReset();
    } 
  }, [ subscribeKeys ]);

  useFrame((state, delta) => {
    // movement
    const { forward, backward, leftward, rightward } = getKeys();
    
    // forces 
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseForce = 0.6 * delta;
    const torqueForce = 0.2 * delta;

    // movement
    switch (true) {
      case forward:
        impulse.z -= impulseForce;
        torque.x -= torqueForce;
        break;

      case rightward: 
        impulse.x += impulseForce;
        torque.z -= torqueForce;
        break;

      case backward:
        impulse.z += impulseForce;
        torque.x += torqueForce;
        break;

      case leftward:
        impulse.x -= impulseForce;
        torque.z += torqueForce;
        break;
    }

    // apply forces
    playerRef.current.applyImpulse(impulse);
    playerRef.current.applyTorqueImpulse(torque);

    // control camera position
    const playerPosition = playerRef.current.translation();
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(playerPosition);
    cameraPosition.y += 4;
    // cameraPosition.y += 0.65;
    cameraPosition.z += 2.25;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(playerPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta );
    smoothedCameraTarget.lerp( cameraTarget, 5 * delta );

    state.camera.position.copy( smoothedCameraPosition );
    state.camera.lookAt( smoothedCameraTarget );

    // end game
    if ( playerPosition.z < - ( blocksCount * 4 + 2) ) {
      end();
    }

    // restart
    if (  playerPosition.y < -4 ) {
      restart();
    }
  });
  
  return (
    <>
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
        position={[ 0, 1, 0 ]}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[ 0.3, 1 ]} />
          <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>

      </RigidBody>
    </>
  )
}

export default Player;