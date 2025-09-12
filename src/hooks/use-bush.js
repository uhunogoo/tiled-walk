import React from 'react';
import * as THREE from 'three/webgpu';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

// Defaults
const PI = Math.PI;

function useBush() {
  const bushInstance = React.useMemo(() => {
    const count = 30;
    const planes = [];

    for (let i = 0; i < count; i++ ) {
      const plane = new THREE.PlaneGeometry( 1, 1 );

      // Spherical
      const spherical = new THREE.Spherical(
        1 - Math.pow( Math.random(), 3 ),
        PI * 2 * Math.random(),
        PI * Math.random(),
      );

      // Position
      const position = new THREE.Vector3().setFromSpherical( spherical );
      plane.rotateX( Math.random() * 9999 );
      plane.rotateY( Math.random() * 9999 );
      plane.rotateZ( Math.random() * 9999 );

      // Translate
      plane.translate(
        position.x,
        position.y,
        position.z
      );

      // Normal
      const normal = position.clone().normalize();
      const normalArray = new Float32Array( 12 );

      // Calculate normals
      for (let i = 0; i < 4; i++) {
        const i3 = i * 3;
        const position = new THREE.Vector3(
          plane.attributes.position.array[i3 + 0],
          plane.attributes.position.array[i3 + 1],
          plane.attributes.position.array[i3 + 2]
        );

        const mixedNormal = position.lerp( normal, 0.4 );

        normalArray[i3 + 0] = mixedNormal.x;
        normalArray[i3 + 1] = mixedNormal.y;
        normalArray[i3 + 2] = mixedNormal.z;
      }

      // Set new normals
      plane.setAttribute( 'normal', new THREE.BufferAttribute( normalArray, 3 ) );

      // Add plane
      planes.push( plane );
    }

    const mergedGeometry = new BufferGeometryUtils.mergeGeometries( planes );
    
    return mergedGeometry;
  }, []);

  return bushInstance;
}

export default useBush;