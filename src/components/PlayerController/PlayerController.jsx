import React from 'react';

// 3D libraries
import { useRapier } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// stores
import useGame from '@stores/useGame';


function PlayerController({ children }) {
  // const playerRef = React.useRef();
  const [ subscribeKeys, getKeys ] = useKeyboardControls();
  const { rapier, world } = useRapier();

  // stores
  const phase = useGame( (state) => state.phase );
  const start = useGame( (state) => state.start );
  const player = useGame( (state) => state.player );
  const restart = useGame( (state) => state.restart );

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

  function reset( player ) {
    player.setTranslation({ x: 0, y: 1, z: -0.5 });
    player.setLinvel({ x: 0, y: 0, z: 0 });
    player.setAngvel({ x: 0, y: 0, z: 0 });
  };

  React.useEffect(() => {
    const selectorFunction = ( state ) => state.jump;
    const listenerFunction = ( value ) => {
      if ( !value || phase === 'trapped' ) return;
      
      jump();
    }

    const unsubscribeReset = useGame.subscribe( 
      (state) => state.phase,
      (phase) => {
        if ( phase === 'ready' ) {
          reset( player.current );
        }
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
  }, [ subscribeKeys, player ]);

  useFrame((state, delta) => {
    if ( !player?.current ) return;

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
    if (phase === 'trapped') {
      player.current.setLinearDamping(6.0);
      player.current.setAngularDamping(6.0);

      impulse.x = 0;
      impulse.z = 0;
      torque.x = 0;
      torque.z = 0;

    } else {
      player.current.setLinearDamping(0.5);   // повертаєш у норму
      player.current.setAngularDamping(0.5);
    }
    // apply forces
    player.current.applyImpulse( impulse );
    player.current.applyTorqueImpulse(torque);
    
    const playerPosition = player.current.translation();
    // end game
    // if ( playerPosition.z < - ( blocksCount * 4 + 2) ) {
    //   end();
    // }

    
    // restart
    if ( playerPosition.y < -4 ) {
      restart();
    }
  });
  
  return children;
}

export default PlayerController;