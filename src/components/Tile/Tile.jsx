// import Bounds from '@components/Bounds/Bounds';
import useGame from '@stores/useGame';
import React from 'react';

const materialColors = [
  "white",
  "black",
  "red",
  "green"
];

function Tile({ value, position, ...delegated }) {
  const colorID = value ? 1 : 0;
  const restart = useGame( (state) => state.restart );
  return (
    <>
      <mesh position={ position } { ...delegated }>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicNodeMaterial color={ materialColors[ colorID ] } />
      </mesh>
    </>
  )
}

export default React.memo( Tile );