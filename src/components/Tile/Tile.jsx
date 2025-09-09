import React from 'react';
// import Bounds from '@components/Bounds/Bounds';
import useGame from '@stores/useGame';
import { worldToGrid } from '@lib/utils';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const materialColors = [
  "white",
  "black",
  "red",
  "green"
];

function Tile({ value, position, params, ...delegated }) {
  const colorID = value ? 1 : 0;
  const key = `${params[0]}-${params[1]}`;
  const ref = React.useRef(null);

  // stores
  const activeTraps = useGame( (state) => state.activeTraps[ key ] );
  const restart = useGame( (state) => state.restart );

  useGSAP((context, contextSafe) => {
    const target = ref.current;
    if (!target || !activeTraps) return;

    gsap.to( target.position, {
      y: 0.1,
      duration: 0.4,
      onComplete: () => restart()
    });
  }, { dependencies: [ activeTraps ] }); 

  return (
    <>
      { activeTraps && (
        <mesh ref={ ref} position={[  position[0], position[1] - 0.1, position[2]]} { ...delegated }>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicNodeMaterial color={ materialColors[ colorID ] } />
        </mesh>
      ) }
      {/* <mesh position={ position } { ...delegated }>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicNodeMaterial color={ materialColors[ colorID ] } />
      </mesh> */}
    </>
  )
}

export default React.memo( Tile );