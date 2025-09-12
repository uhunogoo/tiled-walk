import React from 'react';
import { Instance, Instances } from '@react-three/drei';
import { range } from '@lib/utils';
import LeafMaterial from '@components/Materials/LeafMaterial';
import useBush from '@hooks/use-bush';

// Defaults
const PI = Math.PI;

function BushInstance({ count = 1, columns = 1, columnStep = 1, ...delegated }) {
  const bush = useBush();
  const data = React.useMemo(() => {
    const data = range( count * columns ).map((item, i) => {
      const row = i % count;
      const column = Math.floor( i / count );
      
      const position = [ column * (columnStep + 1), 0, -row];
      const rotation = [ PI * Math.random(), PI * Math.random() * 2, PI * Math.random() ];

      return { 
        position: position, 
        rotation: rotation, 
        scale: 0.4
      };
    });
    return data;
  }, [ count, columns, columnStep ]);
  
  return (
    <>
      <Instances range={ count * columns } geometry={ bush } castShadow {...delegated} frustumCulled={ true } computeBoundingBox={true} >
        {/* <meshNormalNodeMaterial side={ THREE.DoubleSide } /> */}
        <LeafMaterial />
        { data.map((props, i) => (
          <Instance key={i} {...props} />
        )) }
      </Instances>
    </>
  );
}

export default BushInstance;