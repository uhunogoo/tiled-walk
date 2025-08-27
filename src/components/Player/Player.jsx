import React from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// 3D libraries
import { RigidBody, useRapier } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import useGame from '@stores/useGame';

const cameraPosition = new THREE.Vector3();
const cameraTarget = new THREE.Vector3();
const quaternion = new THREE.Quaternion();

function Player() {
  const playerRef = React.useRef();
  const [ subscribeKeys, getKeys ] = useKeyboardControls();
  // const { rapier, world } = useRapier();
  const targetPosition = React.useMemo(() => new THREE.Vector3( 0, 0.3, 0 ), []);
  const targetQuat = React.useMemo(() => new THREE.Quaternion(), []);

  // stores
  const start = useGame( (state) => state.start );
  const restart = useGame( (state) => state.restart );
  const setPlayer = useGame( (state) => state.setPlayer );

  // camera
  const smoothedCameraPosition = React.useMemo(() => new THREE.Vector3(10, 10, 10), []);
  const smoothedCameraTarget = React.useMemo(() => new THREE.Vector3(), []);

  // set player
  React.useEffect(() => {
    setPlayer( playerRef );
  }, []);

  function reset() {
    playerRef.current.setTranslation({ x: 0, y: 1, z: 0 });
    playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
  }

  // move with gsap
  useGSAP((context, contextSafe) => {
    // s / r = angle
    const rotateStep = 1 / 0.3;

    const target = new THREE.Vector3();
    const tempQuat = new THREE.Quaternion();

    let isMoving = false;

    gsap.defaults({
      ease: "sine.out",
      duration: 0.25,
      onComplete: () => { isMoving = false; }
    });

    const moveX = gsap.quickTo( targetPosition, "x" );
    const moveZ = gsap.quickTo( targetPosition, "z" );
    const rotateTo = (axis, angle) => {
      const delta = new THREE.Quaternion().setFromAxisAngle( axis, angle );
      tempQuat.multiplyQuaternions(delta, tempQuat);

      gsap.to( targetQuat, {
        x: tempQuat.x,
        y: tempQuat.y,
        z: tempQuat.z,
        w: tempQuat.w,
      });
    };

    const move = contextSafe( (dir) => {
      if (isMoving) return;
      isMoving = true;

      target.x += dir.x;
      target.z += dir.z;

      if (dir.x !== 0) {
        moveX( target.x );
        // rotate
        rotateTo( new THREE.Vector3( 0, 0, 1 ), - dir.x * rotateStep );
      }
      if (dir.z !== 0) {
        moveZ( target.z );
        // rotate
        rotateTo( new THREE.Vector3( 1, 0, 0 ), dir.z * rotateStep );
      }
    });

    const unsubscribeWalk = subscribeKeys(
      (state) => state,
      ({ forward, rightward, backward, leftward }) => {
        if (forward) {
          move({ x: 0, z: -1 });
        } else if (backward) {
          move({ x: 0, z: 1 });
        } else if (leftward) {
          move({ x: -1, z: 0 });
        } else if (rightward) {
          move({ x: 1, z: 0 });
        }
      }
    );

    return () => {
      // <-- cleanup
      unsubscribeWalk();
	  };
  }, { dependencies: [ subscribeKeys, targetPosition ] });

  React.useEffect(() => {
    const unsubscribeReset = useGame.subscribe( 
      (state) => state.phase,
      (phase) => {
        if ( phase === 'ready' ) reset();
      }
    );

    const unsubscribeAny = subscribeKeys(() => {
      start();
    });

    return () => {
      unsubscribeAny();
      unsubscribeReset();
    } 
  }, [ subscribeKeys ]);

  useFrame((state, delta) => {
    if (!playerRef.current) return;
    const playerPosition = playerRef.current.translation();

    // player rotation
    // quaternion.setFromEuler( targetRotation );
    playerRef.current.setNextKinematicRotation( targetQuat );

    // move player
    playerRef.current.setNextKinematicTranslation( targetPosition );

    // control camera position
    cameraPosition.copy( playerPosition );
    cameraPosition.y += 4;
    // cameraPosition.y += 0.65;
    cameraPosition.z += 2.25;

    cameraTarget.copy(playerPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta );
    smoothedCameraTarget.lerp( cameraTarget, 5 * delta );

    state.camera.position.copy( smoothedCameraPosition );
    state.camera.lookAt( smoothedCameraTarget );

    // restart
    if (  playerPosition.y < -4 ) {
      restart();
    }
  });
  
  return (
    <>
      <RigidBody 
        ref={ playerRef } 
        name="player"
        canSleep={ false } 
        colliders="ball"
        type="kinematicPosition"
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