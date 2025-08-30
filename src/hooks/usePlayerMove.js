import * as React from 'react';

import { useFrame } from '@react-three/fiber';
import { useRapier } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';

// stores
import useGame from '@stores/useGame';
import { useControls } from 'leva';

function usePlayerMove( player ) {
  if ( !player ) return;
  const { WALK_SPEED, RUN_SPEED, TOURQUE } = useControls('Character control', {
    WALK_SPEED: { value: 3, min: 0.1, max: 10, step: 0.1 },
    RUN_SPEED: { value: 6, min: 0.1, max: 20, step: 0.1 },
    // TOURQUE: { value: 0.3, min: 0.1, max: 2, step: 0.1 },
  });

  const { rapier, world } = useRapier();
  const restart = useGame( (state) => state.restart );
  const [ subscribeKeys, getKeys ] = useKeyboardControls();
  
  
  // jump
  function jump() {
    const origin = player.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if (hit.timeOfImpact < 0.15) {
      player.current.applyImpulse({ x: 0, y: 0.5, z: 0 }); 
    }
  }

  function reset() {
    player.current.setTranslation({ x: 0, y: 1, z: 0 });
    player.current.setLinvel({ x: 0, y: 0, z: 0 });
    player.current.setAngvel({ x: 0, y: 0, z: 0 });
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

    return () => {
      unsubscribeJump();
      unsubscribeReset();
    } 
  }, [ subscribeKeys ]);

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  useFrame((state, delta) => {
    if ( !player.current ) return;
    // movement
    const { forward, run, backward, leftward, rightward } = getKeys();
    
    // forces 
    const vel = player.current.linvel();
    const movement = { x: 0, z: 0 };
    // const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const speed = run ? RUN_SPEED : WALK_SPEED;

    const lineForce = speed * delta * 50;
    const torqueForce = (lineForce / 0.3);

    // movement
    if (forward) {
      movement.z -= lineForce;
      torque.x -= torqueForce;
    }
    if (backward) {
      movement.z += lineForce;
      torque.x += torqueForce;
    }
    if (leftward) {
      movement.x -= lineForce;
      torque.z += torqueForce;
    }
    if (rightward) {
      movement.x += lineForce;
      torque.z -= torqueForce;
    }

    // lerp
    const newVel = {
      x: lerp(vel.x, movement.x, delta * 10),
      y: vel.y,
      z: lerp(vel.z, movement.z, delta * 10),
    };
    
    // apply forces
    player.current.setLinvel( newVel, true );
    // player.current.applyTorqueImpulse( torque, true );
    // player.current.setAngvel( torque, true)

    // get player position
    const playerPosition = player.current.translation();

    // restart
    if (  playerPosition.y < -4 ) {
      restart();
    }
  });

  return null;
}

export default usePlayerMove;