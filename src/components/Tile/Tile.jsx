import React from 'react';
// import Bounds from '@components/Bounds/Bounds';
import useGame from '@stores/useGame';

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
  const ref = React.useRef(null);
  
  const colorID = value ? 1 : 0;
  const key = `${params[0]}-${params[1]}`;

  // stores
  const restart = useGame( (state) => state.restart );
  const visitedTiles = useGame( (state) => state.visitedTiles[ key ] );

  useGSAP((context, contextSafe) => {
    const target = ref.current;
    if ( !target || !visitedTiles.trap ) return;

    gsap.to( target.position, {
      y: 0.1,
      duration: 0.4,
      onComplete: () => restart()
    });

  }, { dependencies: [ visitedTiles ] }); 

  return (
    <>
      { visitedTiles?.visited && (
        <mesh ref={ ref} position={[  position[0], position[1] - 0.1, position[2]]} { ...delegated }>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicNodeMaterial color={ materialColors[ colorID ] } />
        </mesh>
      ) }
    </>
  )
}

export default React.memo( Tile );