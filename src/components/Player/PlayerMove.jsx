import React from 'react';
import * as THREE from 'three';

// 3D libraries
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import { useRapier } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';

// stores
import useGame from '@stores/useGame';

function PlayerMove({ children, objectToMove }) {
  const { WALK_SPEED, RUN_SPEED } = useControls('Character control', {
    WALK_SPEED: { value: 3, min: 0.1, max: 10, step: 0.1 },
    RUN_SPEED: { value: 6, min: 0.1, max: 20, step: 0.1 },
  });
  const [ positionOnGrid, setPositionOnGrid ] = React.useState(() => {
    if (!objectToMove.current) return { x: 0, y: 0, z: 0 };

    const { x, y, z } = objectToMove.current.translation();
    return { x, y, z };
  });

  const { rapier, world } = useRapier();
  const [ subscribeKeys, getKeys ] = useKeyboardControls();
  
  const restart = useGame( (state) => state.restart );
  const mapSize = useGame( (state) => state.mapSize );
  const setPlayerPosition = useGame( (state) => state.setPlayerPosition );
  
  
  // jump
  function jump() {
    const origin = objectToMove.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if (hit.timeOfImpact < 0.15) {
      objectToMove.current.applyImpulse({ x: 0, y: 0.5, z: 0 }); 
    }
  }

  function reset() {
    objectToMove.current.setTranslation({ x: 0, y: 1, z: 0 });
    objectToMove.current.setLinvel({ x: 0, y: 0, z: 0 });
    objectToMove.current.setAngvel({ x: 0, y: 0, z: 0 });
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

  React.useEffect(() => {}, []);

  const lerp = React.useCallback( (a, b, t) => {
    return a + (b - a) * t;
  }, []);

  useFrame((state, delta) => {
    if ( !objectToMove.current ) return;
    // movement
    const { forward, run, backward, leftward, rightward } = getKeys();
    
    // forces 
    const vel = objectToMove.current.linvel();
    const movement = { x: 0, z: 0 };
    // const torque = { x: 0, y: 0, z: 0 };

    const speed = run ? RUN_SPEED : WALK_SPEED;

    const lineForce = speed * delta * 50;
    // const torqueForce = (lineForce / 0.3);

    // movement
    if (forward) {
      movement.z -= lineForce;
      // torque.x -= torqueForce;
    }
    if (backward) {
      movement.z += lineForce;
      // torque.x += torqueForce;
    }
    if (leftward) {
      movement.x -= lineForce;
      // torque.z += torqueForce;
    }
    if (rightward) {
      movement.x += lineForce;
      // torque.z -= torqueForce;
    }

    // lerp
    const newVel = {
      x: lerp(vel.x, movement.x, delta * 10),
      y: vel.y,
      z: lerp(vel.z, movement.z, delta * 10),
    };
    
    // apply forces
    objectToMove.current.setLinvel( newVel, true );

    // get player position
    const playerPosition = objectToMove.current.translation();

    // snap position to grid
    const ROWS = mapSize.rows;
    const COLUMNS = mapSize.columns;
    const CELL_SIZE = mapSize.cellSize;

    const onGridX = Math.floor( playerPosition.x + COLUMNS * 0.5 );
    const onGridZ = Math.round( playerPosition.z + ( ROWS - CELL_SIZE * 0.5 ) );

    const snapX = Math.max( 0, Math.min(COLUMNS - 1, onGridX) );
    const snapZ = Math.max( 0, Math.min(ROWS - 1, onGridZ) );

    // update player on grid position
    if ( positionOnGrid.x !== snapX || positionOnGrid.z !== snapZ ) {
      // positionOnGrid.x = snapX;
      // positionOnGrid.y = playerPosition.y;
      // positionOnGrid.z = snapZ;
      setPositionOnGrid(() => ({x: snapX, y: positionOnGrid.y, z: snapZ}));

      setPlayerPosition({ x: snapX, y: positionOnGrid.y, z: snapZ });
    }

    // restart
    if (  playerPosition.y < -4 ) {
      restart();
    }
  });
  
  return children;
}

export default PlayerMove;